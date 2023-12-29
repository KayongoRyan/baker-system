const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/bakery', { useNewUrlParser: true, useUnifiedTopology: true });

// Define the order schema
const orderSchema = new mongoose.Schema({
    items: [{ type: String }],
    totalPrice: Number,
});

// Create a model based on the schema
const Order = mongoose.model('Order', orderSchema);

// API endpoint to submit orders
app.post('/', async (req, res) => {
    try {
        const newOrder = new Order({
            items: req.body.items,
            totalPrice: req.body.totalPrice,
        });

        const savedOrder = await newOrder.save();
        res.json(savedOrder);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// API endpoint to get all orders
app.get('/api/orders', async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

app.post('/orders', (req, res) => {
    const { name, price, category, quantity} = req.body;
 
    if (!name || !price || !category || !quantity) {
       return res.status(400).json({ error: 'Name and price are required' });
    }
 
    const insertQuery = products;
    const values = [name, price, category, quantity];
 
    db.query(insertQuery, values, (err, result) => {
       if (err) {
          console.error('Error adding product:', err);
          return res.status(500).json({ error: 'Internal Server Error' });
       }
 
       console.log('Product added successfully');
       res.status(201).json({ message: 'Product added successfully', productId: result.insertId });
    });
 })