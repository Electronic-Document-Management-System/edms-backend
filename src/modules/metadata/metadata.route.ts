import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware";
import { requirePermission } from "../../middlewares/rbac.middleware";
import { createMetadataField, deleteMetadataField, getAllMetadataFields, getMetadataFieldById, updateMetadataField } from "./metadata.controller";

const router = Router()

/**
Metadata Fields
GET    /api/metadata-fields
GET    /api/metadata-fields/:id
POST   /api/metadata-fields
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
    .route("/")
    .get(requireAuth, requirePermission, getAllMetadataFields)
    .post(requireAuth, requirePermission, createMetadataField)

router
    .route("/:id")
    .get(requireAuth, requirePermission, getMetadataFieldById)
    .patch(requireAuth, requirePermission,updateMetadataField)
    .delete(requireAuth, requirePermission, deleteMetadataField)

export default router;