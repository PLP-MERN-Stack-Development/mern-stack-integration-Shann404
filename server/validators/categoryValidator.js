const { body } = require("express-validator");

exports.createCategoryValidator = [
    body("name")
    .notEmpty()
    .withMessage("Category name is required")
    .isLength({ max: 50 })
    .withMessage("Category name cannot exceed 50 characters"),
];