import PrescriptionService from '../services/PrescriptionService.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const createPrescription = asyncHandler(async (req, res) => {
  const prescription = await PrescriptionService.createPrescription(req.body, req.user.id);
  res.status(201).json(prescription);
});

export const getPrescriptions = asyncHandler(async (req, res) => {
  const prescriptions = await PrescriptionService.getPrescriptionsForRole(req.user.id, req.user.role);
  res.status(200).json(prescriptions);
});

export const updatePrescriptionStatus = asyncHandler(async (req, res) => {
  const prescription = await PrescriptionService.dispensePrescription(req.params.id, req.user.role);
  res.status(200).json(prescription);
});
