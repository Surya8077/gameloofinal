const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { OAuth2Client } = require('google-auth-library');
const { FB } = require('fb');
const axios = require('axios');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');

// Load environment variables
dotenv.config();

// Set default values if environment variables are not set
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gaming-website';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-123';
const PORT = 8080; // Force port to 8080
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://127.0.0.1:5502';

const app = express();

// Middleware
app.use(cors({
    origin: ['http://127.0.0.1:5502', 'http://localhost:5502', 'http://localhost:8080'],
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

// Test route
app.get('/test', (req, res) => {
    console.log('Test endpoint hit');
    res.json({ 
        message: 'Server is running!',
        timestamp: new Date().toISOString(),
        mongodbStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

// MongoDB Connection with retry logic
const connectWithRetry = async () => {
    try {
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            family: 4
        });
        console.log('Connected to MongoDB successfully');
        console.log('MongoDB URI:', MONGODB_URI);
    } catch (err) {
        console.error('MongoDB connection error:', err);
        console.log('Retrying in 5 seconds...');
        setTimeout(connectWithRetry, 5000);
    }
};

// Initial connection attempt
connectWithRetry();

// Import models
const User = require('./models/User');
const Game = require('./models/Game');
const Order = require('./models/Order');
const Cart = require('./models/Cart');
const Review = require('./models/Review');

// Make models available globally
app.locals.models = {
    User,
    Game,
    Order,
    Cart,
    Review
};

// Google OAuth client
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Facebook configuration
FB.setAccessToken(process.env.FACEBOOK_APP_TOKEN);

// GitHub OAuth configuration
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || 'Ov23liH82Td38D3bSBDI';
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || '4c3d4e5f6g7h8i9j0k';
const GITHUB_CALLBACK_URL = 'http://localhost:8080/github-callback';

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

// Routes
app.use('/api/auth', authRoutes);

app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      username,
      email,
      password: hashedPassword
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({
      success: false,
      message: 'Error registering user'
    });
  }
});

app.post('/google-login', async (req, res) => {
  try {
    const { token, email, name } = req.body;

    // Verify Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    
    // Check if user exists
    let user = await User.findOne({ email: payload.email });
    
    if (!user) {
      // Create new user
      user = new User({
        username: payload.name,
        email: payload.email,
        googleId: payload.sub,
        picture: payload.picture
      });
      await user.save();
    }

    // Generate JWT token
    const jwtToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Google login successful',
      token: jwtToken,
      user: {
        name: user.username,
        email: user.email,
        picture: user.picture
      }
    });
  } catch (err) {
    next(err);
  }
});

app.post('/facebook-login', async (req, res) => {
  try {
    const { accessToken, userID, email, name } = req.body;

    // Verify Facebook token
    const response = await FB.api('/me', {
      fields: ['id', 'name', 'email', 'picture'],
      access_token: accessToken
    });

    if (!response || response.error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Facebook token'
      });
    }

    // Check if user exists
    let user = await User.findOne({ email: response.email });
    
    if (!user) {
      // Create new user
      user = new User({
        username: response.name,
        email: response.email,
        facebookId: response.id,
        picture: response.picture?.data?.url
      });
      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Facebook login successful',
      token,
      user: {
        name: user.username,
        email: user.email,
        picture: user.picture
      }
    });
  } catch (err) {
    next(err);
  }
});

app.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

// Protected route example
app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (err) {
    next(err);
  }
});

// Game Routes
app.get('/api/games', async (req, res, next) => {
  try {
    const games = await Game.find();
    res.json({
      success: true,
      games
    });
  } catch (err) {
    next(err);
  }
});

app.get('/api/games/:id', async (req, res, next) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found'
      });
    }
    res.json({
      success: true,
      game
    });
  } catch (err) {
    next(err);
  }
});

// Order Routes
app.post('/api/orders', authenticateToken, async (req, res, next) => {
  try {
    const { gameId, price, paymentMethod, transactionId } = req.body;
    
    const order = new Order({
      userId: req.user.userId,
      gameId,
      price,
      paymentMethod,
      transactionId,
      status: 'completed'
    });
    
    await order.save();
    
    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order
    });
  } catch (err) {
    next(err);
  }
});

