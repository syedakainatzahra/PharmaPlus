const prisma = require('../config/db');

// 1. Create Product (POST)
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, categoryId } = req.body;

    if (!name || price === undefined || !categoryId) {
      return res.status(400).json({
        success: false,
        message: 'Name, price, and categoryId are required fields',
      });
    }

    // Check if Category exists
    const categoryExists = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message: 'Specified Category does not exist',
      });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        stock: stock ? parseInt(stock) : 0,
        categoryId,
      },
      include: {
        category: true, // Returns Category details with Product
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Product created successfully!',
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error creating product',
      error: error.message,
    });
  }
};

// 2. Get All Products (GET)
exports.getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message,
    });
  }
};

// 3. Get Single Product By ID (GET)
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message,
    });
  }
};

// 4. Update Product By ID (PUT)
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, categoryId } = req.body;

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(stock !== undefined && { stock: parseInt(stock) }),
        ...(categoryId && { categoryId }),
      },
      include: {
        category: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Product updated successfully!',
      data: updatedProduct,
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error updating product',
      error: error.message,
    });
  }
};

// 5. Delete Product By ID (DELETE)
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.product.delete({
      where: { id },
    });

    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully!',
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: error.message,
    });
  }
};