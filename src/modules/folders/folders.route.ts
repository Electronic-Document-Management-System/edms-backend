import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware";
import { requirePermission } from "../../middlewares/rbac.middleware";
import { createFolder, deleteFolder, getFolderById, getFolders, moveFolder, updateFolder } from "./folders.controller";
import { ACTIONS, RESOURCES, SCOPES } from "../../constants";

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
    .get(requireAuth, requirePermission({
        resource: RESOURCES.FOLDER,
        action: ACTIONS.READ,
        scope: SCOPES.ALL
    }),
        getFolders)
    .post(requireAuth, requirePermission({
        resource: RESOURCES.FOLDER,
        action: ACTIONS.CREATE,
        scope: SCOPES.ALL
    }), createFolder)

router
    .route("/:id")
    .get(requireAuth, requirePermission({
        resource: RESOURCES.FOLDER,
        action: ACTIONS.READ,
        scope: SCOPES.ALL
    }),
        getFolderById)
    .patch(requireAuth, requirePermission({
        resource: RESOURCES.FOLDER,
        action: ACTIONS.UPDATE,
        scope: SCOPES.ALL
    }),
        updateFolder)
    .delete(requireAuth, requirePermission({
        resource: RESOURCES.FOLDER,
        action: ACTIONS.DELETE,
        scope: SCOPES.ALL
    }),
        deleteFolder);

router
    .route("/:id/move")         
    .patch(requireAuth, requirePermission({
        resource: RESOURCES.FOLDER,
        action: ACTIONS.MOVE,
        scope: SCOPES.ALL
    })  , moveFolder);

export default router;