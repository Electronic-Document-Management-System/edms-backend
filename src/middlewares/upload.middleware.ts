import multer from 'multer';
import ApiError from '../utils/ApiError';

const storage = multer.memoryStorage();

const allowedTypes = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/png',
  'image/jpeg',
];

const fileFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new ApiError(400, 'Invalid file type.'));
  }

  cb(null, true);
};

export const uploadSingleDocumentFile = multer({
  storage,
  limits: {
    fileSize: 25 * 1024 * 1024,
  },
  fileFilter,
});

export const uploadMultipleDocumentFiles = multer({
  storage,
  limits: {
    fileSize: 25 * 1024 * 1024,
    files: 10,
  },
  fileFilter,
});