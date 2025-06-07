const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const auth = require('../middleware/authMiddleware');

// Get all posts
router.get('/', async (req, res) => {
  const posts = await Post.find().populate('author', 'username email');
  res.json(posts);
});

// Create post - protected
router.post('/', auth, async (req, res) => {
  const { title, content } = req.body;

  const newPost = new Post({
    title,
    content,
    author: req.user.id // comes from JWT
  });

  await newPost.save();
  res.json(newPost);
});
