const express = require('express');
const router = express.Router();

const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');

// All Category Routes
router.post('/', createCategory);           // Create category
router.get('/', getAllCategories);          // Get all categories
router.get('/:id', getCategoryById);        // Get category by ID
router.put('/:id', updateCategory);         // Update category by ID
router.delete('/:id', deleteCategory);      // Delete category by ID

module.exports = router;