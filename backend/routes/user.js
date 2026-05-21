import express from 'express';
import { createUser, getAllUsers, updateUser } from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(authorize('Admin'));

router.post('/', createUser);
router.get('/', getAllUsers);
router.put('/:id', updateUser);

export default router;
