import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Prescription = sequelize.define('Prescription', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  medications: {
    type: DataTypes.JSON, // Array of medications
    allowNull: false
  },
  instructions: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  date: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW
  },
  status: {
    type: DataTypes.ENUM('Active', 'Dispensed'),
    defaultValue: 'Active'
  }
});

export default Prescription;
