import { Router } from "express";
import { requirePermission } from "@/middlewares/rbac.middleware";
import { requireAuth } from "@/middlewares/auth.middleware";
import { exportAuditReport, exportDepartmentsReport, exportDocumentsReport, exportWorkflowReport, viewAuditReport, viewDepartmentsReport, viewDocumentsReport, viewWorkflowsReport } from "./report.controller";
import { ACTIONS, RESOURCES, SCOPES } from "@/constants";

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
    .get(
        requireAuth,
        requirePermission({
            resource: RESOURCES.REPORT,
            action:ACTIONS.READ,
            scope: SCOPES.ALL
        }),
        viewDocumentsReport
    );

router
    .route("/departments")
    .get(
        requireAuth, 
        requirePermission({
            resource: RESOURCES.REPORT,
            action: ACTIONS.READ,
            scope: SCOPES.ALL
        }), 
        viewDepartmentsReport
    );

router
    .route("/workflows")
    .get(
        requireAuth, 
        requirePermission({
            resource: RESOURCES.REPORT,
            action: ACTIONS.READ,
            scope: SCOPES.ALL
        }), 
        viewWorkflowsReport
    );

router
    .route("/audit")
    .get(
        requireAuth, 
        requirePermission({
            resource: RESOURCES.REPORT,
            action: ACTIONS.READ,
            scope: SCOPES.ALL
        }), 
        viewAuditReport
    );

router
    .route("/audit/export")
    .get(
        requireAuth,
        requirePermission({
            resource: RESOURCES.REPORT,
            action: ACTIONS.DOWNLOAD,
            scope: SCOPES.ALL
        }), 
        exportAuditReport
    );

router
    .route("/documents/export")
    .get(
        requireAuth, 
        requirePermission({
            resource: RESOURCES.REPORT,
            action: ACTIONS.DOWNLOAD,
            scope: SCOPES.ALL
        }), 
        exportDocumentsReport
    );

router
    .route("/departments/export")
    .get(
        requireAuth, 
        requirePermission({
            resource: RESOURCES.REPORT,
            action: ACTIONS.DOWNLOAD,
            scope: SCOPES.ALL
        }), 
        exportDepartmentsReport
    );

router
    .route("/workflows/export")
    .get(
        requireAuth, 
        requirePermission({
            resource: RESOURCES.REPORT,
            action: ACTIONS.DOWNLOAD,
            scope: SCOPES.ALL
        }), 
        exportWorkflowReport
    );

export default router;