const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');

// Sales by period
router.get('/sales', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const filter = {};
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }
    const orders = await Order.find({ ...filter, status: { $ne: 'cancelled' } });
    const totalSales = orders.reduce((sum, o) => sum + o.totalPrice, 0);
    const orderCount = orders.length;
    res.json({ totalSales, orderCount, orders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Top products
router.get('/top-products', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const orders = await Order.find({ status: { $ne: 'cancelled' } });
    const productSales = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        const name = item.productName;
        if (!productSales[name]) {
          productSales[name] = { name, quantity: 0, revenue: 0 };
        }
        productSales[name].quantity += item.quantity;
        productSales[name].revenue += item.totalPrice;
      });
    });
    const topProducts = Object.values(productSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, parseInt(limit));
    res.json(topProducts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Sales overview for charts (daily aggregation)
router.get('/sales-overview', async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    const orders = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate }, status: { $ne: 'cancelled' } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          total: { $sum: '$totalPrice' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
