const express = require('express');
const cors = require('cors');

const loggerMiddleware = require('./middleware/logger.middleware');
const errorMiddleware = require('./middleware/error.middleware');

const authRoutes = require('./modules/auth/auth.routes');
const notesRoutes = require('./modules/notes/notes.routes');

const app = express();

// Global Middleware
app.use(cors());
app.use(express.json());
app.use(loggerMiddleware); // Log all requests

// Healthcheck Route
app.get('/', (req, res) => {
  res.send('API is alive 🚀');
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);

// Unknown routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Centralized Error Handling Middleware (must be last)
app.use(errorMiddleware);

module.exports = app;