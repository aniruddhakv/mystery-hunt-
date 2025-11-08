const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const User = require('./models/User');
const clues = require('./config/clues');
const { auth, adminAuth } = require('./middleware/auth');
const jwt = require('jsonwebtoken');

const app = express();

// Middleware
// CORS configuration for Railway backend + Vercel frontend
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://your-vercel-app.vercel.app', // Replace with your Vercel URL
    /\.vercel\.app$/ // Allow all Vercel preview deployments
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.static('public'));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ Connected to MongoDB');
  initializeAdmin();
})
.catch(err => console.error('❌ MongoDB connection error:', err));

// Initialize admin user
async function initializeAdmin() {
  try {
    const adminExists = await User.findOne({ isAdmin: true });
    if (!adminExists) {
      const admin = new User({
        username: process.env.ADMIN_USERNAME || 'admin',
        password: process.env.ADMIN_PASSWORD || 'admin123',
        isAdmin: true
      });
      await admin.save();
      console.log('✅ Admin user created');
    }
  } catch (error) {
    console.error('Error creating admin:', error);
  }
}

// ==================== AUTH ROUTES ====================

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (!user.isActive && !user.isAdmin) {
      return res.status(403).json({ error: 'Account is disabled' });
    }

    const token = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        isAdmin: user.isAdmin,
        currentLevel: user.currentLevel,
        isGameCompleted: user.isGameCompleted,
        totalTime: user.totalTime
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get current user
app.get('/api/auth/me', auth, async (req, res) => {
  try {
    res.json({
      id: req.user._id,
      username: req.user.username,
      isAdmin: req.user.isAdmin,
      currentLevel: req.user.currentLevel,
      isGameCompleted: req.user.isGameCompleted,
      totalTime: req.user.totalTime,
      gameStartTime: req.user.gameStartTime
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ==================== GAME ROUTES ====================

// Get current clue
app.get('/api/game/clue', auth, async (req, res) => {
  try {
    const user = req.user;
    
    if (user.isGameCompleted) {
      return res.json({
        completed: true,
        totalTime: user.totalTime,
        message: 'Game already completed!'
      });
    }

    const currentClue = clues.find(c => c.level === user.currentLevel);
    
    if (!currentClue) {
      return res.status(404).json({ error: 'Clue not found' });
    }

    // Start timer on first clue request
    if (!user.gameStartTime && user.currentLevel === 1) {
      user.gameStartTime = new Date();
      await user.save();
    }

    res.json({
      level: currentClue.level,
      location: currentClue.location,
      clue: currentClue.clue,
      hint: currentClue.hint,
      totalLevels: clues.length,
      gameStartTime: user.gameStartTime
    });
  } catch (error) {
    console.error('Get clue error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Scan QR code
app.post('/api/game/scan', auth, async (req, res) => {
  try {
    const { qrCode } = req.body;
    const user = req.user;

    if (!qrCode) {
      return res.status(400).json({ error: 'QR code required' });
    }

    if (user.isGameCompleted) {
      return res.status(400).json({ error: 'Game already completed' });
    }

    // Find the expected QR for next level
    const nextLevel = user.currentLevel + 1;
    const expectedClue = clues.find(c => c.level === nextLevel);

    if (!expectedClue) {
      return res.status(400).json({ error: 'No more levels' });
    }

    // Check if scanned QR matches expected QR
    if (qrCode !== expectedClue.qrCode) {
      return res.status(400).json({ 
        error: 'Wrong QR code! You are in the wrong spot. Please scan the correct QR code.',
        wrongSpot: true
      });
    }

    // Update user progress
    user.currentLevel = nextLevel;
    user.scannedQRs.push({
      level: nextLevel,
      scannedAt: new Date()
    });

    // Check if game is completed
    if (nextLevel === clues.length) {
      user.isGameCompleted = true;
      user.gameEndTime = new Date();
      user.totalTime = Math.floor((user.gameEndTime - user.gameStartTime) / 1000); // in seconds
    }

    await user.save();

    if (user.isGameCompleted) {
      return res.json({
        success: true,
        completed: true,
        totalTime: user.totalTime,
        message: 'Congratulations! You have completed the treasure hunt!'
      });
    }

    res.json({
      success: true,
      nextLevel: user.currentLevel,
      message: 'QR code scanned successfully!'
    });
  } catch (error) {
    console.error('Scan QR error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==================== ADMIN ROUTES ====================

// Create user
app.post('/api/admin/users', adminAuth, async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const user = new User({
      username,
      password,
      isAdmin: false
    });

    await user.save();

    res.status(201).json({
      id: user._id,
      username: user.username,
      isActive: user.isActive,
      currentLevel: user.currentLevel
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all users
app.get('/api/admin/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find({ isAdmin: false })
      .select('-password')
      .sort({ createdAt: -1 });

    const usersData = users.map(user => ({
      id: user._id,
      username: user.username,
      currentLevel: user.currentLevel,
      isGameCompleted: user.isGameCompleted,
      totalTime: user.totalTime,
      isActive: user.isActive,
      gameStartTime: user.gameStartTime,
      gameEndTime: user.gameEndTime,
      createdAt: user.createdAt
    }));

    res.json(usersData);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user
app.put('/api/admin/users/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive, password } = req.body;

    const user = await User.findById(id);
    if (!user || user.isAdmin) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (typeof isActive !== 'undefined') {
      user.isActive = isActive;
    }

    if (password) {
      user.password = password;
    }

    await user.save();

    res.json({
      id: user._id,
      username: user.username,
      isActive: user.isActive
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Reset user progress
app.post('/api/admin/users/:id/reset', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user || user.isAdmin) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.currentLevel = 1;
    user.gameStartTime = null;
    user.gameEndTime = null;
    user.totalTime = null;
    user.isGameCompleted = false;
    user.scannedQRs = [];

    await user.save();

    res.json({ message: 'User progress reset successfully' });
  } catch (error) {
    console.error('Reset user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete user
app.delete('/api/admin/users/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user || user.isAdmin) {
      return res.status(404).json({ error: 'User not found' });
    }

    await User.findByIdAndDelete(id);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Serve frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

