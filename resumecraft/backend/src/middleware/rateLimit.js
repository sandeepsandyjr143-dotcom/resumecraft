const rateLimit = require('express-rate-limit');

const aiRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: { error: 'Too many AI requests. Please wait a minute.' },
  standardHeaders: true,
  legacyHeaders: false
});

const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { error: 'Too many attempts. Please try again later.' }
});

module.exports = { aiRateLimit, authRateLimit };
