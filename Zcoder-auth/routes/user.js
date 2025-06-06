const express = require('express');
const router = express.Router();
const User = require('../models/User'); // make sure path is correct

router.post('/profile', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email }, { password: 0 }); // exclude password
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
