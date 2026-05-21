import PatientService from '../services/PatientService.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const registerPatient = asyncHandler(async (req, res) => {
  const result = await PatientService.registerPatient(req.body);
  res.status(201).json(result);
});

export const getAllPatients = asyncHandler(async (req, res) => {
  const patients = await PatientService.getAllPatients();
  res.status(200).json(patients);
});

export const getPatientProfile = asyncHandler(async (req, res) => {
  const patient = await PatientService.getPatientProfile(req.params.patientId);
  res.status(200).json(patient);
});

export const getMyProfile = asyncHandler(async (req, res) => {
  const patient = await PatientService.getPatientProfileByUserId(req.user.id);
  res.status(200).json(patient);
});

export const getPatientHistory = asyncHandler(async (req, res) => {
  const history = await PatientService.getPatientHistory(req.params.id);
  res.status(200).json(history);
});
