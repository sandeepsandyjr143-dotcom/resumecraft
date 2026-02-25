require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const authRoutes    = require('./routes/auth');
const resumeRoutes  = require('./routes/resumes');
const aiRoutes      = require('./routes/ai');
const templateRoutes= require('./routes/templates');
const exportRoutes  = require('./routes/export');

const app    = express();
const prisma = new PrismaClient();
global.prisma = prisma;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (_, res) => {
  res.json({ status: 'ok', app: 'ResumeCraft', timestamp: new Date().toISOString() });
});

app.use('/api/auth',      authRoutes);
app.use('/api/resumes',   resumeRoutes);
app.use('/api/ai',        aiRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/export',    exportRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`ResumeCraft running on port ${PORT}`));
module.exports = app;
