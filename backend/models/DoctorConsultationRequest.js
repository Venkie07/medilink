import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const DoctorConsultationRequest = sequelize.define('DoctorConsultationRequest', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Accepted', 'Rejected', 'Completed'),
    defaultValue: 'Pending'
  },
  chatHistory: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  assessmentHistory: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  latestAssessment: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  doctorRemarks: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  appointmentDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  appointmentTime: {
    type: DataTypes.TIME,
    allowNull: true
  },
  requestedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  acceptedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  rejectedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  indexes: [
    { fields: ['patientId'] },
    { fields: ['doctorId'] },
    { fields: ['conversationId'] }
  ]
});

export default DoctorConsultationRequest;