app.get('/api/orders/user', authenticateToken, async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.user.userId })
      .populate('gameId')
      .sort({ orderDate: -1 });
      
    res.json({
      success: true,
      orders
    });
  } catch (err) {
    next(err);
  }
});

// GitHub OAuth endpoints
app.get('/github-callback', async (req, res) => {
  const { code } = req.query;
  
  try {
    // Exchange code for access token
    const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', {
      client_id: GITHUB_CLIENT_ID,
      client_secret: GITHUB_CLIENT_SECRET,
      code: code,
      redirect_uri: GITHUB_CALLBACK_URL
    }, {
      headers: {
        Accept: 'application/json'
      }
    });

    const accessToken = tokenResponse.data.access_token;

    // Get user info from GitHub
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    const userData = userResponse.data;

    // Get user email from GitHub
    const emailResponse = await axios.get('https://api.github.com/user/emails', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    const primaryEmail = emailResponse.data.find(email => email.primary)?.email || userData.email;

    // Check if user exists
    let user = await User.findOne({ email: primaryEmail });
    
    if (!user) {
      // Create new user
      user = new User({
        username: userData.login,
        email: primaryEmail,
        githubId: userData.id,
        picture: userData.avatar_url
      });
      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Send success response to popup
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>GitHub Authentication</title>
          <script>
            window.onload = function() {
              window.opener.postMessage({
                type: 'github-auth',
                code: '${code}',
                success: true
              }, 'http://127.0.0.1:5502');
            }
          </script>
        </head>
        <body style="background-color: #0d1117; color: #c9d1d9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0;">
          <div style="text-align: center; padding: 20px;">
            <h2 style="margin-bottom: 20px;">Authentication Successful!</h2>
            <p>You can close this window.</p>
          </div>
        </body>
      </html>
    `);
  } catch (err) {
    console.error('GitHub callback error:', err);
    // Send error response to popup
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>GitHub Authentication</title>
          <script>
            window.onload = function() {
              window.opener.postMessage({
                type: 'github-auth',
                success: false,
                error: 'Authentication failed'
              }, 'http://127.0.0.1:5502');
            }
          </script>
        </head>
        <body style="background-color: #0d1117; color: #c9d1d9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0;">
          <div style="text-align: center; padding: 20px;">
            <h2 style="margin-bottom: 20px; color: #f85149;">Authentication Failed</h2>
            <p>Please try again.</p>
          </div>
        </body>
      </html>
    `);
  }
});

app.post('/github-login', async (req, res) => {
  try {
    const { code } = req.body;

    // Exchange code for access token
    const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', {
      client_id: GITHUB_CLIENT_ID,
      client_secret: GITHUB_CLIENT_SECRET,
      code: code,
      redirect_uri: GITHUB_CALLBACK_URL
    }, {
      headers: {
        Accept: 'application/json'
      }
    });

    const accessToken = tokenResponse.data.access_token;

    // Get user info from GitHub
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    const userData = userResponse.data;

    // Get user email from GitHub
    const emailResponse = await axios.get('https://api.github.com/user/emails', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    const primaryEmail = emailResponse.data.find(email => email.primary)?.email || userData.email;

    // Check if user exists
    let user = await User.findOne({ email: primaryEmail });
    
    if (!user) {
      // Create new user
      user = new User({
        username: userData.login,
        email: primaryEmail,
        githubId: userData.id,
        picture: userData.avatar_url
      });
      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'GitHub login successful',
      token,
      user: {
        id: user._id,
        name: user.username,
        email: user.email,
        picture: user.picture
      }
    });
  } catch (err) {
    console.error('GitHub login error:', err);
    res.status(500).json({
      success: false,
      message: 'GitHub login failed'
    });
  }
});

// Add error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: err.message
    });
});

// Add error handling for server startup
const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`CORS enabled for origins: ${process.env.CORS_ORIGIN || 'http://127.0.0.1:5502'}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please try a different port.`);
    process.exit(1);
  } else {
    console.error('Server error:', err);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        console.log('Server closed');
        mongoose.connection.close(false, () => {
            console.log('MongoDB connection closed');
            process.exit(0);
        });
    });
});