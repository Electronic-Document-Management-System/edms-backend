import { PrismaClient } from '@prisma/client';
import logger from '../logger/winston.logger';

const prisma = new PrismaClient();

export const connectDB = async () => {
  try {
    await prisma.$connect();
    logger.info('🐘 PostgreSQL connected via Prisma');
  } catch (error) {
    logger.error(`❌ Database connection error: ${error}`);
  }
};
