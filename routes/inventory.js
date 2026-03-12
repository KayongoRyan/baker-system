const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');
const Product = require('../models/Product');

// Get all inventory
router.get('/', async (req, res) => {
  try {
    const inventory = await Inventory.find()
      .populate('productId', 'name category')
      .sort({ quantity: 1 });
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get low stock items
router.get('/low-stock', async (req, res) => {
  try {
    const inventory = await Inventory.find({
      $expr: { $lte: ['$quantity', '$lowStockThreshold'] },
    })
      .populate('productId', 'name category')
      .sort({ quantity: 1 });
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update inventory
router.put('/:id', async (req, res) => {
  try {
    const { quantity, lowStockThreshold } = req.body;
    const update = {};
    if (typeof quantity === 'number') update.quantity = quantity;
    if (typeof lowStockThreshold === 'number') update.lowStockThreshold = lowStockThreshold;
    const inventory = await Inventory.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true }
    ).populate('productId', 'name category');
    if (!inventory) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }
    res.json(inventory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Create inventory item
router.post('/', async (req, res) => {
  try {
    const { productId, quantity, unit, lowStockThreshold } = req.body;
    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    const existing = await Inventory.findOne({ productId });
    if (existing) {
      return res.status(400).json({ error: 'Inventory already exists for this product' });
    }
    const inventory = new Inventory({
      productId,
      quantity: quantity || 0,
      unit: unit || 'units',
      lowStockThreshold: lowStockThreshold || 10,
    });
    await inventory.save();
    await inventory.populate('productId', 'name category');
    res.status(201).json(inventory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
