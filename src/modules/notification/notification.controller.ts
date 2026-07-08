import asyncHandler from "@/utils/asyncHandler";
import { Request, Response } from "express";
import { deleteAllNotificationsService, deleteNotificationService, getMyAllNotificationsService, getNotificationService, markAllNotificationsAsReadService, markNotificationAsReadService } from "./notification.service";
import { ApiResponse } from "@/utils/ApiResponse";

/**
 * @description Get all notifications for the current user
 * @route GET /api/v1/notifications
 * @access Private
 */
export const getMyAllNotifications = asyncHandler(async (req: Request, res: Response) => {
    const userId = Number(req.user?.id);
    const notifications = await getMyAllNotificationsService({
        userId,
        page: 1,
        limit: 10,
        isRead: false
    });
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                notifications,
                "Notifications retrieved successfully"
            )
        );
});

/**
 * @description Mark all notifications as read
 * @route PUT /api/v1/notifications/read
 * @access Private
 */
export const markAllNotificationsAsRead = asyncHandler(async (req: Request, res: Response) => {

    const userId = Number(req.user?.id);
    const markedNotifications = await markAllNotificationsAsReadService(userId)

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                markedNotifications,
                "Notifications marked as read successfully"
            )
        );
});

/**
 * @description Delete all notifications
 * @route POST /api/v1/notifications/delete-all
 * @access Private
 */
export const deleteNotifications = asyncHandler(async (req: Request, res: Response) => {

    const userId = Number(req.user?.id);
    const deletedNotification = await deleteAllNotificationsService(userId);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                deletedNotification,
                "Notifications deleted successfully"
            )
        );
});

/**
 * @description Get a specific notification by ID
 * @route GET /api/v1/notifications/:notificationId
 * @access Private
 */
export const getNotificationById = asyncHandler(async (req: Request, res: Response) => {
    const notificationId = Number(req.params.notificationId);
    const userId = Number(req.user?.id);
    const notification = await getNotificationService({ notificationId, userId });
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                notification,
                "Notification retrieved successfully"
            )
        );
});

/**
 * @description Delete a specific notification by ID
 * @route DELETE /api/v1/notifications/:notificationId
 * @access Private
 */
export const deleteNotificationById = asyncHandler(async (req: Request, res: Response) => {
    const notificationId = Number(req.params.notificationId);
    const userId = Number(req.user?.id);
    const deletedNotification = await deleteNotificationService({notificationId, userId});

    return res.status(200).json(
        new ApiResponse(
            200,
            deletedNotification,
            "Notification deleted successfully"
        )
    );
});

/**
 * @description Mark a specific notification as read
 * @route PUT /api/v1/notifications/:notificationId/read
 * @access Private
 */
export const markNotificationAsRead = asyncHandler(async (req: Request, res: Response) => {

    const notificationId = Number(req.params.notificationId);
    const userId = Number(req.user?.id);
    const markedNotification = await markNotificationAsReadService({ notificationId, userId });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                markedNotification,
                "Notification marked as read successfully"
            )
        );
});