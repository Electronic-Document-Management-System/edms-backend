import { Router } from 'express';
import { login } from './auth.controller';

const router = Router();

// Login route
router
    .route('/login')
    .post(login);

export default router;