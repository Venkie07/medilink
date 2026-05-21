import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import logger from '../utils/logger.js';

dotenv.config();

let sequelize;

if (process.env.DATABASE_URL) {
  logger.info('Connecting to production PostgreSQL/Supabase database...');
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // Required for secure Supabase connectivity
      },
    },
    // Pool settings optimized for stateless Vercel Serverless execution
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    logging: false,
  });
} else {
  logger.info('Connecting to local SQLite database...');
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './medilink.sqlite',
    logging: false,
  });
}

export default sequelize;
