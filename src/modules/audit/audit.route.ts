import { Router } from "express";
import { requirePermission } from "../../middlewares/rbac.middleware";
import { requireAuth } from "../../middlewares/auth.middleware";

const router = Router();

router
    .route("/")
    .get(requireAuth, requirePermission,)

router
    .route("/:id")
    .get(requireAuth, requirePermission,)


router
    .route("/document/:id")
    .get(requireAuth, requirePermission, )

// GET    /api/audit-logs
// GET    /api/audit-logs/:id
// GET    /api/documents/:id/audit-logs

export default router;