import express from 'express';
import { createUser, getAllUsers, updateUser } from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createUserSchema } from '../validators/schemas.js';

const router = express.Router();

router.use(protect);
router.use(authorize('Admin'));

router.post('/', validate(createUserSchema), createUser);
router.get('/', getAllUsers);
router.put('/:id', updateUser);

export default router;
