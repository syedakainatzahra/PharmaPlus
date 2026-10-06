const prisma = require('../config/db');

// 1. RECEIVE/ADD STOCK BATCH TO LOCATION
exports.addStockBatch = async (req, res) => {
  try {
    const { productId, locationId, batchNumber, quantity, expiryDate } = req.body;

    const inventoryBatch = await prisma.inventory.create({
      data: {
        productId,
        locationId,
        batchNumber,
        quantity: parseInt(quantity),
        expiryDate: new Date(expiryDate), // Ensures FEFO tracking
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Stock batch added successfully!',
      data: inventoryBatch,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error adding stock batch',
      error: error.message,
    });
  }
};

// 2. GET AVAILABLE STOCK VIA FEFO LOGIC (First-Expiry-First-Out)
exports.getAvailableStockFEFO = async (req, res) => {
  try {
    const { productId, locationId } = req.params;

    // Fetch batches sorted by Expiry Date ascending (FEFO)
    const stockBatches = await prisma.inventory.findMany({
      where: {
        productId,
        locationId,
        quantity: { gt: 0 }, // Only available stock
        expiryDate: { gt: new Date() }, // Filter out already expired medicines
      },
      orderBy: {
        expiryDate: 'asc', // FEFO Core Logic: Nearest expiry comes first!
      },
    });

    // Calculate total stock available across valid batches
    const totalAvailableQuantity = stockBatches.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    return res.status(200).json({
      success: true,
      locationId,
      productId,
      totalQuantity: totalAvailableQuantity,
      fefoBatches: stockBatches, // Prioritized dispatch list
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching FEFO stock data',
      error: error.message,
    });
  }
};