import asyncHandler from "../../utils/asyncHandler";
import { Request, Response } from "express";
import { deleteNotificationService, getAllNotificationsService, getNotificationService, markAllNotificationsAsReadService, markNotificationAsReadService } from "./notification.service";
import { ApiResponse } from "../../utils/ApiResponse";

export const getAllNotifications = asyncHandler(async (req: Request, res: Response) => {
    const notifications = await getAllNotificationsService();
    res.status(200).json(
        new ApiResponse(
            200,
            notifications,
            "Notifications retrieved successfully"
        )
    );
});

export const getNotification = asyncHandler(async (req: Request, res: Response) => {
    const notification = await getNotificationService();
    res.status(200).json(
        new ApiResponse(
            200,
            notification,
            "Notification retrieved successfully"
        )
    );
});

export const markNotificationAsRead = asyncHandler(async (req: Request, res: Response) => {

    const notificationId = req.params.id;
    const markedNotification = await markNotificationAsReadService();

    res.status(200).json(
        new ApiResponse(
            200,
            markedNotification,
            "Notification marked as read successfully"
        )
    );
});

export const markNotificationsAsRead = asyncHandler(async (req: Request, res: Response) => {

    const markedNotifications = await markAllNotificationsAsReadService();

    res.status(200).json(
        new ApiResponse(
            200,
            markedNotifications,
            "Notifications marked as read successfully"
        )
    );
});

export const deleteNotification = asyncHandler(async (req: Request, res: Response) => {

    const deletedNotification = await deleteNotificationService();

    res.status(200).json(
        new ApiResponse(
            200,
            deletedNotification,
            "Notification deleted successfully"
        )
    );
});
