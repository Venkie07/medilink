import express from 'express';
import { getConversations, getConversation, sendMessage } from '../controllers/mediDoctorController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // protect all routes

router.get('/patient/:patientId', getConversations);
router.get('/:id', getConversation);
router.post('/:id/messages', sendMessage);

export default router;
