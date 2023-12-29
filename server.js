const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Simulated data array
let products = [
  { id: 1, name: 'Product 1' },
  { id: 2, name: 'Product 2' },
  // Add more simulated data as needed
];

// Create a new product
app.post('/api/products', (req, res) => {
  const newProduct = req.body;
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// Get all products
app.get('/api/products', (req, res) => {
  res.status(200).json(products);
});

// Get a single product by ID
app.get('/api/products/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const product = products.find(p => p.id === productId);

  if (product) {
    res.status(200).json(product);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

// Update a product by ID
app.put('/api/products/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const updatedProduct = req.body;
  const index = products.findIndex(p => p.id === productId);

  if (index !== -1) {
    products[index] = { ...products[index], ...updatedProduct };
    res.status(200).json(products[index]);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

// Delete a product by ID
app.delete('/api/products/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const index = products.findIndex(p => p.id === productId);

  if (index !== -1) {
    const deletedProduct = products.splice(index, 1);
    res.status(200).json(deletedProduct);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
