const express = require('express');
const router = express.Router();
const Staff = require('../models/Staff');

router.post('/login', async (req, res) => {
  try {
    const { pin } = req.body;
    if (!pin) {
      return res.status(400).json({ error: 'PIN is required' });
    }
    const staff = await Staff.findOne({ pin }).populate('userId', 'username role');
    if (!staff) {
      return res.status(401).json({ error: 'Invalid PIN' });
    }
    res.json({
      staffId: staff._id,
      userId: staff.userId._id,
      username: staff.userId.username,
      role: staff.role,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
