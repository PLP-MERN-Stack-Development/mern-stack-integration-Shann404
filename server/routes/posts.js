const express = require("express");
const router = express.Router();
const {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  addComment,
  getComments,
} = require("../controllers/postController");

const { createPostValidator } = require("../validators/postValidator");
const validateRequest = require("../middlewares/validateRequest");

// Routes
router.get("/", getAllPosts);
router.get("/:id", getPostById);
router.post("/:id/comments",addComment);
router.post("/", createPostValidator,validateRequest,createPost);
router.put("/:id", createPostValidator,validateRequest,updatePost);
router.delete("/:id", deletePost);
router.get('/:id/comments', getComments);

module.exports = router;
