import { Router } from "express";
import { requireAuth } from "@/middlewares/auth.middleware";
import { requirePermission } from "@/middlewares/rbac.middleware";
import { createMetadataField, deleteMetadataField, getAllMetadataFields, getMetadataFieldById, updateMetadataField } from "./metadata.controller";
import { ACTIONS, RESOURCES, SCOPES } from "@/constants";
import { auditLog } from "@/middlewares/audit.middleware";
import { AuditAction } from "@prisma/client";

const router = Router()

/**
Metadata Fields
GET    /api/metadata-fields
POST   /api/metadata-fields
GET    /api/metadata-fields/:id
PATCH  /api/metadata-fields/:id
DELETE /api/metadata-fields/:id

Document Metadata Routes  located at document.route.ts
GET    /api/documents/:documentId/metadata
POST   /api/documents/:documentId/metadata
PATCH  /api/documents/:documentId/metadata
DELETE /api/documents/:documentId/metadata/:metadataId
*/

// Metadata fields routes
router
    .route("/fields")
    .get(
        requireAuth,
        requirePermission({
            resource: RESOURCES.METADATA_FIELD,
            action: ACTIONS.READ,
            scope: SCOPES.ALL
        }),
        getAllMetadataFields
    )
    .post(
        requireAuth,
        requirePermission({
            resource: RESOURCES.METADATA_FIELD,
            action: ACTIONS.CREATE,
            scope: SCOPES.ALL
        }),
        auditLog(AuditAction.METADATA_FIELD_CREATED, 'metadata'),
        createMetadataField
    )

router
    .route("/fields/:id")
    .get(requireAuth,
        requirePermission({
            resource: RESOURCES.METADATA_FIELD,
            action: ACTIONS.READ,
            scope: SCOPES.ALL
        }),
        getMetadataFieldById)
    .patch(
        requireAuth,
        requirePermission({
            resource: RESOURCES.METADATA_FIELD,
            action: ACTIONS.UPDATE,
            scope: SCOPES.ALL
        }),
        auditLog(AuditAction.METADATA_FIELD_UPDATED, 'metadata'),
        updateMetadataField
    )
    .delete(
        requireAuth,
        requirePermission({
            resource: RESOURCES.METADATA_FIELD,
            action: ACTIONS.DELETE,
            scope: SCOPES.ALL
        }),
        auditLog(AuditAction.METADATA_FIELD_DELETED, 'metadata'),
        deleteMetadataField
    )

export default router;