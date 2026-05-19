import { Request, Response } from 'express';
import { prisma } from '../../config/db.config';
import logger from '../../logger/winston.logger';
import { ApiResponse } from '../../utils/ApiResponse';
import asyncHandler from '../../utils/asyncHandler';
import {
  getAllPermissionsService,
  getAllRoleSServices,
  getRoleByIdService,
  getRolePermissionsService,
  getUserRolesService,
} from './rbac.service';
import ApiError from '../../utils/ApiError';

export const getAllRoles = asyncHandler(async (req: Request, res: Response) => {
  const roles = await getAllRoleSServices();

  res
    .status(200)
    .json(new ApiResponse(200, roles, 'All roles retrieved successfully'));
});

export const getRoleById = asyncHandler(async (req: Request, res: Response) => {
  const roleId = Number(req.params.id);

  if (Number.isNaN(roleId)) {
    throw new ApiError(400, 'Invalid role id.');
  }

  const role = await getRoleByIdService(roleId);

  res
    .status(200)
    .json(new ApiResponse(200, { role }, 'Role retrieved successfully'));
});

export const getRolePermissions = asyncHandler(
  async (req: Request, res: Response) => {
    const roleId = Number(req.params.id);

    if (Number.isNaN(roleId)) {
      throw new ApiError(400, 'Invalid role id.');
    }

    const rolePermissions = await getRolePermissionsService(roleId);

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { rolePermissions },
          'Role permissions retrieved successfully',
        ),
      );
  },
);

export const getAllPermissions = asyncHandler(
  async (req: Request, res: Response) => {
    const permissions = await getAllPermissionsService();

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { permissions },
          'All permissions retrieved successfully',
        ),
      );
  },
);

export const getUserRoles = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = Number(req.params.id);

    const userRoles = await getUserRolesService(userId);

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { userRoles },
          'User roles retrieved successfully',
        ),
      );
  },
);
