import { Router } from 'express';
import { requireAuth } from '@/middlewares/auth.middleware';
import {
  archiveDocument,
  downloadDocument,
  getAllDocuments,
  getDocumentById,
  getPreviewUrl,
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
  deleteComment,
  getDocumentComments,
  updateComment,
} from '@/modules/comment/comment.controller';
import {
  createDocumentVersion,
  getDocumentVersionById,
  getDocumentVersions,
  restoreDocumentVersion,
} from '@/modules/document_versions/documentVersions.controller';
import {
  uploadMultipleDocuments,
  uploadSingleDocument,
} from '@/middlewares/upload.middleware';
import { ACTIONS, RESOURCES, SCOPES } from '@/constants';
import { auditLog } from '@/middlewares/audit.middleware';
import { AuditAction } from '@prisma/client';

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
    auditLog(AuditAction.DOCUMENT_SHARED, 'share'),
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
    getAllDocuments
  )
  .post(
    requireAuth,
    requirePermission({
      resource: RESOURCES.DOCUMENT,
      action: ACTIONS.UPLOAD,
      scope: SCOPES.OWN,
    }),
    uploadSingleDocument,
    auditLog(AuditAction.DOCUMENT_CREATED, 'document'),
    uploadDocument
  );

router.route('/bulk-upload').post(
  requireAuth,
  requirePermission({
    resource: RESOURCES.DOCUMENT,
    action: ACTIONS.UPLOAD,
    scope: SCOPES.ALL,
  }),
  uploadMultipleDocuments,
  uploadBulkDocuments,
);

router
  .route('/:id')
  .get(
    requireAuth,
    requireAnyPermission([{
      resource: RESOURCES.DOCUMENT,
      action: ACTIONS.READ,
      scope: SCOPES.ASSIGNED
    }, {
      resource: RESOURCES.DOCUMENT,
      action: ACTIONS.READ,
      scope: SCOPES.ALL,
    }]),
    auditLog(AuditAction.DOCUMENT_VIEWED, 'document'),
    getDocumentById
  )
  .patch(
    requireAuth,
    requirePermission({
      resource: RESOURCES.DOCUMENT,
      action: ACTIONS.UPDATE,
      scope: SCOPES.OWN,
    }),
    auditLog(AuditAction.DOCUMENT_UPDATED, 'document'),
    updateDocument
  )
  .delete(
    requireAuth,
    requirePermission({
      resource: RESOURCES.DOCUMENT,
      action: ACTIONS.DELETE,
      scope: SCOPES.OWN,
    }),
    auditLog(AuditAction.DOCUMENT_DELETED, 'document'),
    removeDocument
  );

router.route('/:id/download').get(
  requireAuth,
  requirePermission({
    resource: RESOURCES.DOCUMENT,
    action: ACTIONS.DOWNLOAD,
    scope: SCOPES.ALL,
  }),
  auditLog(AuditAction.DOCUMENT_DOWNLOADED, 'document'),
  downloadDocument
);

router
  .route('/:documentId/preview-url')
  .get(
    requireAuth,
    getPreviewUrl
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
  auditLog(AuditAction.DOCUMENT_ARCHIVED, 'document'),
  archiveDocument
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
  auditLog(AuditAction.DOCUMENT_RESTORED, 'document'),
  restoreDocument
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
    auditLog(AuditAction.WORKFLOW_SUBMITTED, 'workflow'),
    submitDocumentWorkflow
  );

router
  .route('/:documentId/workflow/approve')
  .post(
    requireAuth,
    requirePermission({
      resource: RESOURCES.WORKFLOW,
      action: ACTIONS.APPROVE,
      scope: SCOPES.ASSIGNED
    }),
    auditLog(AuditAction.WORKFLOW_APPROVED, 'workflow'),
    approveDocumentWorkflow
  );

