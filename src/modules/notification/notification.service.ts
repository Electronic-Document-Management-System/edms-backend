import { NotificationType, Prisma } from '@prisma/client';
import { prisma } from '@/config/db.config';
import ApiError from '@/utils/ApiError';
import { sendSseEventToUser } from './notification.sse';

type CreateNotificationInput = {
    userId: number;
    type: NotificationType;
    title: string;
    message: string;
    resource?: string;
    resourceId?: number;
};

export const createNotificationService = async (input: CreateNotificationInput) => {
    const notification = await prisma.notification.create({
        data: {
            userId: input.userId,
            type: input.type,
            title: input.title,
            message: input.message,
            resource: input.resource,
            resourceId: input.resourceId,
        },
    });

    sendSseEventToUser(input.userId, notification);

    return notification;
};

export const getMyAllNotificationsService = async ({
    userId,
    page = 1,
    limit = 20,
    isRead,
}: {
    userId: number;
    page?: number;
    limit?: number;
    isRead?: boolean;
}) => {
    const where: Prisma.NotificationWhereInput = {
        userId,
        ...(isRead !== undefined ? { isRead } : {}),
    };

    const [notifications, total, unreadCount] = await Promise.all([
        prisma.notification.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
        }),
        prisma.notification.count({ where }),
        prisma.notification.count({ where: { userId, isRead: false } }),
    ]);

    return { notifications, total, page, limit, unreadCount };
};

export const getNotificationService = async ({
    notificationId,
    userId,
}: {
    notificationId: number;
    userId: number;
}) => {
    const notification = await prisma.notification.findUnique({
        where: { id: notificationId },
    });

    if (!notification) {
        throw new ApiError(404, 'Notification not found');
    }

    if (notification.userId !== userId) {
        throw new ApiError(403, 'You cannot access this notification');
    }

    return notification;
};

export const markNotificationAsReadService = async ({
    notificationId,
    userId,
}: {
    notificationId: number;
    userId: number;
}) => {
    const existing = await prisma.notification.findUnique({
        where: { id: notificationId },
    });

    if (!existing) {
        throw new ApiError(404, 'Notification not found');
    }

    if (existing.userId !== userId) {
        throw new ApiError(403, 'You cannot modify this notification');
    }

    if (existing.isRead) {
        return existing;
    }

    const notification = await prisma.notification.update({
        where: { id: notificationId },
        data: {
            isRead: true,
            readAt: new Date(),
        },
    });

    return notification;
};

export const markAllNotificationsAsReadService = async (userId: number) => {
    const result = await prisma.notification.updateMany({
        where: { userId, isRead: false },
        data: {
            isRead: true,
            readAt: new Date(),
        },
    });

    return { count: result.count };
};

export const deleteNotificationService = async ({
    notificationId,
    userId,
}: {
    notificationId: number;
    userId: number;
}) => {
    const existing = await prisma.notification.findUnique({
        where: { id: notificationId },
    });

    if (!existing) {
        throw new ApiError(404, 'Notification not found');
    }

    if (existing.userId !== userId) {
        throw new ApiError(403, 'You cannot delete this notification');
    }

    await prisma.notification.delete({ where: { id: notificationId } });

    return { id: notificationId };
};

export const deleteAllNotificationsService = async (userId: number) => {
    const result = await prisma.notification.deleteMany({ where: { userId } });

    return { count: result.count };
};