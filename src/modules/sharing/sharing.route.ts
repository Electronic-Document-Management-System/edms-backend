import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware";
import { requirePermission } from "../../middlewares/rbac.middleware";
import { downloadDocumentSharedLink, viewDocumentSharedLink } from "./sharing.controller";

const router = Router()


router
    .route("/shared/:token")
    .get(requireAuth, requirePermission, viewDocumentSharedLink)

router
    .route("/shared/:token/download")
    .get(requireAuth, requirePermission, downloadDocumentSharedLink)

export default router