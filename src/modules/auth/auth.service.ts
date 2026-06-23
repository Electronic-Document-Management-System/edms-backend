import ApiError from '@/utils/ApiError';

import {
  buildAuthUserPayload,
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
} from './auth.utils';
import { prisma } from '@/config/db.config';
import { AuthTokenPayload } from '@/types/auth';
import jwt from 'jsonwebtoken';

export const loginService = async (data: any) => {
  const { email, password } = data;

  if (!email || !password) {
    throw new ApiError(400, "email and password required");
  }

  const user = await prisma.user.findAndVerify(email, password);

  if (!user) {
    throw new ApiError(404, 'User not found');
  };

  if (!user.isActive) {
    throw new ApiError(403, 'Your account is disabled.');
  }

  const isPasswordValid = await comparePassword(password, user.password_hash);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid Credentials');
  }

  const tokenPayload = {
    id: user.id,
    email: user.email,
    dept_id: user.dept_id,
  };

  const accessToken = generateAccessToken(tokenPayload as AuthTokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload as AuthTokenPayload);

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  const authUser = buildAuthUserPayload(user);

  // console.log("===== AUTH USER =====");
  // console.log(JSON.stringify(authUser, null, 2));
  // console.log("=====================");

  return { user: authUser, accessToken, refreshToken };
};

export const refreshAccessTokenService = async (refreshToken: string) => {

  if (!refreshToken) {
    throw new ApiError(401, "Unauthorized request");
  };

  const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as AuthTokenPayload;
  if (!decoded) {
    throw new ApiError(401, "Invalid or expired refresh token.");
  };

  const userId = decoded.id;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      roles: {

      }
    },
  });

  if (!user) {
    throw new ApiError(404, 'User not found');
  };

  if (user.refreshToken !== refreshToken) {
    throw new ApiError(401, "Invalid refresh token.");
  };

  if (!user.isActive) {
    throw new ApiError(403, "User account is inactive.");
  };

  const tokenPayload = {
    id: user.id,
    email: user.email,
    dept_id: user.dept_id,
  };
  const accessToken = generateAccessToken(tokenPayload as AuthTokenPayload);

  return { accessToken };
}