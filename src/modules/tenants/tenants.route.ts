import { Router } from "express";
import { requirePermission } from "../../middlewares/rbac.middleware";
import { requireAuth } from "../../middlewares/auth.middleware";

const router = Router();

router
.route("/")
.get(requireAuth, requirePermission, )

// GET    /api/reports/documents
// GET    /api/reports/departments
// GET    /api/reports/audit
// GET    /api/reports/workflows

// GET    /api/reports/documents/export
// GET    /api/reports/audit/export