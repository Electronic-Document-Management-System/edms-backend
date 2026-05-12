import ApiError from '../../utils/ApiError';

import {
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
} from './auth.utils';
import { prisma } from '../../config/db.config';

export const loginService = async (data: any) => {
  const { email, password } = data;

  if (!email || !password) {
    throw new ApiError(400, "email and password required");
  }

  const user = await prisma.user.findAndVerify(email, password);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const isPasswordValid = await comparePassword(password, user.password_hash);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid Credentials');
  }

  const accesstoken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  const { password_hash: _, ...userWithoutPassword} = user;

  return { user: userWithoutPassword, accesstoken, refreshToken };
};
