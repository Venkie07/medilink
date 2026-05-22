import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import logger from '../utils/logger.js';
import pg from 'pg';

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  logger.error('CRITICAL: DATABASE_URL environment variable is missing.');
  throw new Error('Database configuration failed: DATABASE_URL environment variable is required.');
}

logger.info('Connecting to production PostgreSQL/Supabase database...');

const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  dialectModule: pg, // IMPORTANT FIX
  protocol: 'postgres',

  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },

  logging: false,
});

export default sequelize;