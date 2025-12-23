const express = require('express');
const cors = require('cors');
const { prorate } = require('./prorate'); // Import the correct proration algorithm

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://allocation-portal.vercel.app",
  process.env.FRONTEND_URL
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true
}));

app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'UP',
    service: 'Allocation Portal API',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Allocation Portal API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      prorate: '/api/prorate (POST)'
    }
  });
});

app.get('/api', (req, res) => {
  res.json({
    message: 'Allocation Portal API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      prorate: '/api/prorate (POST)'
    }
  });
});

// Main proration endpoint - NOW USES THE CORRECT ALGORITHM
app.post('/api/prorate', (req, res) => {
  try {
    const { allocation_amount, investor_amounts } = req.body;

    // Validate input
    if (!allocation_amount || !investor_amounts || !Array.isArray(investor_amounts)) {
      return res.status(400).json({
        error: 'Invalid input. Required: allocation_amount and investor_amounts array'
      });
    }

    // Validate each investor has required fields
    const invalidInvestors = investor_amounts.filter(inv =>
        !inv.name ||
        inv.requested_amount === undefined ||
        inv.average_amount === undefined
    );

    if (invalidInvestors.length > 0) {
      return res.status(400).json({
        error: 'Each investor must have name, requested_amount, and average_amount'
      });
    }

    // Calculate proration using the CORRECT algorithm from prorate.js
    const results = prorate(allocation_amount, investor_amounts);

    res.json(results);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      error: 'Failed to calculate proration',
      details: error.message
    });
  }
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log('===========================================');
    console.log(` Allocation Portal API is running!`);
    console.log(` Port: ${PORT}`);
    console.log(` API: http://localhost:${PORT}/api`);
    console.log(` Health: http://localhost:${PORT}/api/health`);
    console.log('===========================================');
  });
}

// Export for Vercel
module.exports = app;