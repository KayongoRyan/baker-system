const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());

// Import the API routes
const apiRoutes = require('./api');
app.use('/api', apiRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Hello, this is the root of the API!');
});

app.listen(port, () => {
  console.log(`API Server is running on port ${port}`);
});
