import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const LabReport = sequelize.define('LabReport', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  filePath: {
    type: DataTypes.STRING,
    allowNull: false
  },
  resultSummary: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  uploadDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

export default LabReport;
