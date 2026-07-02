import { Router } from 'express';
import { requireAuth } from '@/middlewares/auth.middleware';
import {
  addPermissionToRole,
  createPermission,
  createRole,
  deletePermission,
  deleteRole,
  getAllPermissions,
  getAllRoles,
  getRoleById,
  getRoleImpact,
  getRolePermissions,
  removePermissionFromRole,
  updatePermission,
  updateRole,
} from './rbac.controller';
import { requirePermission } from '@/middlewares/rbac.middleware';
import { ACTIONS, RESOURCES, SCOPES } from '@/constants';
import { auditLog } from '@/middlewares/audit.middleware';
import { AuditAction } from '@prisma/client';

const router = Router();

router
  .route('/roles')
  .get(
    requireAuth,
    requirePermission({ resource: RESOURCES.ROLE, action: ACTIONS.READ, scope: SCOPES.ALL }),
    getAllRoles,
  )
  .post(
    requireAuth,
    requirePermission({ resource: RESOURCES.ROLE, action: ACTIONS.CREATE, scope: SCOPES.ALL }),
    auditLog(AuditAction.ROLE_CREATED, 'role'),
    createRole
  );

router
  .route('/roles/:roleId/impact')
  .get(
    requireAuth,
    requirePermission({ resource: RESOURCES.ROLE, action: ACTIONS.READ, scope: SCOPES.ALL }),
    getRoleImpact,
  );

router
  .route('/roles/:roleId')
  .get(
    requireAuth,
    requirePermission({ resource: RESOURCES.ROLE, action: ACTIONS.READ, scope: SCOPES.ALL }),
    getRoleById,
  )
  .patch(
    requireAuth,
    requirePermission({ resource: RESOURCES.ROLE, action: ACTIONS.UPDATE, scope: SCOPES.ALL }),
    auditLog(AuditAction.ROLE_UPDATED, 'role'),
    updateRole
  )
  .delete(
    requireAuth,
    requirePermission({ resource: RESOURCES.ROLE, action: ACTIONS.DELETE, scope: SCOPES.ALL }),
    auditLog(AuditAction.ROLE_DELETED, 'role'),
    deleteRole
  );


router
  .route('/roles/:roleId/permissions')
  .get(
    requireAuth,
    requirePermission({ resource: RESOURCES.ROLE, action: ACTIONS.READ, scope: SCOPES.ALL }),
    getRolePermissions,
  )
  .post(
    requireAuth,
    requirePermission({ resource: RESOURCES.ROLE_PERMISSION, action: ACTIONS.ASSIGN, scope: SCOPES.ALL }),
    auditLog(AuditAction.PERMISSION_ASSIGNED_TO_ROLE, 'permission'),
    addPermissionToRole
  );

router
  .route('/roles/:roleId/permissions/:permissionId')
  .delete(
    requireAuth,
    requirePermission({ resource: RESOURCES.ROLE_PERMISSION, action: ACTIONS.REMOVE, scope: SCOPES.ALL }),
    auditLog(AuditAction.PERMISSION_REMOVED_FROM_ROLE, 'permission'),
    removePermissionFromRole
  );

router
  .route('/permissions')
  .get(
    requireAuth,
    requirePermission({ resource: RESOURCES.PERMISSION, action: ACTIONS.READ, scope: SCOPES.ALL }),
    getAllPermissions,
  )
  .post(
    requireAuth,
    requirePermission({ resource: RESOURCES.PERMISSION, action: ACTIONS.CREATE, scope: SCOPES.ALL }),
    auditLog(AuditAction.PERMISSION_CREATED, 'permission'),
    createPermission
  );

router
  .route('/permissions/:permissionId')
  .patch(
    requireAuth,
    requirePermission({ resource: RESOURCES.PERMISSION, action: ACTIONS.UPDATE, scope: SCOPES.ALL }),
    auditLog(AuditAction.PERMISSION_UPDATED, 'permission'),
    updatePermission
  )
  .delete(
    requireAuth,
    requirePermission({ resource: RESOURCES.PERMISSION, action: ACTIONS.DELETE, scope: SCOPES.ALL }),
    auditLog(AuditAction.PERMISSION_DELETED, 'permission'),
    deletePermission
  );

export default router;