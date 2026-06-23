import { S3Client } from '@aws-sdk/client-s3';
import ApiError from '../utils/ApiError';

const endpoint = process.env.S3_ENDPOINT;
const accessKeyId = process.env.S3_ACCESS_KEY_ID;
const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;

if (!endpoint || !accessKeyId || !secretAccessKey) {
  throw new ApiError(500, 'S3/R2 configuration is missing in environment variables.');
}

export const s3Client = new S3Client({
  region: 'auto',
  endpoint,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export const BUCKET_NAME = process.env.S3_BUCKET_NAME || 'edms-bucket';