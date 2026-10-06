const prisma = require('../config/db');

// 1. CREATE NEW BRANCH / WAREHOUSE (SUPER_ADMIN Only)
exports.createLocation = async (req, res) => {
  try {
    const { name, code, type, address, city } = req.body;

    const existingLocation = await prisma.location.findUnique({
      where: { code },
    });

    if (existingLocation) {
      return res.status(400).json({
        success: false,
        message: 'Branch code already exists.',
      });
    }

    const location = await prisma.location.create({
      data: {
        name,
        code, // e.g., "KHI-BRANCH-01" ya "CWH-01"
        type, // 'RETAIL_BRANCH' or 'CENTRAL_WAREHOUSE'
        address,
        city,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Location created successfully!',
      data: location,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error creating location',
      error: error.message,
    });
  }
};

// 2. GET ALL LOCATIONS
exports.getAllLocations = async (req, res) => {
  try {
    const locations = await prisma.location.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json({
      success: true,
      count: locations.length,
      data: locations,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching locations',
      error: error.message,
    });
  }
};