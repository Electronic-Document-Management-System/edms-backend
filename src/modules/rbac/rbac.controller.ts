import { Request, Response } from 'express';
import { ApiResponse } from '@/utils/ApiResponse';
import asyncHandler from '@/utils/asyncHandler';
import ApiError from '@/utils/ApiError';
import {
  addPermissionToRoleService,
  createPermissionService,
  createRoleService,
  deletePermissionService,
  deleteRoleService,
  getAllPermissionsService,
  getAllRolesService,
  getRoleByIdService,
  getRoleImpactService,
  getRolePermissionsService,
  getUserRolesService,
  removePermissionFromRoleService,
  updatePermissionService,
  updateRoleService,
} from './rbac.service';

/**
 * @description Retrieves all available roles from the RBAC system.
 * @route GET /api/rbac/roles
 * @access Private
 */
export const getAllRoles = asyncHandler(async (_req: Request, res: Response) => {
  const roles = await getAllRolesService();

  return res
    .status(200)
    .json(new ApiResponse(200, { roles }, 'All roles retrieved successfully'));
});

/**
 * @description Retrieves a specific role by its ID.
 * @route GET /api/rbac/roles/:id
 * @access Private
 */
export const getRoleById = asyncHandler(async (req: Request, res: Response) => {
  const roleId = Number(req.params.roleId);

  if (Number.isNaN(roleId)) {
    throw new ApiError(400, 'Invalid role id.');
  }

  const role = await getRoleByIdService(roleId);

  return res
    .status(200)
    .json(new ApiResponse(200, { role }, 'Role retrieved successfully'));
});

/**
 * @description Retrieves all permissions assigned to a specific role.
 * @route GET /api/rbac/roles/:id/permissions
 * @access Private
 */
export const getRolePermissions = asyncHandler(
  async (req: Request, res: Response) => {
    const roleId = Number(req.params.roleId);

    if (Number.isNaN(roleId)) {
      throw new ApiError(400, 'Invalid role id.');
    }

    const rolePermissions = await getRolePermissionsService(roleId);

    return res
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

/**
 * @description Retrieves all available permissions from the RBAC system.
 * @route GET /api/rbac/permissions
 * @access Private
 */
export const getAllPermissions = asyncHandler(
  async (_req: Request, res: Response) => {
    const permissions = await getAllPermissionsService();

    return res
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

/**
 * @description Retrieves all roles assigned to a specific user.
 * @route GET /api/rbac/users/:id/roles
 * @access Private
 */
export const getUserRoles = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = Number(req.params.userId);
    // logger.info(userId);
    if (isNaN(userId)) {
      throw new ApiError(400, 'Invalid user id.');
    }

    const userRoles = await getUserRolesService(userId);

    return res
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

/**
 * @description Creates a new role in the RBAC system.
 * @route POST /api/rbac/roles
 * @access Private
 */
export const createRole = asyncHandler(async (req: Request, res: Response) => {
  const roleData = req.body;

  const createdRole = await createRoleService(roleData);

  return res
    .status(201)
    .json(new ApiResponse(201, { role: createdRole }, 'Role created successfully'));
});

/**
 * @description Updates an existing role by its ID.
 * @route PATCH /api/rbac/roles/:id
 * @access Private
 */
export const updateRole = asyncHandler(async (req: Request, res: Response) => {
  const roleId = Number(req.params.roleId);

  if (Number.isNaN(roleId)) {
    throw new ApiError(400, 'Invalid role id.');
  }

  const roleData = req.body;

  const updatedRole = await updateRoleService(roleId, roleData);

  return res
    .status(200)
    .json(new ApiResponse(200, { role: updatedRole }, 'Role updated successfully'));
});

/**
 * @description Deletes an existing role by its ID.
 * @route DELETE /api/rbac/roles/:id
 * @access Private
 */
export const deleteRole = asyncHandler(async (req: Request, res: Response) => {
  const roleId = Number(req.params.roleId);

  if (Number.isNaN(roleId)) {
    throw new ApiError(400, 'Invalid role id.');
  }

  const deletedRole = await deleteRoleService(roleId);

  return res
    .status(200)
    .json(new ApiResponse(200, { role: deletedRole }, 'Role deleted successfully'));
});

/**
 * @description
 * @route GET  api/v1/rbac/roles/:roleId/impact
 * @access Private
 */

export const getRoleImpact = asyncHandler(async (req: Request, res: Response) => {
  const roleId = Number(req.params.roleId);

  if (Number.isNaN(roleId)) {
    throw new ApiError(400, 'Invalid role id.');
  }

  const roleImpact = await getRoleImpactService(roleId);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { roleImpact },
        'Role impact retrieved successfully'
      ));
});

/**
 * @description Creates a new permission in the RBAC system.
 * @route POST /api/rbac/permissions
 * @access Private
 */
export const createPermission = asyncHandler(
  async (req: Request, res: Response) => {
    const permissionData = req.body;

    const createdPermission = await createPermissionService(permissionData);

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { permission: createdPermission },
          'Permission created successfully',
        ),
      );
  },
);

/**
 * @description Updates an existing permission by its ID.
 * @route PATCH /api/rbac/permissions/:id
 * @access Private
 */
export const updatePermission = asyncHandler(
  async (req: Request, res: Response) => {
    const permissionId = Number(req.params.permissionId);

    if (Number.isNaN(permissionId)) {
      throw new ApiError(400, 'Invalid permission id.');
    }

    const permissionData = req.body;

    const updatedPermission = await updatePermissionService(
      permissionId,
      permissionData,
    );

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { permission: updatedPermission },
          'Permission updated successfully',
        ),
      );
  },
);

/**
 * @description Deletes an existing permission by its ID.
 * @route DELETE /api/rbac/permissions/:id
 * @access Private
 */
export const deletePermission = asyncHandler(
  async (req: Request, res: Response) => {
    const permissionId = Number(req.params.permissionId);

    if (Number.isNaN(permissionId)) {
      throw new ApiError(400, 'Invalid permission id.');
    }

    const deletedPermission = await deletePermissionService(permissionId);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { permission: deletedPermission },
          'Permission deleted successfully',
        ),
      );
  },
);

/**
 * @description Assigns a permission to a specific role.
 * @route POST /api/rbac/roles/:id/permissions
 * @access Private
 */
export const addPermissionToRole = asyncHandler(
  async (req: Request, res: Response) => {
    const roleId = Number(req.params.roleId);
    const permissionId = Number(req.body.permissionId);

    if (Number.isNaN(roleId)) {
      throw new ApiError(400, 'Invalid role id.');
    }

    if (Number.isNaN(permissionId)) {
      throw new ApiError(400, 'Invalid permission id.');
    }

    const addedPermission = await addPermissionToRoleService(
      roleId,
      permissionId,
    );

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { rolePermission: addedPermission },
          'Permission assigned to role successfully',
        ),
      );
  },
);

/**
 * @description Removes a permission from a specific role.
 * @route DELETE /api/rbac/roles/:id/permissions/:permissionId
 * @access Private
 */
export const removePermissionFromRole = asyncHandler(
  async (req: Request, res: Response) => {
    const roleId = Number(req.params.roleId);
    const permissionId = Number(req.params.permissionId);

    if (Number.isNaN(roleId)) {
      throw new ApiError(400, 'Invalid role id.');
    }

    if (Number.isNaN(permissionId)) {
      throw new ApiError(400, 'Invalid permission id.');
    }

    const removedPermission = await removePermissionFromRoleService(
      roleId,
      permissionId,
    );

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { rolePermission: removedPermission },
          'Permission removed from role successfully',
        ),
      );
  },
);
