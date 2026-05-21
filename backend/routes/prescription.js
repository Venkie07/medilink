import express from 'express';
import { createPrescription, getPrescriptions, updatePrescriptionStatus } from '../controllers/prescriptionController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createPrescriptionSchema } from '../validators/schemas.js';

const router = express.Router();

router.use(protect);

router.post('/', authorize('Doctor'), validate(createPrescriptionSchema), createPrescription);
router.get('/', getPrescriptions);
router.patch('/:id/status', authorize('Pharmacy'), updatePrescriptionStatus);

export default router;
