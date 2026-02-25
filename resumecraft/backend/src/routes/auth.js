const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { authRateLimit } = require('../middleware/rateLimit');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

function generateToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
}

// Register
router.post('/register', authRateLimit, async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Name, email and password are required' });
    }

    const existing = await global.prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: 'Email already registered' });

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await global.prisma.user.create({
      data: { email, passwordHash, name }
    });

    const token = generateToken(user.id);
    res.status(201).json({
      token,
      user: { id: user.id, email: user.email, name: user.name, aiMessages: user.aiMessages }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
router.post('/login', authRateLimit, async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const user = await global.prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    // Reset AI messages daily
    const lastReset = new Date(user.lastAiReset);
    const now = new Date();
    const hoursDiff = (now - lastReset) / (1000 * 60 * 60);
    if (hoursDiff >= 24 && user.aiMessages < 5) {
      await global.prisma.user.update({
        where: { id: user.id },
        data: { aiMessages: 5, lastAiReset: now }
      });
      user.aiMessages = 5;
    }

    const token = generateToken(user.id);
    res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name, aiMessages: user.aiMessages }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get current user
router.get('/me', authMiddleware, async (req, res) => {
  const user = req.user;
  res.json({ id: user.id, email: user.email, name: user.name, aiMessages: user.aiMessages });
});

// Delete account
router.delete('/account', authMiddleware, async (req, res) => {
  try {
    await global.prisma.user.delete({ where: { id: req.user.id } });
    res.json({ message: 'Account deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

module.exports = router;
