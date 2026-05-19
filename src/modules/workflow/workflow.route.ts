import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware";
import { requirePermission } from "../../middlewares/rbac.middleware";
import { createNewWorkflow, finishWorkflow, getAllWorkflows, getWorkflowById, updateWorkflow } from "./workflow.controller";

/**
GET    /api/workflows
GET    /api/workflows/:id
POST   /api/workflows
PATCH  /api/workflows/:id
DELETE /api/workflows/:id

// Document workflow endpoints  location: document.route.ts
POST   /api/documents/:documentId/submit
POST   /api/documents/:documentId/approve
POST   /api/documents/:documentId/reject
POST   /api/documents/:documentId/assign-reviewer
POST   /api/documents/:documentId/reassign-reviewer

GET    /api/documents/:documentId/workflow-status
*/


const router = Router();

router
    .route("/")
    .get(requireAuth, requirePermission, getAllWorkflows)
    .post(requireAuth, requirePermission, createNewWorkflow)

router
    .route("/:id")
    .get(requireAuth, requirePermission, getWorkflowById)
    .patch(requireAuth, requirePermission, updateWorkflow)
    .delete(requireAuth, requirePermission, finishWorkflow)


export default router;