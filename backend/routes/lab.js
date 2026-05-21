import express from 'express';
import { requestLabTest, uploadReport, getLabTests } from '../controllers/labController.js';
import { protect, authorize } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.use(protect);

router.post('/request', authorize('Doctor'), requestLabTest);
router.post('/upload', authorize('Lab Technician'), upload.single('report'), uploadReport);
router.get('/tests', getLabTests);

export default router;
