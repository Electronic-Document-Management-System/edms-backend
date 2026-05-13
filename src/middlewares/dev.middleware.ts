import { NextFunction } from 'express';
import asyncHandler from '../utils/asyncHandler';
import ApiError from '../utils/ApiError';

export const avoidInProduction = asyncHandler(
  async (_req: Request, _res: Response, next: NextFunction) => {
    if (process.env.NODE_ENV === 'development') {
      return next();
    }

    throw new ApiError(
      403,
      'This route is only available in development environment.',
    );
  },
);
