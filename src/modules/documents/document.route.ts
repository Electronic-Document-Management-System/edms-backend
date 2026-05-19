import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware";
import { archiveDocument, createNewDocument, downloadDocument, getAllDocuments, getDocumentById, removeDocument, restoreDocument, searchDocuments, updateDocument } from "./document.controller";
import { requirePermission } from "../../middlewares/rbac.middleware";
// Workflow routes
import { approveDocument, assignReviewer, getWorkflowStatus, reassignReviewer, rejectDocument, submitDocument } from "../workflow/workflow.controller";
import { addDocumentMetadata, getDocumentMetadata, removeDocumentMetadata, updateDocumentMetadata } from "../metadata/metadata.controller";
import { getSharedDocuments, removeShare, removeShare, shareDocument } from "../sharing/sharing.controller";
import { addDocumentComment, getDocumentComments } from "../comment/comment.controller";
import { createDocumentVersion, getDocumentVersionById, getDocumentVersions, restoreDocumentVersion } from "../document_versions/documentVersions.controller";

const router = Router()

/**
// Documents endpoints
GET    /api/documents
GET    /api/documents/:id
POST   /api/documents
PATCH  /api/documents/:id
DELETE /api/documents/:id

GET    /api/documents/:id/download
PATCH  /api/documents/:id/archive
PATCH  /api/documents/:id/restore

GET    /api/documents/search
 
// Document workflow endpoints
POST   /api/documents/:documentId/submit
POST   /api/documents/:documentId/approve
POST   /api/documents/:documentId/reject
POST   /api/documents/:documentId/assign-reviewer
POST   /api/documents/:documentId/reassign-reviewer
GET    /api/documents/:documentId/workflow-status
*/

// Documents routes
router
    .route("/")
    .get(requireAuth, requirePermission, getAllDocuments)
    .post(requireAuth, requirePermission, createNewDocument)

router
    .route("/:id")
    .get(requireAuth, requirePermission, getDocumentById)
    .patch(requireAuth, requirePermission, updateDocument)
    .delete(requireAuth, requirePermission, removeDocument)

router
    .route("/:id/download")
    .get(requireAuth, requirePermission, downloadDocument)

router
    .route("/:id/archive")
    .patch(requireAuth, requirePermission, archiveDocument)

router
    .route("/:id/restore")
    .patch(requireAuth, requirePermission, restoreDocument)

router
    .route("/search")
    .get(requireAuth, requirePermission, searchDocuments)


// Document workflow routes

router
    .route("/:documentId/submit")
    .post(requireAuth, requirePermission, submitDocument)

router
    .route("/:documentId/approve")
    .post(requireAuth, requirePermission, approveDocument)

router
    .route("/:documentId/reject")
    .post(requireAuth, requirePermission, rejectDocument)

router
    .route("/:documentId/assign-reviewer")
    .post(requireAuth, requirePermission, assignReviewer)

router
    .route("/:documentId/reassign-reviewer")
    .post(requireAuth, requirePermission, reassignReviewer)

router
    .route("/:documentId/workflow-status")
    .get(requireAuth, requirePermission, getWorkflowStatus)


// Document metadata routes
router
    .route("/:documentId/metadata")
    .get(requireAuth, requirePermission, getDocumentMetadata)
    .post(requireAuth, requirePermission, addDocumentMetadata)
    .patch(requireAuth, requirePermission, updateDocumentMetadata)

router
    .route("/:documentId/metadata/:metadataId")
    .delete(requireAuth, requirePermission, removeDocumentMetadata)


// Document sharing routes

router
    .route("/:documentId/share")
    .get(requireAuth, requirePermission, getSharedDocuments)

router
    .route("/:documentId/shares")
    .post(requireAuth, requirePermission, shareDocument)

router
    .route("/:documentId/shares/:shareId")
    .delete(requireAuth, requirePermission, removeShare)


// Comment routes
router
    .route("/:documentId/comments")
    .get(requireAuth, requirePermission, getDocumentComments)
    .post(requireAuth, requirePermission, addDocumentComment)


// Document versions routes
router
    .route("/:documentId/versions")
    .get(requireAuth, requirePermission, getDocumentVersions)
    .post(requireAuth, requirePermission, createDocumentVersion)

router
    .route("/:documentId/versions/:versionId")
    .get(requireAuth, requirePermission, getDocumentVersionById)
    .post(requireAuth, requirePermission, createDocumentVersion)

router
    .route("/:documentId/versions/:versionId/restore")
    .patch(requireAuth, requirePermission, restoreDocumentVersion)

export default router;