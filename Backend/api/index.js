const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { OAuth2Client } = require('google-auth-library');
const { FB } = require('fb');
const axios = require('axios');
const dotenv = require('dotenv');
const authRoutes = require('../routes/auth');
const path = require('path'); // Import path module

// Load environment variables
dotenv.config();

// Set default values if environment variables are not set
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gaming-website';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-123';
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://127.0.0.1:5502';

const app = express();

// Middleware
app.use(cors({
    origin: ['http://127.0.0.1:5502', 'http://localhost:5502', 'http://localhost:8080', 'https://*.vercel.app'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Serve static files from the Frontend folder
app.use(express.static(path.join(__dirname, '../../Frontend'), {
    setHeaders: (res, filePath) => {
        if (path.extname(filePath) === '.js') {
            res.setHeader('Content-Type', 'application/javascript');
        }
    }
}));

// MongoDB Connection with retry logic and connection caching
let cachedDb = null;

const connectToDatabase = async () => {
    if (cachedDb) {
        console.log('Using cached database connection');
        return cachedDb;
    }

    try {
        const client = await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });

        cachedDb = client;
        console.log('MongoDB connected successfully');
        return client;
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
};

// Test route with MongoDB connection check
app.get('/test', async (req, res) => {
    try {
        await connectToDatabase();
        res.json({ 
            message: 'Server is running!',
            timestamp: new Date().toISOString(),
            mongodbStatus: 'connected'
        });
    } catch (error) {
        res.status(500).json({
            message: 'Server is running but MongoDB connection failed',
            timestamp: new Date().toISOString(),
            mongodbStatus: 'disconnected',
            error: error.message
        });
    }
});

// Corrected the root route to serve Landing.html as the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../Frontend/Landing.html'));
});

// Test route to directly serve Landing.html
app.get('/test-landing', (req, res) => {
    res.sendFile(path.join(__dirname, '../../Frontend/Landing.html'));
});

// Connect to MongoDB before starting the server
connectToDatabase().catch(err => {
    console.error('Failed to connect to MongoDB:', err);
});

// Use routes
app.use('/auth', authRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Export the Express API
module.exports = app;