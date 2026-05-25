import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();
const sequelize = new Sequelize(
  process.env.DATABASE_URL,
  {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  }
);

try {
  await sequelize.authenticate();
  console.log('DATABASE CONNECTED SUCCESSFULLY');
} catch (err) {
  console.error('DATABASE FAILED:', err.message);
}

