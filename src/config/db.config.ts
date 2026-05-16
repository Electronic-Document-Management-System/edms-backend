import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import logger from "../logger/winston.logger";
import { Pool } from "pg";


const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prismaClient = new PrismaClient({
  adapter,
});

export const prisma = prismaClient.$extends({
  model: {
    user: {
      async findAndVerify(email: string, password: string) {
        const user = await prismaClient.user.findUnique({
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
    logger.info("🐘 PostgreSQL connected via Prisma");
  } catch (error) {
    logger.error(`❌ Database connection error: ${error}`);
    process.exit(1);
  }
};