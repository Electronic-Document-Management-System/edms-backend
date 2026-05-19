import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware";
import { requirePermission } from "../../middlewares/rbac.middleware";
import { createFolder, deleteFolder, getFolderById, getFolders, moveFolder, updateFolder } from "./folders.controller";

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
    .get(requireAuth, requirePermission, getFolders)
    .post(requireAuth, requirePermission, createFolder)

router
    .route("/:id")
    .get(requireAuth, requirePermission, getFolderById)
    .patch(requireAuth, requirePermission, updateFolder)
    .delete(requireAuth, requirePermission, deleteFolder);

router
    .route("/:id/move")
    .patch(requireAuth, requirePermission, moveFolder);

export default router;