import LabService from '../services/LabService.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const requestLabTest = asyncHandler(async (req, res) => {
  const labTest = await LabService.requestLabTest(req.body, req.user.id);
  res.status(201).json(labTest);
});

export const uploadReport = asyncHandler(async (req, res) => {
  const report = await LabService.uploadLabReport(req.body, req.file, req.user.id);
  res.status(201).json(report);
});

export const getLabTests = asyncHandler(async (req, res) => {
  const labTests = await LabService.getLabTestsForRole(req.user.id, req.user.role);
  res.status(200).json(labTests);
});
