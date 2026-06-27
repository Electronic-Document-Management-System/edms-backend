import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware";
import { requireAnyPermission, requirePermission } from "../../middlewares/rbac.middleware";
import { ACTIONS, RESOURCES, SCOPES } from "@/constants";
import { getMyWorkflowSubmissions, getWorkflowsAssignedToMe } from "./workflow.controller";

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
    .route('/assigned-to-me')
    .get(
        requireAuth,
        requireAnyPermission(
            [{
                resource: RESOURCES.WORKFLOW,
                action: ACTIONS.READ,
                scope: SCOPES.ALL
            },
            {
                resource: RESOURCES.WORKFLOW,
                action: ACTIONS.READ,
                scope: SCOPES.ASSIGNED
            }]
        ),
        getWorkflowsAssignedToMe
    );

router
    .route('/my-submissions')
    .get(
        requireAuth,
        requirePermission({
            resource: RESOURCES.WORKFLOW,
            action: ACTIONS.READ,
            scope: SCOPES.OWN,
        }),
        getMyWorkflowSubmissions
    );

router
    .route("/")
    .get(requireAuth, requirePermission)
    .post(requireAuth, requirePermission)

router
    .route("/:id")
    .get(requireAuth, requirePermission)
    .patch(requireAuth, requirePermission)
    .delete(requireAuth, requirePermission)


export default router;