router
  .route('/:documentId/workflow/reject')
  .post(
    requireAuth,
    requirePermission({
      resource: RESOURCES.WORKFLOW,
      action: ACTIONS.REJECT,
      scope: SCOPES.ASSIGNED
    }),
    auditLog(AuditAction.WORKFLOW_REJECTED, 'workflow'),
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
    auditLog(AuditAction.WORKFLOW_REVIEWER_ASSIGNED, 'workflow'),
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
    auditLog(AuditAction.WORKFLOW_CANCELLED, 'workflow'),
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
    auditLog(AuditAction.DOCUMENT_METADATA_ADDED, 'metadata'),
    addDocumentMetadata
  )

router
  .route('/:documentId/metadata/:metadataFieldId')
  .patch(
    requireAuth,
    requirePermission({
      resource: RESOURCES.DOCUMENT_METADATA,
      action: ACTIONS.UPDATE,
      scope: SCOPES.ALL,
    }),
    auditLog(AuditAction.DOCUMENT_METADATA_UPDATED, 'metadata'),
    updateDocumentMetadata
  )
  .delete(
    requireAuth,
    requirePermission({
      resource: RESOURCES.DOCUMENT_METADATA,
      action: ACTIONS.DELETE,
      scope: SCOPES.ALL,
    }),
    auditLog(AuditAction.DOCUMENT_METADATA_UPDATED, 'metadata'),
    removeDocumentMetadata
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
    auditLog(AuditAction.DOCUMENT_SHARED, 'share'),
    shareDocument
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
    auditLog(AuditAction.DOCUMENT_SHARE_REMOVED, 'share'),
    removeShare
  );

// Comment routes
router
  .route('/:documentId/comments')
  .get(
    requireAuth,
    requirePermission({
      resource: RESOURCES.COMMENT,
      action: ACTIONS.READ,
      scope: SCOPES.ALL,
    }),
    getDocumentComments
  )
  .post(
    requireAuth,
    requirePermission({
      resource: RESOURCES.COMMENT,
      action: ACTIONS.CREATE,
      scope: SCOPES.OWN,
    }),
    auditLog(AuditAction.COMMENT_ADDED, "comment"),
    addDocumentComment
  );

router
  .route("/:documentId/comments/:commentId")
  .patch(requireAuth,
    requirePermission({
      resource: RESOURCES.COMMENT,
      action: ACTIONS.UPDATE,
      scope: SCOPES.OWN
    }),
    auditLog(AuditAction.COMMENT_UPDATED, "comment"),
    updateComment
  )
  .delete(requireAuth,
    requirePermission({
      resource: RESOURCES.COMMENT,
      action: ACTIONS.DELETE,
      scope: SCOPES.OWN
    }),
    auditLog(AuditAction.COMMENT_DELETED, "comment"),
    deleteComment
  );

// Document versions routes
router
  .route('/:documentId/versions')
  .get(
    requireAuth,
    requirePermission({ resource: RESOURCES.DOCUMENT, action: ACTIONS.READ, scope: SCOPES.OWN }),
    getDocumentVersions
  )
  .post(
    requireAuth,
    requirePermission({ resource: RESOURCES.DOCUMENT, action: ACTIONS.UPLOAD, scope: SCOPES.OWN }),
    uploadSingleDocument,
    auditLog(AuditAction.DOCUMENT_VERSION_CREATED, 'version'),
    createDocumentVersion
  );

router
  .route('/:documentId/versions/:versionId')
  .get(
    requireAuth,
    requirePermission({ resource: RESOURCES.DOCUMENT, action: ACTIONS.READ, scope: SCOPES.OWN }),
    getDocumentVersionById
  );

router
  .route('/:documentId/versions/:versionId/restore')
  .patch(
    requireAuth,
    requirePermission({ resource: RESOURCES.DOCUMENT, action: ACTIONS.UPDATE, scope: SCOPES.OWN }),
    auditLog(AuditAction.DOCUMENT_VERSION_RESTORED, 'version'),
    restoreDocumentVersion
  );

export default router;
