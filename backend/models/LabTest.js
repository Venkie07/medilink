import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const LabTest = sequelize.define('LabTest', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  testName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('Requested', 'Completed'),
    defaultValue: 'Requested'
  },
  requestedDate: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW
  }
});

export default LabTest;
