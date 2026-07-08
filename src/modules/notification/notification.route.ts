import { Router } from "express";
import { deleteNotifications, getMyAllNotifications, markNotificationAsRead, markAllNotificationsAsRead, deleteNotificationById, getNotificationById } from "./notification.controller";
import { requireAuth } from "@/middlewares/auth.middleware";
import { requirePermission } from "@/middlewares/rbac.middleware";
import { ACTIONS, RESOURCES, SCOPES } from "@/constants";

const router = Router();

router
    .route("/")
    .get(
        requireAuth,
        requirePermission({
            resource: RESOURCES.NOTIFICATION,
            action: ACTIONS.READ,
            scope: SCOPES.OWN
        }),
        getMyAllNotifications
    );

router
    .route("/read-all")
    .post(
        requireAuth,
        requirePermission({
            resource: RESOURCES.NOTIFICATION,
            action: ACTIONS.READ,
            scope: SCOPES.OWN
        }),
        markAllNotificationsAsRead
    );

router
    .route("/delete-all")
    .post(
        requireAuth,
        requirePermission({
            resource: RESOURCES.NOTIFICATION,
            action: ACTIONS.DELETE,
            scope: SCOPES.OWN
        }),
        deleteNotifications
    );

router
    .route("/:notificationId")
    .get(
        requireAuth,
        requirePermission({
            resource: RESOURCES.NOTIFICATION,
            action: ACTIONS.READ,
            scope: SCOPES.OWN
        }),
        getNotificationById
    )
    .delete(
        requireAuth,
        requirePermission({
            resource: RESOURCES.NOTIFICATION,
            action: ACTIONS.DELETE,
            scope: SCOPES.OWN
        }),
        deleteNotificationById
    );

router
    .route("/:notificationId/read")
    .post(
        requireAuth,
        requirePermission({
            resource: RESOURCES.NOTIFICATION,
            action: ACTIONS.READ,
            scope: SCOPES.OWN
        }),
        markNotificationAsRead
    );


export default router;