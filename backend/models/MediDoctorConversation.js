import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const MediDoctorConversation = sequelize.define('MediDoctorConversation', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: true
  },
  summary: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('Active', 'Archived', 'Requested'),
    defaultValue: 'Active'
  },
  latestAssessment: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  assessmentHistory: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: []
  }
}, {
  indexes: [
    { fields: ['patientId'] }
  ]
});

export default MediDoctorConversation;
