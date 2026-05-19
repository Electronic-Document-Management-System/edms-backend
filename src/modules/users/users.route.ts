// // USERS
// GET    /api/tenant/users
// GET    /api/tenant/users/:id
// POST   /api/tenant/users
// PATCH  /api/tenant/users/:id
// PATCH  /api/tenant/users/:id/disable
// PATCH  /api/tenant/users/:id/activate

import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth.middleware';
import {
  createNewUser,
  getAllUsers,
  getUserById,
  updateUserById,
} from './users.controller';

const router = Router();

router
  .route('/')
  .get(requireAuth, getAllUsers)
  .post(requireAuth, createNewUser);

router
  .route('/:id')
  .get(requireAuth, getUserById)
  .post(requireAuth, updateUserById);

export default router;
