import bcrypt from 'bcrypt';
import jwt, { SignOptions, Secret } from 'jsonwebtoken';
import { AuthTokenPayload, AuthUserPayload, UserWithRolesAndPermissions } from '@/types/auth';

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};

export const comparePassword = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash);
};

export const generateAccessToken = (payload: AuthTokenPayload) => {

  return jwt.sign(
    {
      id: payload.id,
      email: payload.email,
      dept_id: payload.dept_id,
    },
    process.env.ACCESS_TOKEN_SECRET!,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY as SignOptions["expiresIn"] },
  );
};

export const generateRefreshToken = (payload: AuthTokenPayload) => {
  return jwt.sign(
    {
      id: payload.id,
      email: payload.email,
      dept_id: payload.dept_id,
    },
    process.env.REFRESH_TOKEN_SECRET!,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY as SignOptions["expiresIn"] },
  );
};

export const buildAuthUserPayload = (
  user: UserWithRolesAndPermissions,
): AuthUserPayload => {
  const roles = user.roles.map((userRole) => ({
    id: userRole.role.id,
    name: userRole.role.name,
  }));

  const permissions = [
    ...new Set(
      user.roles.flatMap((userRole) =>
        userRole.role.rolePermissions.map((rolePermission) => {
          const permission = rolePermission.permission;

          return `${permission.resource}:${permission.action}:${permission.scope}`;
        }),
      ),
    ),
  ];

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    dept_id: user.dept_id,
    isActive: user.isActive,
    roles,
    permissions,
  };
};