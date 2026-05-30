import express from 'express';
import { 
  createConsultationRequest, 
  getDoctorRequests, 
  getPatientRequests, 
  acceptRequest, 
  rejectRequest,
  getAllDoctors
} from '../controllers/consultationController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/doctors', getAllDoctors);
router.post('/', createConsultationRequest);
router.get('/doctor/:doctorId', getDoctorRequests);
router.get('/patient/:patientId', getPatientRequests);
router.put('/:id/accept', acceptRequest);
router.put('/:id/reject', rejectRequest);

export default router;
