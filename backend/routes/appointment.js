import express from 'express';
import { createAppointment, getAppointments, updateAppointmentStatus, deleteAppointment } from '../controllers/appointmentController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createAppointmentSchema } from '../validators/schemas.js';

const router = express.Router();

router.use(protect);

router.post('/', authorize('Doctor'), validate(createAppointmentSchema), createAppointment);
router.get('/', getAppointments);
router.patch('/:id/status', authorize('Doctor', 'Admin'), updateAppointmentStatus);
router.delete('/:id', authorize('Doctor', 'Admin'), deleteAppointment);

export default router;
