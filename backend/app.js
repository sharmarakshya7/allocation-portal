const express = require('express');
const cors = require('cors');
const { prorate } = require('./prorate'); // Import the correct proration algorithm

const app = express();

const allowedOrigins = [
    "http://localhost:3000",
    process.env.FRONTEND_URL
];

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"]
    })
);

app.options("*", (req, res) => {
    res.sendStatus(200);
});

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

// Export for Vercel
module.exports = app;