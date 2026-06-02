import { NextFunction, Request, Response } from 'express';
import ApiError from '../utils/ApiError';
import logger from '../logger/winston.logger';

export const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const statusCode = err instanceof ApiError ? err.statusCode : 500;

  logger.error({
    message: err.message,
    statusCode,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userId: req.user?.id || null,
    stack: err.stack,
  });

  return res.status(statusCode).json({
    statusCode,
    message: err.message || 'Internal Server Error',
    success: false,
    errors: [],
  });
};