import { Router } from 'express';
import { login, logout, refreshAccessToken } from './auth.controller';
import { requireAuth } from '@/middlewares/auth.middleware';

const router = Router();

router
    .route('/login')
    .post(login);

router
    .route('/token-refresh')
    .post(refreshAccessToken);

router
    .route('/logout')
    .post(requireAuth, logout);

export default router;