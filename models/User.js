const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['customer', 'staff', 'manager'], default: 'customer' },
  address: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
