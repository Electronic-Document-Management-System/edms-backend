
import { Request, Response } from "express";
import asyncHandler from "@/utils/asyncHandler";
import { ApiResponse } from "@/utils/ApiResponse";
import { activateUserService, assignRoleToUserService, createNewUserService, disableUserService, getAllUsersService, getUserByIdService, removeRoleFromUserService, updateUserByIdService } from "./users.service";

/**
 * @description Creates a new tenant user with basic profile, department, and authentication details.
 * @route POST /api/tenant/users
 * @access Private
 */
export const createNewUser = asyncHandler(async (req: Request, res: Response) => {

  const newUserData = req.body;
  const newUser = await createNewUserService(newUserData);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { newUser },
        "User created successfully"
      )
    );
});

/**
 * @description Gets all users for the current tenant.
 * @route GET /api/tenant/users
 * @access Private
 */
export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {

  const permission = req.query.permission as string | undefined;
  const sanitizedPermission = permission?.trim() || undefined;

  const users = await getAllUsersService({ permission: sanitizedPermission });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { users },
        "Users retrieved successfully"
      )
    );
});

/**
 * @description Gets a user by ID for the current tenant.
 * @route GET /api/tenant/users/:userId
 * @access Private
 */
export const getUserById = asyncHandler(async (req: Request, res: Response) => {

  const userId = Number(req.params.userId);
  const user = await getUserByIdService(userId);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user },
        "User retrieved successfully"
      )
    );
});

/**
 * @description Updates a user by ID for the current tenant.
 * @route PATCH /api/tenant/users/:userId
 * @access Private
 */
export const updateUserById = asyncHandler(async (req: Request, res: Response) => {

  const userId = Number(req.params.userId);
  const userData = req.body;
  const updatedUser = await updateUserByIdService(userId, userData);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { updatedUser },
        "User updated successfully"
      )
    );
});

/**
 * @description Disables a user by ID for the current tenant.
 * @route PATCH /api/tenant/users/:userId/disable
 * @access Private
 */
export const disableUser = asyncHandler(async (req: Request, res: Response) => {

  const userId = Number(req.params.userId);
  const user = await disableUserService(userId);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user },
        "User disabled successfully"
      )
    );
});

/**
 * @description Activates a user by ID for the current tenant.
 * @route PATCH /api/tenant/users/:userId/activate
 * @access Private
 */
export const activateUser = asyncHandler(async (req: Request, res: Response) => {

  const userId = Number(req.params.userId);
  const activatedUser = await activateUserService(userId);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { activatedUser },
        "User activated successfully"
      )
    );
});

/**
 * @description Assigns a role to a user by ID for the current tenant.
 * @route POST /api/tenant/users/:userId/roles
 * @access Private
 */
export const assignRoleToUser = asyncHandler(async (req: Request, res: Response) => {

  const userId = Number(req.params.userId);
  const roleId = Number(req.body.roleId);
  const assignedRole = await assignRoleToUserService(userId, roleId);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { assignedRole },
        "Role assigned to user successfully"
      )
    );
});

/**
 * @description Removes a role from a user by ID for the current tenant.
 * @route POST /api/tenant/users/:userId/roles
 * @access Private
 */
export const removeRoleFromUser = asyncHandler(async (req: Request, res: Response) => {

  const userId = Number(req.params.userId);
  const roleId = Number(req.params.roleId);
  const removedRole = await removeRoleFromUserService(userId, roleId);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { removedRole },
        "Role removed from user successfully"
      )
    );
});
