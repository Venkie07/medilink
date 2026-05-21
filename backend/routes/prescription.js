import express from 'express';
import { createPrescription, getPrescriptions, updatePrescriptionStatus } from '../controllers/prescriptionController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/', authorize('Doctor'), createPrescription);
router.get('/', getPrescriptions);
router.patch('/:id/status', authorize('Pharmacy'), updatePrescriptionStatus);

export default router;
