const prisma = require('../config/db');

// 1. Create Category (POST)
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required',
      });
    }

    const category = await prisma.category.create({
      data: { name, description },
    });

    return res.status(201).json({
      success: true,
      message: 'Category created successfully!',
      data: category,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error creating category',
      error: error.message,
    });
  }
};

// 2. Get All Categories (GET)
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    return res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message,
    });
  }
};

// 3. Get Single Category By ID (GET)
exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching category',
      error: error.message,
    });
  }
};

// 4. Update Category By ID (PUT)
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Category updated successfully!',
      data: updatedCategory,
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error updating category',
      error: error.message,
    });
  }
};

// 5. Delete Category By ID (DELETE)
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.category.delete({
      where: { id },
    });

    return res.status(200).json({
      success: true,
      message: 'Category deleted successfully!',
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error deleting category',
      error: error.message,
    });
  }
};