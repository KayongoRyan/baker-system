const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, enum: ['cashier', 'manager'], default: 'cashier' },
  pin: { type: String, required: true },
  permissions: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('Staff', staffSchema);
