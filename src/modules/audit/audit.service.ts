import { AuditAction, Prisma } from '@prisma/client';
import { prisma } from '@/config/db.config';
import logger from '@/logger/winston.logger';
import { Request } from 'express';

const SENSITIVE_FIELDS = [
    'password',
    'password_hash',
    'refreshToken',
    'accessToken',
    'token',
    'secret',
];

const sanitizeBody = (body: Record<string, unknown>): Record<string, unknown> => {
    if (!body || typeof body !== 'object') return {};

    return Object.fromEntries(
        Object.entries(body).map(([key, value]) => {
            if (SENSITIVE_FIELDS.includes(key)) return [key, '[REDACTED]'];
            return [key, value];
        })
    );
};

const extractFileMetadata = (req: Request) => {
    if (!req.file) return undefined;
    return {
        fileName: req.file.originalname,
        mimeType: req.file.mimetype,
        fileSize: req.file.size,
    };
};

type CreateAuditLogInput = {
    action: AuditAction;
    resource: string;
    resourceId?: number | null;
    userId: number;
    metadata?: Prisma.InputJsonValue;
    ipAddress?: string;
    userAgent?: string;
};

export const createAuditLogService = async (input: CreateAuditLogInput) => {
    try {
        await prisma.auditLog.create({
            data: {
                action: input.action,
                resource: input.resource,
                resourceId: input.resourceId ?? null,
                userId: input.userId,
                metadata: input.metadata,
                ipAddress: input.ipAddress,
                userAgent: input.userAgent,
            },
        });
    } catch (error) {
        logger.error('Failed to create audit log:', error);
    }
};

export const buildAuditMetadata = (req: Request): Prisma.InputJsonValue => {
    const body = req.body ? sanitizeBody(req.body) : undefined;
    const file = extractFileMetadata(req);

    return {
        ...(body && Object.keys(body).length > 0 ? { body } : {}),
        ...(file ? { file } : {}),
    } as Prisma.InputJsonValue;
};

export const getAllAuditLogsService = async ({
    page = 1,
    limit = 20,
    userId,
    action,
    resource,
    resourceId,
    startDate,
    endDate,
}: {
    page?: number;
    limit?: number;
    userId?: number;
    action?: AuditAction;
    resource?: string;
    resourceId?: number;
    startDate?: Date;
    endDate?: Date;
}) => {
    const where: Prisma.AuditLogWhereInput = {
        ...(userId ? { userId } : {}),
        ...(action ? { action } : {}),
        ...(resource ? { resource } : {}),
        ...(resourceId ? { resourceId } : {}),
        ...(startDate || endDate ? {
            createdAt: {
                ...(startDate ? { gte: new Date(startDate) } : {}),
                ...(endDate ? { lte: new Date(endDate) } : {}),
            }
        } : {}),
    };

    const [logs, total] = await Promise.all([
        prisma.auditLog.findMany({
            where,
            include: {
                user: {
                    select: { id: true, name: true, email: true },
                },
            },
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
        }),
        prisma.auditLog.count({ where }),
    ]);

    return { logs, total, page, limit };
};

export const getAuditLogByIdService = async (logId: number) => {
    const auditLog = await prisma.auditLog.findUnique({
        where: { id: logId },
        include: {
            user: {
                select: { id: true, name: true, email: true },
            },
        },
    });

    return auditLog;
};
