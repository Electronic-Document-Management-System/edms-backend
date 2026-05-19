import { NextFunction, Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler';
import ApiError from '../utils/ApiError';
import { prisma } from '../config/db.config';
import { PermissionInput, UserWithPermissions } from '../types/rbac.d';

const buildPermissionKey = (permission: PermissionInput): string => {
  return `${permission.resource}:${permission.action}:${permission.scope}`;
};

const getUserPermissionKeys = async (userId: number): Promise<string[]> => {
  const userWithPermissions: UserWithPermissions | null =
    await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        roles: {
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

  if (!userWithPermissions) {
    throw new ApiError(401, 'User not found.');
  }

  return userWithPermissions.roles.flatMap((userRole: any) =>
    userRole.role.rolePermissions.map((rolePermission: any) =>
      buildPermissionKey({
        resource: rolePermission.permission.resource,
        action: rolePermission.permission.action,
        scope: rolePermission.permission.scope,
      }),
    ),
  );
};

export const requirePermission = (requiredPermission: PermissionInput) =>
  asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user?.id) {
      throw new ApiError(401, 'Unauthorized request.');
    }

    const userPermissionKeys = await getUserPermissionKeys(req.user.id);
    const requiredPermissionKey = buildPermissionKey(requiredPermission);

    const hasPermission = userPermissionKeys.includes(requiredPermissionKey);

    if (!hasPermission) {
      throw new ApiError(403, 'You are not allowed to perform this action.');
    }

    next();
  });

export const requireAnyPermission = (requiredPermissions: PermissionInput[]) =>
  asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user?.id) {
      throw new ApiError(401, 'Unauthorized request.');
    }

    const userPermissionKeys = await getUserPermissionKeys(req.user.id);

    const requiredPermissionKeys = requiredPermissions.map((permission) =>
      buildPermissionKey(permission),
    );

    const hasAnyPermission = requiredPermissionKeys.some((permissionKey) =>
      userPermissionKeys.includes(permissionKey),
    );

    if (!hasAnyPermission) {
      throw new ApiError(403, 'You are not allowed to perform this action.');
    }

    next();
  });

export const requireAllPermissions = (requiredPermissions: PermissionInput[]) =>
  asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user?.id) {
      throw new ApiError(401, 'Unauthorized request.');
    }

    const userPermissionKeys = await getUserPermissionKeys(req.user.id);

    const requiredPermissionKeys = requiredPermissions.map((permission) =>
      buildPermissionKey(permission),
    );

    const hasAllPermissions = requiredPermissionKeys.every((permissionKey) =>
      userPermissionKeys.includes(permissionKey),
    );

    if (!hasAllPermissions) {
      throw new ApiError(403, 'You are not allowed to perform this action.');
    }

    next();
  });