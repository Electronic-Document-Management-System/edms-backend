import bcrypt from 'bcrypt';
import jwt,{ SignOptions, Secret } from 'jsonwebtoken';
import { UserWithRoles } from '../../types/auth';

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};

export const comparePassword = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash);
};

export const generateAccessToken = (user: UserWithRoles) => {
  const roleNames = user.roles?.map(ur => ur.role.name) || [];

  return jwt.sign(
    { id: user.id, email: user.email, roles: roleNames },
    process.env.ACCESS_TOKEN_SECRET!,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY as SignOptions["expiresIn"] },
  );
};

export const generateRefreshToken = (user: any) => {
  return jwt.sign(
    { id: user.id },
    process.env.REFRESH_TOKEN_SECRET!,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY as SignOptions["expiresIn"] },
  );
};
