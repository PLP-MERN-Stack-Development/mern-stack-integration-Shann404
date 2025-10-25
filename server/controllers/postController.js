const Post = require("../models/Post");
const User = require('../models/User');
const mongoose = require("mongoose");
const Category = require("../models/Category");



const getAllPosts = async (req, res, next) => {
  try {
    let { page = 1, limit = 6, search = "", category, author, tag } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;

    const query= {};

    //  Search by title or content
    if (search) {
      const safeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

      query.$or = [
        { title: { $regex: safeSearch, $options: 'i' } },
          { content: { $regex: safeSearch, $options: 'i' } },
      ];
    }
    

    // Filter by category name (optional)
    if (category) {
      const categoryDoc = await Category.findOne({
        name: { $regex: category, $options: "i" },
      });
      if (categoryDoc) query.category = categoryDoc._id;
      else query.category = null; // avoid ObjectId cast error
    }

    // Filter by author
    if (author) query.author = author;

    // Filter by tag
    if (tag) query.tags = tag;

    // Count total posts (with filters)
    const totalPosts = await Post.countDocuments(query);

    // Fetch filtered and paginated posts
    const posts = await Post.find(query)
      .populate("author", "name email")
      .populate("category", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      totalPosts,
      totalPages: Math.ceil(totalPosts / limit),
      currentPage: page,
      posts,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/posts/:id - Get a specific blog post and increment view count
const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "name email")
      .populate("category", "name");

    if (!post) return res.status(404).json({ message: "Post not found" });

    await post.incrementViewCount();
    res.json(post);
  } catch (err) {
    next(err);
  }
};

// POST /api/posts - Create a new blog post
const createPost = async (req, res, next) => {
  try {
    const {
      title,
      content,
      featuredImage,
      excerpt,
      author,
      category,
      tags,
      isPublished,
    } = req.body;

    const slug = title.toLowerCase().replace(/[^\w ]+/g, "").replace(/ +/g, "-");

    const post = new Post({
      title,
      content,
      featuredImage,
      excerpt,
      author,
      category,
      tags,
      isPublished,
      slug,
    });

    const savedPost = await post.save();
    res.status(201).json(savedPost);
  } catch (err) {
    next(err);
  }
};

// PUT /api/posts/:id - Update an existing blog post
const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/posts/:id - Delete a blog post
const deletePost = async (req, res, next) => {
  try {
    const deleted = await Post.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Post not found" });
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    next(err);
  }
};

// POST /api/posts/:id/comments - Add a comment to a blog post
const addComment = async (req, res, next) => {
  try {
    const { userId, content } = req.body;

    if (!userId || !content) {
      return res.status(400).json({ message: "Missing userId or content" });
    }

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    await post.addComment(userId, content);
    res.status(201).json({ message: "Comment added successfully" });
  } catch (err) {
    console.error(" Error adding comment:", err);
    next(err);
  }
};

const getComments = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id).populate("comments.user", "name email");
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post.comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  addComment,
  getComments,
};
