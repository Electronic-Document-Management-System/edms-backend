import { Router } from "express";
import { requirePermission } from "@/middlewares/rbac.middleware";
import { requireAuth } from "@/middlewares/auth.middleware";
import { getAuditLogById, getAuditLogs } from "./audit.controller";
import { ACTIONS, RESOURCES, SCOPES } from "@/constants";

const router = Router();

router
    .route("/")
    .get(
        requireAuth,
        requirePermission({ resource: RESOURCES.AUDITLOG, action: ACTIONS.READ, scope: SCOPES.ALL }),
        getAuditLogs
    );

router
    .route("/:logId")
    .get(
        requireAuth,
        requirePermission({ resource: RESOURCES.AUDITLOG, action: ACTIONS.READ, scope: SCOPES.ALL }),
        getAuditLogById
    );


export default router;