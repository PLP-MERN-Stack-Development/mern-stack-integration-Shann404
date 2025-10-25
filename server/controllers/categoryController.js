const Category = require('../models/Category');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort('name');
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Create a new category
// @route   POST /api/categories
// @access  Public or Admin (depending on your setup)
const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    // Check if category already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory)
      return res.status(400).json({ message: 'Category already exists' });

    const category = new Category({ name });
    const savedCategory = await category.save();

    res.status(201).json(savedCategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  getAllCategories,
  createCategory,
};
