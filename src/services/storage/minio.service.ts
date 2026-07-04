import { Readable } from 'stream';
import {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadBucketCommand,
  CreateBucketCommand,
} from '@aws-sdk/client-s3';
import { s3Client, BUCKET_NAME } from '@/config/minio.config';
import {getSignedUrl} from '@aws-sdk/s3-request-presigner'

export const ensureBucketExists = async () => {
  try {
    await s3Client.send(new HeadBucketCommand({ Bucket: BUCKET_NAME }));
  } catch (error: any) {
    if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
      await s3Client.send(new CreateBucketCommand({ Bucket: BUCKET_NAME }));
    } else {
      throw error;
    }
  }
};

export const uploadFileToMinIO = async (
  file: Express.Multer.File,
  objectKey: string,
) => {
  await ensureBucketExists();

  await s3Client.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: objectKey,
      Body: file.buffer,
      ContentType: file.mimetype,
      Metadata: {
        'original-name': file.originalname,
      },
    }),
  );

  return {
    bucketName: BUCKET_NAME,
    objectKey,
    originalName: file.originalname,
    mimeType: file.mimetype,
    fileSize: file.size,
  };
};

export const getFileFromMinIO = async (objectKey: string): Promise<Readable> => {
  const response = await s3Client.send(
    new GetObjectCommand({ Bucket: BUCKET_NAME, Key: objectKey }),
  );
  return response.Body as Readable;
};

export const deleteFileFromMinIO = async (objectKey: string) => {
  await s3Client.send(
    new DeleteObjectCommand({ Bucket: BUCKET_NAME, Key: objectKey }),
  );
};

export const generatePresignedUrl = async (objectKey: string, expiresIn= 3600) => {

  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME, 
    Key: objectKey
  });
  return getSignedUrl(s3Client, command, { expiresIn })
}