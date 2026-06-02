import { Router } from "express";
import { requireAuth } from "@/middlewares/auth.middleware";
import { requirePermission } from "@/middlewares/rbac.middleware";
import { createMetadataField, deleteMetadataField, getAllMetadataFields, getMetadataFieldById, updateMetadataField } from "./metadata.controller";
import { ACTIONS, RESOURCES, SCOPES } from "@/constants";

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
    .get(requireAuth,
        requirePermission({
            resource: RESOURCES.METADATA_FIELD,
            action: ACTIONS.READ,
            scope: SCOPES.ALL
        }),
        getAllMetadataFields)
    .post(requireAuth,
        requirePermission({
            resource: RESOURCES.METADATA_FIELD,
            action: ACTIONS.CREATE,
            scope: SCOPES.ALL
        }),
        createMetadataField)

router
    .route("/fields/:id")
    .get(requireAuth,
        requirePermission({
            resource: RESOURCES.METADATA_FIELD,
            action: ACTIONS.READ,
            scope: SCOPES.ALL
        }),
        getMetadataFieldById)
    .patch(requireAuth,
        requirePermission({
            resource: RESOURCES.METADATA_FIELD,
            action: ACTIONS.UPDATE,
            scope: SCOPES.ALL
        }),
        updateMetadataField)
    .delete(requireAuth,
        requirePermission({
            resource: RESOURCES.METADATA_FIELD,
            action: ACTIONS.DELETE,
            scope: SCOPES.ALL
        }),
        deleteMetadataField)

export default router;