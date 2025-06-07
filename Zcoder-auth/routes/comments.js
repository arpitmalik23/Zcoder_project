const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const auth = require('../middleware/authMiddleware');

// Get comments for a post
router.get('/:postId', async (req, res) => {
  const comments = await Comment.find({ postId: req.params.postId })
    .populate('author', 'username email');
  res.json(comments);
});

// Create comment - protected
router.post('/', auth, async (req, res) => {
  const { postId, content } = req.body;

  const newComment = new Comment({
    postId,
    content,
    author: req.user.id
  });

  await newComment.save();
  res.json(newComment);
});
