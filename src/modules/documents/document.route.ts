import { Router } from 'express';
import { requireAuth } from '@/middlewares/auth.middleware';
import {
  archiveDocument,
  downloadDocument,
  getAllDocuments,
  getDocumentById,
  removeDocument,
  restoreDocument,
  searchDocuments,
  updateDocument,
  uploadBulkDocuments,
  uploadDocument,
} from './document.controller';
import {
  requireAnyPermission,
  requirePermission,
} from '@/middlewares/rbac.middleware';

// Workflow routes
import {
  approveDocument,
  assignReviewer,
  getWorkflowStatus,
  reassignReviewer,
  rejectDocument,
  submitDocument,
} from '@/modules/workflow/workflow.controller';
import {
  addDocumentMetadata,
  getDocumentMetadata,
  removeDocumentMetadata,
  updateDocumentMetadata,
} from '@/modules/metadata/metadata.controller';
import {
  getSharedDocuments,
  removeShare,
  shareDocument,
} from '@/modules/sharing/sharing.controller';
import {
  addDocumentComment,
  getDocumentComments,
} from '@/modules/comment/comment.controller';
import {
  createDocumentVersion,
  getDocumentVersionById,
  getDocumentVersions,
  restoreDocumentVersion,
} from '@/modules/document_versions/documentVersions.controller';
import {
  uploadMultipleDocumentFiles,
  uploadSingleDocumentFile,
} from '@/middlewares/upload.middleware';
import { ACTIONS, RESOURCES, SCOPES } from '@/constants';

const router = Router();

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
  .route('/')
  .get(
    requireAuth,
    requirePermission({
      resource: RESOURCES.DOCUMENT,
      action: ACTIONS.READ,
      scope: SCOPES.ALL,
    }),
    getAllDocuments,
  )
  .post(
    requireAuth,
    requirePermission({
      resource: RESOURCES.DOCUMENT,
      action: ACTIONS.UPLOAD,
      scope: SCOPES.ALL,
    }),
    uploadSingleDocumentFile.single('file'),
    uploadDocument,
  );

router.route('/bulk-upload').post(
  requireAuth,
  requirePermission({
    resource: RESOURCES.DOCUMENT,
    action: ACTIONS.UPLOAD,
    scope: SCOPES.ALL,
  }),
  uploadMultipleDocumentFiles.array('files', 10),
  uploadBulkDocuments,
);

router
  .route('/:id')
  .get(
    requireAuth,
    requirePermission({
      resource: RESOURCES.DOCUMENT,
      action: ACTIONS.READ,
      scope: SCOPES.ALL,
    }),
    getDocumentById,
  )
  .patch(
    requireAuth,
    requirePermission({
      resource: RESOURCES.DOCUMENT,
      action: ACTIONS.UPDATE,
      scope: SCOPES.OWN,
    }),
    updateDocument,
  )
  .delete(
    requireAuth,
    requirePermission({
      resource: RESOURCES.DOCUMENT,
      action: ACTIONS.DELETE,
      scope: SCOPES.OWN,
    }),
    removeDocument,
  );

router.route('/:id/download').get(
  requireAuth,
  requirePermission({
    resource: RESOURCES.DOCUMENT,
    action: ACTIONS.DOWNLOAD,
    scope: SCOPES.ALL,
  }),
  downloadDocument,
);

router.route('/:id/archive').patch(
  requireAuth,
  requireAnyPermission([
    {
      resource: RESOURCES.DOCUMENT,
      action: ACTIONS.UPDATE,
      scope: SCOPES.OWN,
    },
    {
      resource: RESOURCES.DOCUMENT,
      action: ACTIONS.UPDATE,
      scope: SCOPES.DEPARTMENT,
    },
    {
      resource: RESOURCES.DOCUMENT,
      action: ACTIONS.UPDATE,
      scope: SCOPES.ALL,
    },
  ]),
  archiveDocument,
);

router.route('/:id/restore').patch(
  requireAuth,
  requireAnyPermission([
    {
      resource: RESOURCES.DOCUMENT,
      action: ACTIONS.UPDATE,
      scope: SCOPES.OWN,
    },
    {
      resource: RESOURCES.DOCUMENT,
      action: ACTIONS.UPDATE,
      scope: SCOPES.DEPARTMENT,
    },
    {
      resource: RESOURCES.DOCUMENT,
      action: ACTIONS.UPDATE,
      scope: SCOPES.ALL,
    },
  ]),
  restoreDocument,
);

router.route('/search').get(requireAuth, requirePermission, searchDocuments);

// Document workflow routes

router
  .route('/:id/submit')
  .post(requireAuth, requirePermission, submitDocument);

router
  .route('/:id/approve')
  .post(requireAuth, requirePermission, approveDocument);

router
  .route('/:id/reject')
  .post(requireAuth, requirePermission, rejectDocument);

router
  .route('/:id/assign-reviewer')
  .post(requireAuth, requirePermission, assignReviewer);

router
  .route('/:id/reassign-reviewer')
  .post(requireAuth, requirePermission, reassignReviewer);

router
  .route('/:id/workflow-status')
  .get(requireAuth, requirePermission, getWorkflowStatus);

// Document metadata routes
router
  .route('/:documentId/metadata')
  .get(
    requireAuth,
    requirePermission({
      resource: RESOURCES.DOCUMENT_METADATA,
      action: ACTIONS.READ,
      scope: SCOPES.ALL,
    }),
    getDocumentMetadata)
  .post(requireAuth,
    requirePermission({
      resource: RESOURCES.DOCUMENT_METADATA,
      action: ACTIONS.CREATE,
      scope: SCOPES.ALL
    }),
    addDocumentMetadata)

router
  .route('/:documentId/metadata/:metadataFieldId')
  .patch(
    requireAuth,
    requirePermission({
      resource: RESOURCES.DOCUMENT_METADATA,
      action: ACTIONS.UPDATE,
      scope: SCOPES.ALL,
    }),
    updateDocumentMetadata)
  .delete(
    requireAuth,
    requirePermission({
      resource: RESOURCES.DOCUMENT_METADATA,
      action: ACTIONS.DELETE,
      scope: SCOPES.ALL,
    }),
    removeDocumentMetadata,
  );

// Document sharing routes

router
  .route('/:id/share')
  .get(requireAuth, requirePermission, getSharedDocuments);

router
  .route('/:id/shares')
  .post(requireAuth, requirePermission, shareDocument);

router
  .route('/:id/shares/:shareId')
  .delete(requireAuth, requirePermission, removeShare);

// Comment routes
router
  .route('/:id/comments')
  .get(requireAuth, requirePermission, getDocumentComments)
  .post(requireAuth, requirePermission, addDocumentComment);

// Document versions routes
router
  .route('/:id/versions')
  .get(requireAuth, requirePermission, getDocumentVersions)
  .post(requireAuth, requirePermission, createDocumentVersion);

router
  .route('/:id/versions/:versionId')
  .get(requireAuth, requirePermission, getDocumentVersionById)
  .post(requireAuth, requirePermission, createDocumentVersion);

router
  .route('/:id/versions/:versionId/restore')
  .patch(requireAuth, requirePermission, restoreDocumentVersion);

export default router;
