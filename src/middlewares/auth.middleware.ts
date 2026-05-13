import { NextFunction, Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler';
import ApiError from '../utils/ApiError';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { prisma } from '../config/db.config';

interface AccessTokenPayload extends JwtPayload {
  userId: number;
  email?: string;
}

/**
 * Protected route middleware
 * Purpose:
 * - Token read karna
 * - Token verify karna
 * - User DB se fetch karna
 * - req.user attach karna
 */

export const requireAuth = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    const token =
      authHeader && authHeader.startsWith('Bearer ')
        ? authHeader.split(' ')[1]
        : undefined;

    if (!token) {
      throw new ApiError(401, 'Unauthorized request.');
    }

    const secret = process.env.ACCESS_TOKEN_SECRET;

    if (!secret) {
      throw new ApiError(500, 'JWT access secret is not configured.');
    }

    let decodedToken: AccessTokenPayload;

    try {
      decodedToken = jwt.verify(token, secret) as AccessTokenPayload;
    } catch (error) {
      throw new ApiError(401, 'Invalid or expired access token.');
    }

    if (!decodedToken.userId) {
      throw new ApiError(401, 'Invalid access token payload.');
    }

    const user = await prisma.user.findUnique({
      where: {
        id: decodedToken.userId,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new ApiError(401, 'User not found or token is invalid.');
    }

    // if (!user.isActive) {
    //     throw new ApiError(403, "User account is inactive.");
    // };

    req.user = user;

    next();
  },
);
