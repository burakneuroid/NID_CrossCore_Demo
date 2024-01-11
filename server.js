const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors middleware
const { createProxyMiddleware } = require('http-proxy-middleware');
const memcached = require('memcached');
const client = new memcached();

const app = express();

// Enable CORS for all routes
app.use(cors());

// Serve static files from the root directory
app.use(express.static('public'));

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve your HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle form submission
app.post('/submit', async (req, res) => {
  console.log('Form data:', req.body);
  // You can process the form data here
  res.send('Form submitted successfully');
});

// Proxy API requests to https://api.neuro-id.com/v4.1
app.use(
  '/v4.1',
  createProxyMiddleware({
    target: 'https://api.neuro-id.com',
    changeOrigin: true,
  })
);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
