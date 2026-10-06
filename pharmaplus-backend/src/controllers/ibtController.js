const prisma = require('../config/db');

// 1. CREATE AN INTER-BRANCH TRANSFER REQUEST
exports.createIBTRequest = async (req, res) => {
  try {
    const { fromLocationId, toLocationId, productId, requestedQuantity } = req.body;

    // Check if source location has enough stock
    const availableStock = await prisma.inventory.aggregate({
      where: {
        locationId: fromLocationId,
        productId,
        quantity: { gt: 0 },
        expiryDate: { gt: new Date() },
      },
      _sum: {
        quantity: true,
      },
    });

    const totalAvailable = availableStock._sum.quantity || 0;

    if (totalAvailable < requestedQuantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock at source branch. Requested: ${requestedQuantity}, Available: ${totalAvailable}`,
      });
    }

    const ibtRequest = await prisma.interBranchTransfer.create({
      data: {
        fromLocationId,
        toLocationId,
        productId,
        requestedQuantity: parseInt(requestedQuantity),
        status: 'PENDING',
        requestedById: req.user.userId,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Inter-Branch Stock Transfer request generated successfully!',
      data: ibtRequest,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error creating IBT request',
      error: error.message,
    });
  }
};

// 2. PROCESS / APPROVE IBT REQUEST (SUPER_ADMIN / WAREHOUSE_MANAGER)
exports.approveIBTRequest = async (req, res) => {
  try {
    const { ibtId } = req.params;

    const ibt = await prisma.interBranchTransfer.findUnique({
      where: { id: ibtId },
    });

    if (!ibt || ibt.status !== 'PENDING') {
      return res.status(400).json({
        success: false,
        message: 'Invalid IBT request or already processed.',
      });
    }

    // Update IBT status to COMPLETED
    const updatedIBT = await prisma.interBranchTransfer.update({
      where: { id: ibtId },
      data: {
        status: 'APPROVED',
        processedAt: new Date(),
      },
    });

    return res.status(200).json({
      success: true,
      message: 'IBT Request Approved successfully!',
      data: updatedIBT,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error approving IBT request',
      error: error.message,
    });
  }
};