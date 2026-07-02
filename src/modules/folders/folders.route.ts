import { Router } from "express";
import { requireAuth } from "@/middlewares/auth.middleware";
import { requirePermission } from "@/middlewares/rbac.middleware";
import { createFolder, deleteFolder, getFolderById, getFolders, moveFolder, updateFolder } from "./folders.controller";
import { ACTIONS, RESOURCES, SCOPES } from "@/constants";
import { auditLog } from "@/middlewares/audit.middleware";
import { AuditAction } from "@prisma/client";

const router = Router();

/**
 * GET    /api/folders
GET    /api/folders/:id
POST   /api/folders
PATCH  /api/folders/:id
DELETE /api/folders/:id

PATCH  /api/folders/:id/move
 */
router
    .route("/")
    .get(
        requireAuth,
        requirePermission({
            resource: RESOURCES.FOLDER,
            action: ACTIONS.READ,
            scope: SCOPES.ALL
        }),
        getFolders
    )
    .post(
        requireAuth,
        requirePermission({
            resource: RESOURCES.FOLDER,
            action: ACTIONS.CREATE,
            scope: SCOPES.ALL
        }),
        auditLog(AuditAction.FOLDER_CREATED, 'folder'),
        createFolder
    )

router
    .route("/:id")
    .get(
        requireAuth,
        requirePermission({
            resource: RESOURCES.FOLDER,
            action: ACTIONS.READ,
            scope: SCOPES.ALL
        }),
        getFolderById
    )
    .patch(
        requireAuth,
        requirePermission({
            resource: RESOURCES.FOLDER,
            action: ACTIONS.UPDATE,
            scope: SCOPES.ALL
        }),
        auditLog(AuditAction.FOLDER_UPDATED, 'folder'),
        updateFolder
    )
    .delete(
        requireAuth,
        requirePermission({
            resource: RESOURCES.FOLDER,
            action: ACTIONS.DELETE,
            scope: SCOPES.ALL
        }),
        auditLog(AuditAction.FOLDER_DELETED, 'folder'),
        deleteFolder
    );

router
    .route("/:id/move")
    .patch(
        requireAuth,
        requirePermission({
            resource: RESOURCES.FOLDER,
            action: ACTIONS.MOVE,
            scope: SCOPES.ALL
        }),
        auditLog(AuditAction.FOLDER_MOVED, 'folder'),
        moveFolder
    );

export default router;