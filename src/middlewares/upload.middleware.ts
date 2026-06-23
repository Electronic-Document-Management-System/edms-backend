import { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import ApiError from '../utils/ApiError';

const storage = multer.memoryStorage();

const MAX_FILE_SIZE = 25 * 1024 * 1024;
const MAX_FILES = 10;

const allowedTypes = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/png',
  'image/jpeg',
];

const fileFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(
      new ApiError(
        400,
        'Invalid file type. Only PDF, DOC, DOCX, PNG, and JPG files are allowed.',
      ),
    );
  }

  cb(null, true);
};

const uploadSingleDocumentFile = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter,
});

const uploadMultipleDocumentFiles = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: MAX_FILES,
  },
  fileFilter,
});

const handleMulterError = (error: unknown, next: NextFunction) => {
  if (!error) {
    return next();
  }

  if (error instanceof ApiError) {
    return next(error);
  }

  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return next(
        new ApiError(
          413,
          'File is too large. Maximum allowed file size is 25MB.',
        ),
      );
    }

    if (error.code === 'LIMIT_FILE_COUNT') {
      return next(
        new ApiError(
          413,
          `Too many files selected. Maximum ${MAX_FILES} files are allowed.`,
        ),
      );
    }

    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return next(new ApiError(400, 'Unexpected file field.'));
    }

    return next(new ApiError(400, error.message));
  }

  return next(new ApiError(400, 'File upload failed.'));
};

export const uploadSingleDocument = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  uploadSingleDocumentFile.single('file')(req, res, (error) => {
    handleMulterError(error, next);
  });
};

export const uploadMultipleDocuments = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  uploadMultipleDocumentFiles.array('files', MAX_FILES)(req, res, (error) => {
    handleMulterError(error, next);
  });
};