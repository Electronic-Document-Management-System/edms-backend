import { Router } from "express";
import { requirePermission } from "../../middlewares/rbac.middleware";
import { requireAuth } from "../../middlewares/auth.middleware";
import { getAllDepartments } from "./department.controller";

const router = Router();

router
.route("/")
.get(requireAuth, requirePermission, getAllDepartments)

// GET    /api/tenant/departments
// GET    /api/tenant/departments/:id
// POST   /api/tenant/departments
// PATCH  /api/tenant/departments/:id
// DELETE /api/tenant/departments/:id

export default router;
