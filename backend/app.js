require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const quizRoutes = require('./routes/quizzes');
const questionRoutes = require('./routes/questions');

const app = express();

// CORS: cho phép frontend gọi API (local + link deploy trong CLIENT_URL)
const allowedOrigins = ['http://localhost:3001', 'http://127.0.0.1:3001'];
if (process.env.CLIENT_URL) allowedOrigins.push(...process.env.CLIENT_URL.split(',').map((s) => s.trim()));
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

app.get('/', (req, res) => res.json({ message: 'Quiz API is running' }));
app.use('/api/auth', authRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/questions', questionRoutes);

// 404 cho route không tồn tại
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

// Error handler chung
app.use((err, req, res, next) => {
  console.error(err);
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: Object.values(err.errors).map((e) => e.message).join(', ') });
  }
  if (err.name === 'CastError') {
    return res.status(400).json({ message: `Invalid ${err.path}: ${err.value}` });
  }
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

module.exports = app;
