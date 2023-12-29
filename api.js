const express = require('express');
const router = express.Router();

const products = [
  { id: 1, name: 'Sambusa', price: 2.50 },
  { id: 2, name: 'Pain-coupe', price: 3.00 },
];

// GET all products
router.get('/products', (req, res) => {
  res.json(products);
});

// GET a specific product by ID
router.get('/products/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const product = products.find(item => item.id === productId);

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

// POST a new product
router.post('/products', (req, res) => {
  const newProduct = req.body;
  products.push(newProduct);
  res.status(201).json({ success: true, data: newProduct });
});

// PUT (update) a product by ID
router.put('/products/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const updatedProduct = req.body;

  const index = products.findIndex(item => item.id === productId);

  if (index !== -1) {
    products[index] = { ...products[index], ...updatedProduct };
    res.json({ success: true, data: products[index] });
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

router.delete('/products/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const index = products.findIndex(item => item.id === productId);

  if (index !== -1) {
    const deletedProduct = products.splice(index, 1);
    res.json({ success: true, data: deletedProduct[0] });
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

module.exports = router;
