import { Router } from 'express';
import { login, logout, refreshAccessToken } from './auth.controller';
import { requireAuth } from '@/middlewares/auth.middleware';
import { auditLog } from '@/middlewares/audit.middleware';
import { AuditAction } from '@prisma/client';

const router = Router();

router
    .route('/login')
    .post(login);

router
    .route('/token-refresh')
    .post(refreshAccessToken);

router
    .route('/logout')
    .post(
        requireAuth,
        auditLog(AuditAction.USER_LOGOUT, 'auth'),
        logout
    );

export default router;