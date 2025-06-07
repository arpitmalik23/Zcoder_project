const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authenticateToken } = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");

// Multer setup for file uploads
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

// =========================
// GET /api/profile
// =========================
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findOne(
      { email: req.user.email },
      { password: 0, __v: 0 }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    // Safely construct full image URL if available
    const profileImage = user.profileImage
      ? `http://localhost:5000/uploads/${user.profileImage}`
      : null;

    res.json({
      name: user.name,
      email: user.email,
      profileImage,
    });
  } catch (err) {
    console.error("GET /api/profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// =========================
// PUT /api/profile
// =========================
router.put("/profile", authenticateToken, upload.single("image"), async (req, res) => {
  try {
    const { name } = req.body;
    const email = req.user.email;
    const image = req.file ? req.file.filename : null;

    const updateData = {};
    if (name) updateData.name = name;
    if (image) updateData.profileImage = image; // store only filename

    const updatedUser = await User.findOneAndUpdate(
      { email },
      updateData,
      { new: true, projection: { password: 0, __v: 0 } }
    );

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    const profileImage = updatedUser.profileImage
      ? `http://localhost:5000/uploads/${updatedUser.profileImage}`
      : null;

    res.json({
      message: "Profile updated",
      user: {
        name: updatedUser.name,
        email: updatedUser.email,
        profileImage,
      }
    });
  } catch (err) {
    console.error("PUT /api/profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
