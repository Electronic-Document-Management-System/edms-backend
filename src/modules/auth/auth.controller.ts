import { Request, Response } from 'express';

import { ApiResponse } from '../../utils/ApiResponse';
import asyncHandler from '../../utils/asyncHandler';

import * as authService from './auth.service';

const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.loginService(req.body);

  const { user, accesstoken, refreshToken } = result;

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie('accesstoken', accesstoken, options)
    .cookie('refreshToken', refreshToken, options)
    .json(new ApiResponse(200, user, 'Login Successful'));
});

export { login };
