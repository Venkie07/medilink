import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const MediDoctorMessage = sequelize.define('MediDoctorMessage', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  sender: {
    type: DataTypes.ENUM('user', 'assistant', 'system'),
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  indexes: [
    { fields: ['conversationId'] }
  ]
});

export default MediDoctorMessage;
