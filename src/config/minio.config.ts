import { Client } from 'minio';
import ApiError from '../utils/ApiError';

const endpoint = process.env.MINIO_ENDPOINT;
const port = Number(process.env.MINIO_PORT);
const useSSL = process.env.MINIO_USE_SSL === 'true';
const accessKey = process.env.MINIO_ACCESS_KEY;
const secretKey = process.env.MINIO_SECRET_KEY;

if (!endpoint || !port || !accessKey || !secretKey) {
  throw new ApiError(500, 'MinIO configuration is missing in environment variables.');
}

export const minioClient = new Client({
  endPoint: endpoint,
  port,
  useSSL,
  accessKey,
  secretKey,
});

export const MINIO_BUCKET_NAME =
  process.env.MINIO_BUCKET_NAME || 'edms-documents';