import User from './User.js';
import Patient from './Patient.js';
import Appointment from './Appointment.js';
import Prescription from './Prescription.js';
import PrescriptionItem from './PrescriptionItem.js';
import LabTest from './LabTest.js';
import LabReport from './LabReport.js';
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

export {
  User,
  Patient,
  Appointment,
  Prescription,
  PrescriptionItem,
  LabTest,
  LabReport,
  sequelize
};
