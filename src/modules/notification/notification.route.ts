import { Router } from "express";
import { deleteNotification, getAllNotifications, getNotification, markNotificationAsRead, markNotificationsAsRead } from "./notification.controller";
import { requireAuth } from "../../middlewares/auth.middleware";
import { requirePermission } from "../../middlewares/rbac.middleware";

const router = Router();

router
    .route("/")
    .get(requireAuth, requirePermission, getAllNotifications);

router
    .route("/:id")
    .post(requireAuth, requirePermission, getNotification)
    .delete(requireAuth, requirePermission, deleteNotification);

router
    .route("/:id/read")
    .post(requireAuth, requirePermission, markNotificationsAsRead);

router
    .route("/read-all")
    .post(requireAuth, requirePermission, markNotificationsAsRead);

router
    .route("/delete-all")
    .post(requireAuth, requirePermission, deleteNotification);

export default router;