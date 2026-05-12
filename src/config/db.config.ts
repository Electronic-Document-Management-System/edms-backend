import { PrismaClient } from '@prisma/client';
import logger from '../logger/winston.logger';
import bcrypt from 'bcrypt';
import ApiError from '../utils/ApiError';

export const prisma = new PrismaClient().$extends({
  model: {
    user: {
      async findAndVerify(email: string, password: string) {
        const user = await prisma.user.findUnique({
          where: { email },
          include: { roles: { include: { role: true } } },
        });
        if (!user) return null;

        return user;
      },
    },
  },
});

export const connectDB = async () => {
  try {
    await prisma.$connect();
    logger.info('🐘 PostgreSQL connected via Prisma');
  } catch (error) {
    logger.error(`❌ Database connection error: ${error}`);
  }
};
