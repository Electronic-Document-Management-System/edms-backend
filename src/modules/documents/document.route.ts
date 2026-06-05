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
  approveDocumentWorkflow,
  rejectDocumentWorkflow,
  assignReviewer,
  getWorkflowStatus,
  submitDocumentWorkflow,
  getWorkflowsAssignedToMe,
  cancelDocumentWorkflow,
} from '@/modules/workflow/workflow.controller';
import {
  addDocumentMetadata,
  getDocumentMetadata,
  removeDocumentMetadata,
  updateDocumentMetadata,
} from '@/modules/metadata/metadata.controller';
import {
  getDocumentShares,
  getDocumentsSharedWithMe,
  shareDocument,
  removeShare
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

// Document sharing routes
// Static route for documents shared with me
router
  .route('/shared-with-me')
  .get(
    requireAuth,
    requireAnyPermission([
      {
        resource: RESOURCES.DOCUMENT_SHARE,
        action: ACTIONS.READ,
        scope: SCOPES.SHARED,
      },
      {
        resource: RESOURCES.DOCUMENT_SHARE,
        action: ACTIONS.READ,
        scope: SCOPES.ALL,
      },
    ]),
    getDocumentsSharedWithMe,
  );


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
  .route('/:documentId/workflow/submit')
  .post(
    requireAuth,
    requirePermission({
      resource: RESOURCES.WORKFLOW,
      action: ACTIONS.SUBMIT,
      scope: SCOPES.ALL
    }),
    submitDocumentWorkflow
  );

router
  .route('/:documentId/workflow/approve')
  .post(
    requireAuth,
    requirePermission({
      resource: RESOURCES.WORKFLOW,
      action: ACTIONS.APPROVE,
      scope: SCOPES.ALL
    }),
    approveDocumentWorkflow
  );

router
  .route('/:documentId/workflow/reject')
  .post(
    requireAuth,
    requirePermission({
      resource: RESOURCES.WORKFLOW,
      action: ACTIONS.REJECT,
      scope: SCOPES.ALL
    }),
    rejectDocumentWorkflow
  );

router
  .route('/:documentId/workflow/assign-reviewer')
  .post(
    requireAuth,
    requirePermission({
      resource: RESOURCES.WORKFLOW,
      action: ACTIONS.ASSIGN,
      scope: SCOPES.ALL
    }),
    assignReviewer
  );

router
  .route('/:documentId/workflow/cancel')
  .post(
    requireAuth,
    requirePermission({
      resource: RESOURCES.WORKFLOW,
      action: ACTIONS.CANCEL,
      scope: SCOPES.ALL
    }),
    cancelDocumentWorkflow
  );

router
  .route('/:documentId/workflow-status')
  .get(
    requireAuth,
    requirePermission({
      resource: RESOURCES.WORKFLOW,
      action: ACTIONS.READ,
      scope: SCOPES.ALL
    }),
    getWorkflowStatus
  );


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
  .route('/:documentId/shares')
  .get(
    requireAuth,
    requireAnyPermission([
      {
        resource: RESOURCES.DOCUMENT_SHARE,
        action: ACTIONS.READ,
        scope: SCOPES.OWN,
      },
      {
        resource: RESOURCES.DOCUMENT_SHARE,
        action: ACTIONS.READ,
        scope: SCOPES.DEPARTMENT,
      },
      {
        resource: RESOURCES.DOCUMENT_SHARE,
        action: ACTIONS.READ,
        scope: SCOPES.ALL,
      },
    ]),
    getDocumentShares,
  )
  .post(
    requireAuth,
    requireAnyPermission([
      {
        resource: RESOURCES.DOCUMENT_SHARE,
        action: ACTIONS.CREATE,
        scope: SCOPES.OWN,
      },
      {
        resource: RESOURCES.DOCUMENT_SHARE,
        action: ACTIONS.CREATE,
        scope: SCOPES.DEPARTMENT,
      },
      {
        resource: RESOURCES.DOCUMENT_SHARE,
        action: ACTIONS.CREATE,
        scope: SCOPES.ALL,
      },
    ]),
    shareDocument,
  );

router
  .route('/:documentId/shares/:shareId')
  .delete(
    requireAuth,
    requireAnyPermission([
      {
        resource: RESOURCES.DOCUMENT_SHARE,
        action: ACTIONS.DELETE,
        scope: SCOPES.OWN,
      },
      {
        resource: RESOURCES.DOCUMENT_SHARE,
        action: ACTIONS.DELETE,
        scope: SCOPES.DEPARTMENT,
      },
      {
        resource: RESOURCES.DOCUMENT_SHARE,
        action: ACTIONS.DELETE,
        scope: SCOPES.ALL,
      },
    ]),
    removeShare,
  );

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
