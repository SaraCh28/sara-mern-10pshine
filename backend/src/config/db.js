const { Pool } = require('pg');
const logger = require('./logger');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'sara',
  password: process.env.DB_PASSWORD || 'password123',
  database: process.env.DB_NAME || 'notes_app',
  port: process.env.DB_PORT || 5432,
});

// Test the connection on startup
pool.connect((err, client, release) => {
  if (err) {
    logger.error({ err }, 'Failed to connect to PostgreSQL database');
    return;
  }
  logger.info('✅ PostgreSQL database connected successfully');
  release();
});

module.exports = pool;