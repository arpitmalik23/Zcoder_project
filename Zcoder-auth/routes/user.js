const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authenticateToken } = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// POST /profile
router.post('/profile', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  try {
    const user = await User.findOne({ email }, { password: 0, __v: 0 });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /profile/update
router.post('/profile/update', async (req, res) => {
  const { email, name } = req.body;
  if (!email || !name) {
    return res.status(400).json({ message: 'Email and name required' });
  }

  try {
    const updated = await User.findOneAndUpdate(
      { email },
      { name },
      { new: true, projection: { password: 0 } }
    );

    if (!updated) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'Profile updated', user: updated });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET protected user profile
router.get("/user/profile", authenticateToken, async (req, res) => {
   
  try {
    const user = await User.findOne({ email: req.user.email }, { password: 0 });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// PUT profile update with image
router.put("/user/profile", authenticateToken, upload.single("image"), async (req, res) => {
  try {
    const { name } = req.body;
    const email = req.user.email;
    const image = req.file ? req.file.filename : undefined;

    const updateData = { name };
    if (image) updateData.image = image;

    const updated = await User.findOneAndUpdate(
      { email },
      updateData,
      { new: true, projection: { password: 0 } }
    );

    if (!updated) return res.status(404).json({ message: "User not found" });

    res.json({ message: "Profile updated", user: updated });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
