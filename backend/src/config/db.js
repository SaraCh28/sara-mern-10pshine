const { Pool } = require('pg');
const logger = require('./logger');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'sara',
  password: process.env.DB_PASSWORD || 'password123',
  database: process.env.DB_NAME || 'notes_app',
  port: process.env.DB_PORT || 5432,
});

// Test the connection on startup and run schema migration
pool.connect(async (err, client, release) => {
  if (err) {
    logger.error({ err }, 'Failed to connect to PostgreSQL database');
    return;
  }
  logger.info('✅ PostgreSQL database connected successfully');
  
  try {
    await client.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS gender VARCHAR(50),
      ADD COLUMN IF NOT EXISTS age INT,
      ADD COLUMN IF NOT EXISTS occupation VARCHAR(100);
    `);
    logger.info('✅ Database schema migration completed successfully (profile fields updated)');
  } catch (migErr) {
    logger.error({ err: migErr }, '❌ Database migration failed');
  }
  
  release();
});

module.exports = pool;