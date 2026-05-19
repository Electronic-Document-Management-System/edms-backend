import { Router } from "express";
import { requirePermission } from "../../middlewares/rbac.middleware";
import { requireAuth } from "../../middlewares/auth.middleware";
import { exportAuditReport, exportDepartmentsReport, exportDocumentsReport, viewAuditReport, viewDepartmentsReport, viewDocumentsReport, viewWorkflowsReport } from "./report.controller";

const router = Router();

// GET    /api/reports/documents
// GET    /api/reports/departments
// GET    /api/reports/workflows
// GET    /api/reports/audit

// GET    /api/reports/documents/export
// GET    /api/reports/audit/export
// GET    /api/reports/departments/export

router
    .route("/documents")
    .get(requireAuth, requirePermission, viewDocumentsReport);

router
    .route("/departments")
    .get(requireAuth, requirePermission, viewDepartmentsReport);

router
    .route("/workflows")
    .get(requireAuth, requirePermission, viewWorkflowsReport);

router
    .route("/audit")
    .get(requireAuth, requirePermission, viewAuditReport);

router
    .route("/audit/export")
    .get(requireAuth, requirePermission, exportAuditReport);

router
    .route("/documents/export")
    .get(requireAuth, requirePermission, exportDocumentsReport);

router
    .route("/departments/export")
    .get(requireAuth, requirePermission, exportDepartmentsReport);

export default router;