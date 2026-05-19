import { Request, Response } from 'express';
import asyncHandler from '../../utils/asyncHandler';
import ApiError from '../../utils/ApiError';
import { ApiResponse } from '../../utils/ApiResponse';
import {
  activateUserService,
  createNewUserService,
  disableUserService,
  getAllUsersService,
  getUserByIdService,
  updateUserByIdService,
} from './users.service';

export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const allUsers = await getAllUsersService();

  res
    .status(200)
    .json(new ApiResponse(200, {}, 'All users retrieved successfully'));
});

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const userId = Number(req.params.id);
  const user = await getUserByIdService(userId);

  res
    .status(200)
    .json(new ApiResponse(200, user, 'User retrieved successfully'));
});

export const createNewUser = asyncHandler(
  async (req: Request, res: Response) => {
    const currentUser = req.user;
    await createNewUserService(currentUser);

    res
      .status(200)
      .json(new ApiResponse(200, {}, 'User created successfully'));
  },
);

export const updateUserById = asyncHandler(
  async (req: Request, res: Response) => {
    // req.user
    const userId = Number(req.params.id);
    const updatedUser = await updateUserByIdService(userId);

    res
      .status(200)
      .json(new ApiResponse(200, updatedUser, 'User updated successfully'));
  },
);

export const disableUser = asyncHandler(async (req: Request, res: Response) => {
  // req.user
  const userId = Number(req.params.id);
  const disabledUser = await disableUserService(userId);

  res
    .status(200)
    .json(new ApiResponse(200, disabledUser, 'User disabled successfully'));
});

export const activateUser = asyncHandler(
  async (req: Request, res: Response) => {
    // req.user
    const userId = Number(req.params.id);
    const activatedUser = await activateUserService(userId);

    res
      .status(200)
      .json(new ApiResponse(200, activatedUser, 'User activated successfully'));
  },
);
