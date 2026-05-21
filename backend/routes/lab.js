import express from 'express';
import { requestLabTest, uploadReport, getLabTests } from '../controllers/labController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createLabRequestSchema, uploadReportSchema } from '../validators/schemas.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.use(protect);

router.post('/request', authorize('Doctor'), validate(createLabRequestSchema), requestLabTest);
router.post('/upload', authorize('Lab Technician'), upload.single('report'), uploadReport);
router.get('/tests', getLabTests);

export default router;
