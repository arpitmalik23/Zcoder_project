// routes/comments.js

const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');
const { authenticateToken } = require('../middleware/authMiddleware'); // ✅ Correct import

// GET comments for a specific post
router.get('/:postId', async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId })
      .populate('author', 'username email');
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching comments', error: err.message });
  }
});

// POST a new comment (protected route)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { postId, content } = req.body;

    const newComment = new Comment({
      postId,
      content,
      author: req.user.id // user set by JWT middleware
    });

    await newComment.save();
    res.status(201).json(newComment);
  } catch (err) {
    res.status(500).json({ message: 'Error saving comment', error: err.message });
  }
});

module.exports = router;
