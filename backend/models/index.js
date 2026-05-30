import User from './User.js';
import Patient from './Patient.js';
import Appointment from './Appointment.js';
import Prescription from './Prescription.js';
import PrescriptionItem from './PrescriptionItem.js';
import LabTest from './LabTest.js';
import LabReport from './LabReport.js';
import MediDoctorConversation from './MediDoctorConversation.js';
import MediDoctorMessage from './MediDoctorMessage.js';
import DoctorConsultationRequest from './DoctorConsultationRequest.js';
import Notification from './Notification.js';
import sequelize from '../config/database.js';

// User and Patient relationship
User.hasOne(Patient, { foreignKey: 'userId', as: 'patientProfile', onDelete: 'CASCADE' });
Patient.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Appointments relationships
Patient.hasMany(Appointment, { foreignKey: 'patientId', as: 'appointments' });
Appointment.belongsTo(Patient, { foreignKey: 'patientId', as: 'patient' });

User.hasMany(Appointment, { foreignKey: 'doctorId', as: 'doctorAppointments' });
Appointment.belongsTo(User, { foreignKey: 'doctorId', as: 'doctor' });

// Prescriptions relationships
Appointment.hasOne(Prescription, { foreignKey: 'appointmentId', as: 'prescription' });
Prescription.belongsTo(Appointment, { foreignKey: 'appointmentId' });

User.hasMany(Prescription, { foreignKey: 'doctorId', as: 'writtenPrescriptions' });
Prescription.belongsTo(User, { foreignKey: 'doctorId', as: 'doctor' });

Patient.hasMany(Prescription, { foreignKey: 'patientId', as: 'prescriptions' });
Prescription.belongsTo(Patient, { foreignKey: 'patientId', as: 'patient' });

// PrescriptionItems relationships
Prescription.hasMany(PrescriptionItem, { foreignKey: 'prescriptionId', as: 'medications', onDelete: 'CASCADE' });
PrescriptionItem.belongsTo(Prescription, { foreignKey: 'prescriptionId', as: 'prescription' });

// Lab Tests relationships
Patient.hasMany(LabTest, { foreignKey: 'patientId', as: 'labTests' });
LabTest.belongsTo(Patient, { foreignKey: 'patientId', as: 'patient' });

User.hasMany(LabTest, { foreignKey: 'doctorId', as: 'requestedLabTests' });
LabTest.belongsTo(User, { foreignKey: 'doctorId', as: 'doctor' });

// Lab Reports relationships
LabTest.hasOne(LabReport, { foreignKey: 'labTestId', as: 'report' });
LabReport.belongsTo(LabTest, { foreignKey: 'labTestId' });

User.hasMany(LabReport, { foreignKey: 'technicianId', as: 'uploadedReports' });
LabReport.belongsTo(User, { foreignKey: 'technicianId', as: 'technician' });

// MediDoctor relationships
Patient.hasMany(MediDoctorConversation, { foreignKey: 'patientId', as: 'mediDoctorConversations' });
MediDoctorConversation.belongsTo(Patient, { foreignKey: 'patientId', as: 'patient' });

MediDoctorConversation.hasMany(MediDoctorMessage, { foreignKey: 'conversationId', as: 'messages', onDelete: 'CASCADE' });
MediDoctorMessage.belongsTo(MediDoctorConversation, { foreignKey: 'conversationId', as: 'conversation' });

// Consultation Request relationships
Patient.hasMany(DoctorConsultationRequest, { foreignKey: 'patientId', as: 'consultationRequests' });
DoctorConsultationRequest.belongsTo(Patient, { foreignKey: 'patientId', as: 'patient' });

User.hasMany(DoctorConsultationRequest, { foreignKey: 'doctorId', as: 'doctorConsultationRequests' }); // user is doctor
DoctorConsultationRequest.belongsTo(User, { foreignKey: 'doctorId', as: 'doctor' });

MediDoctorConversation.hasOne(DoctorConsultationRequest, { foreignKey: 'conversationId', as: 'consultationRequest' });
DoctorConsultationRequest.belongsTo(MediDoctorConversation, { foreignKey: 'conversationId', as: 'conversation' });

DoctorConsultationRequest.belongsTo(Appointment, { foreignKey: 'appointmentId', as: 'appointment' });
Appointment.hasOne(DoctorConsultationRequest, { foreignKey: 'appointmentId', as: 'consultationRequest' });

// Notification relationships
User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export {
  User,
  Patient,
  Appointment,
  Prescription,
  PrescriptionItem,
  LabTest,
  LabReport,
  MediDoctorConversation,
  MediDoctorMessage,
  DoctorConsultationRequest,
  Notification,
  sequelize
};
