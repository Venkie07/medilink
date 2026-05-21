import express from 'express';
import { registerPatient, getAllPatients, getPatientProfile, getMyProfile, getPatientHistory } from '../controllers/patientController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { registerPatientSchema } from '../validators/schemas.js';

const router = express.Router();

router.use(protect);

router.get('/me', authorize('Patient'), getMyProfile);
router.post('/', authorize('Doctor'), validate(registerPatientSchema), registerPatient);
router.get('/', authorize('Doctor', 'Admin'), getAllPatients);
router.get('/history/:id', authorize('Doctor'), getPatientHistory);
router.get('/:patientId', getPatientProfile);

export default router;
