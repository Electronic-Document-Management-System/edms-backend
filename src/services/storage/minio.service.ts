import { Readable } from 'stream';
import { minioClient, MINIO_BUCKET_NAME } from '../../config/minio.config';

export const ensureBucketExists = async () => {
  const exists = await minioClient.bucketExists(MINIO_BUCKET_NAME);

  if (!exists) {
    await minioClient.makeBucket(MINIO_BUCKET_NAME);
  }
};

export const uploadFileToMinIO = async (
  file: Express.Multer.File,
  objectKey: string,
) => {
  await ensureBucketExists();

  await minioClient.putObject(
    MINIO_BUCKET_NAME,
    objectKey,
    file.buffer,
    file.size,
    {
      'Content-Type': file.mimetype,
      'Original-Name': file.originalname,
    },
  );

  return {
    bucketName: MINIO_BUCKET_NAME,
    objectKey,
    originalName: file.originalname,
    mimeType: file.mimetype,
    fileSize: file.size,
  };
};

export const getFileFromMinIO = async (objectKey: string): Promise<Readable> => {
  return await minioClient.getObject(MINIO_BUCKET_NAME, objectKey);
};

export const deleteFileFromMinIO = async (objectKey: string) => {
  await minioClient.removeObject(MINIO_BUCKET_NAME, objectKey);
};