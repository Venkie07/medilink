import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Prescription = sequelize.define('Prescription', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
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
}, {
  indexes: [
    { fields: ['patientId'] },
    { fields: ['doctorId'] },
    { fields: ['appointmentId'] }
  ]
});

export default Prescription;
