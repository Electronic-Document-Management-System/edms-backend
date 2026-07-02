import { Request, Response } from 'express';

import { ApiResponse } from '@/utils/ApiResponse';
import asyncHandler from '@/utils/asyncHandler';

import * as authService from './auth.service';
import { createAuditLogService } from '../audit/audit.service';
import { AuditAction } from '@prisma/client';

/**
 * @description Authenticates a user using email and password, then returns access and refresh tokens.
 * @route POST /api/auth/login
 * @access Public
 */
const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.loginService(req.body);

  const { user, accessToken, refreshToken } = result;

  const options = {
    httpOnly: true,
    secure: true,
  };

  // Audit Log login attempt 
  createAuditLogService({
    action: AuditAction.USER_LOGIN,
    userId: user.id,
    resource: 'user',
    resourceId: user.id,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent']
  })

  return res
    .status(200)
    .cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none' as const,
      maxAge: 15 * 60 * 1000,
    })
    .cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none' as const,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .json(
      new ApiResponse(
        200,
        { user, accessToken, refreshToken },
        'Login Successful',
      ),
    );
});

/**
 * @description Logs out a user by clearing access and refresh tokens.
 * @route POST /api/auth/logout
 * @access Public
 */
const logout = asyncHandler(async (req: Request, res: Response) => {
  const options = {
    httpOnly: true,
    secure: true,
    sameSite: 'none' as const,
  };

  return res
    .status(200)
    .clearCookie('accessToken', options)
    .clearCookie('refreshToken', options)
    .json(
      new ApiResponse(
        200,
        {},
        'Logout successful'
      ));
});

/**
 * @description Refreshes an access token using a refresh token.
 * @route POST /api/auth/refresh-token
 * @access Public
 */
const refreshAccessToken = asyncHandler(
  async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;

    const { accessToken } = await authService.refreshAccessTokenService(refreshToken);

    return res
      .status(200)
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none' as const,
        maxAge: 15 * 60 * 1000,
      })
      .json(
        new ApiResponse(
          200,
          { accessToken },
          "Access token refreshed successfully"
        )
      );
  }
);

export { login, logout, refreshAccessToken };
