const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const Post = require('../models/Post'); // Make sure this model exists

// Get all posts (no authentication needed)
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'username');
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Create a new post (requires authentication)
router.post('/', authenticateToken, async (req, res) => {
  const { content, title } = req.body;
  try {
    const newPost = new Post({
      content,
      title,
      author: req.user.id, // req.user is set by authenticateToken
    });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to create post" });
  }
});

module.exports = router;
