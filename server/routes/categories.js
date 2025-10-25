const express = require('express');
const router = express.Router();
const {
  getAllCategories,
  createCategory,
} = require('../controllers/categoryController');

const { createCategoryValidator } = require("../validators/categoryValidator");
const validateRequest = require("../middlewares/validateRequest");

// Routes
router.get('/', getAllCategories);
router.post('/', createCategoryValidator, validateRequest, createCategory);

module.exports = router;
