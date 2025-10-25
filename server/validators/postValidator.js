const { body } = require("express-validator");

exports.createPostValidator = [
    body("title")
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),

    body("content")
    .notEmpty()
    .withMessage("Content is required"),

    body("author")
    .notEmpty()
    .withMessage("Author is required")
    .isMongoId()
    .withMessage("Author must be a valid user ID"),

    body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isMongoId()
    .withMessage("Category must be a valid category ID"),

    body("tags")
    .optional()
    .isArray()
    .withMessage("Tags must be an array of strings"),
];

