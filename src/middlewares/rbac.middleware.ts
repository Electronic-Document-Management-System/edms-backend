import { NextFunction, Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler';
import ApiError from '../utils/ApiError';
import { prisma } from '../config/db.config';

export const requirePermission = (permissionKey: string) =>
  asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user?.id) {
      throw new ApiError(401, 'Unauthorized request.');
    }

    const userWithPermissions = await prisma.user.findUnique({
      where: {
        id: req.user.id,
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

    const permissions = userWithPermissions.roles.flatMap((userRole) => {
      return userRole.role.rolePermissions.map(
        (rolePermission) =>
          `${rolePermission.permission.resource}:${rolePermission.permission.action}:${rolePermission.permission.scope}`,
      );
    });

    const hasPermission = permissions.includes(permissionKey);

    if (!hasPermission) {
      throw new ApiError(403, 'You are not allowed to perform this action.');
    }

    next();
  });

export const requireAnyPermission = (permissionKeys: string[]) =>
  asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user?.id) {
      throw new ApiError(401, 'Unauthorized request.');
    }

    const userWithPermissions = await prisma.user.findUnique({
      where: {
        id: req.user.id,
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

    const permissions = userWithPermissions.roles.flatMap((userRole) =>
      userRole.role.rolePermissions.map(
        (rolePermission) =>
          `${rolePermission.permission.resource}: ${rolePermission.permission.action}: ${rolePermission.permission.scope}`,
      ),
    );

    const hasAnyPermission = permissionKeys.some((key) =>
      permissions.includes(key),
    );

    if (!hasAnyPermission) {
      throw new ApiError(403, 'You are not allowed to perform this action.');
    }

    next();
  });

export const requireAllPermissions = (permissionKeys: string[]) =>
  asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user?.id) {
      throw new ApiError(401, 'Unauthorized request.');
    }

    const userWithPermissions = await prisma.user.findUnique({
      where: {
        id: req.user.id,
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

    const permissions = userWithPermissions.roles.flatMap((userRole) =>
      userRole.role.rolePermissions.map(
        (rolePermission) =>
          `${rolePermission.permission.resource}: ${rolePermission.permission.action}: ${rolePermission.permission.scope}`,
      ),
    );

    const hasAllPermissions = permissionKeys.every((key) =>
      permissions.includes(key),
    );

    if (!hasAllPermissions) {
      throw new ApiError(403, 'You are not allowed to perform this action.');
    }

    next();
  });
