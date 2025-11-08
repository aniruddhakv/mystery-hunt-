// Vercel Serverless Function - Main API Handler
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const User = require('../models/User');
const clues = require('../config/clues');
const { auth, adminAuth } = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection with caching for serverless
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });
    
    cachedDb = connection;
    console.log('✅ Connected to MongoDB');
    
    // Initialize admin user
    await initializeAdmin();
    
    return connection;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}

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
    await connectToDatabase();
    
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
    await connectToDatabase();
    
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
    await connectToDatabase();
    
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

// Verify QR code
app.post('/api/game/verify-qr', auth, async (req, res) => {
  try {
    await connectToDatabase();
    
    const { qrCode } = req.body;
    const user = req.user;

    if (!qrCode) {
      return res.status(400).json({ error: 'QR code required' });
    }

    if (user.isGameCompleted) {
      return res.status(400).json({ error: 'Game already completed' });
    }

    const currentClue = clues.find(c => c.level === user.currentLevel);
    
    if (!currentClue) {
      return res.status(404).json({ error: 'Current level not found' });
    }

    // Check if QR code matches current level
    if (qrCode !== currentClue.qrCode) {
      return res.status(400).json({ 
        error: 'Wrong QR code! This is not the correct location.',
        correctLevel: user.currentLevel
      });
    }

    // Add to scanned QRs
    if (!user.scannedQRs.includes(qrCode)) {
      user.scannedQRs.push(qrCode);
    }

    // Move to next level
    user.currentLevel += 1;

    // Check if game is completed
    if (user.currentLevel > clues.length) {
      user.isGameCompleted = true;
      user.gameEndTime = new Date();
      
      // Calculate total time
      if (user.gameStartTime) {
        const timeDiff = user.gameEndTime - user.gameStartTime;
        user.totalTime = Math.floor(timeDiff / 1000); // in seconds
      }
      
      await user.save();
      
      return res.json({
        success: true,
        completed: true,
        message: 'Congratulations! You completed the treasure hunt!',
        totalTime: user.totalTime,
        formattedTime: formatTime(user.totalTime)
      });
    }

    await user.save();

    // Get next clue
    const nextClue = clues.find(c => c.level === user.currentLevel);

    res.json({
      success: true,
      completed: false,
      message: 'Correct! Moving to next level.',
      currentLevel: user.currentLevel,
      nextClue: {
        level: nextClue.level,
        location: nextClue.location,
        clue: nextClue.clue,
        hint: nextClue.hint
      }
    });
  } catch (error) {
    console.error('Verify QR error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==================== ADMIN ROUTES ====================

// Get all users
app.get('/api/admin/users', adminAuth, async (req, res) => {
  try {
    await connectToDatabase();
    
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create user
app.post('/api/admin/users', adminAuth, async (req, res) => {
  try {
    await connectToDatabase();
    
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
      message: 'User created successfully',
      user: {
        id: user._id,
        username: user.username,
        currentLevel: user.currentLevel
      }
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Reset user progress
app.post('/api/admin/users/:id/reset', adminAuth, async (req, res) => {
  try {
    await connectToDatabase();
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.isAdmin) {
      return res.status(400).json({ error: 'Cannot reset admin user' });
    }

    user.currentLevel = 1;
    user.scannedQRs = [];
    user.gameStartTime = null;
    user.gameEndTime = null;
    user.totalTime = 0;
    user.isGameCompleted = false;

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
    await connectToDatabase();
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.isAdmin) {
      return res.status(400).json({ error: 'Cannot delete admin user' });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Toggle user active status
app.patch('/api/admin/users/:id/toggle', adminAuth, async (req, res) => {
  try {
    await connectToDatabase();
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.isAdmin) {
      return res.status(400).json({ error: 'Cannot modify admin user' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({ 
      message: `User ${user.isActive ? 'enabled' : 'disabled'} successfully`,
      isActive: user.isActive
    });
  } catch (error) {
    console.error('Toggle user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Helper function
function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours}h ${minutes}m ${secs}s`;
}

// Export for Vercel
module.exports = app;

