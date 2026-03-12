const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Get all orders
router.get('/', async (req, res) => {
  try {
    const { status, limit = 50 } = req.query;
    const filter = status ? { status } : {};
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .populate('staffId', 'role')
      .populate('customerId', 'username email');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single order by ID
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('staffId', 'role')
      .populate('customerId', 'username email');
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create order
router.post('/', async (req, res) => {
  try {
    const { items, staffId, customerId } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items array is required' });
    }
    const Product = require('../models/Product');
    const orderItems = [];
    for (const item of items) {
      let productId = item.productId;
      let productName = item.productName;
      let price = item.price;
      if (!productId && productName) {
        const product = await Product.findOne({ name: new RegExp(`^${productName}$`, 'i') });
        if (product) {
          productId = product._id;
          price = product.price;
        }
      }
      const qty = item.quantity || 1;
      orderItems.push({
        productId: productId || null,
        productName: productName || 'Unknown',
        price,
        quantity: qty,
        totalPrice: price * qty,
      });
    }
    const totalPrice = orderItems.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
    const order = new Order({
      items: orderItems,
      totalPrice,
      staffId: staffId || null,
      customerId: customerId || null,
    });
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update order status
router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Valid status is required' });
    }
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
