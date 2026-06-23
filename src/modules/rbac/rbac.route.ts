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
    createRole,
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
    updateRole,
  )
  .delete(
    requireAuth,
    requirePermission({ resource: RESOURCES.ROLE, action: ACTIONS.DELETE, scope: SCOPES.ALL }),
    deleteRole,
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
    addPermissionToRole,
  );

router
  .route('/roles/:roleId/permissions/:permissionId')
  .delete(
    requireAuth,
    requirePermission({ resource: RESOURCES.ROLE_PERMISSION, action: ACTIONS.REMOVE, scope: SCOPES.ALL }),
    removePermissionFromRole,
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
    createPermission,
  );

router
  .route('/permissions/:permissionId')
  .patch(
    requireAuth,
    requirePermission({ resource: RESOURCES.PERMISSION, action: ACTIONS.UPDATE, scope: SCOPES.ALL }),
    updatePermission,
  )
  .delete(
    requireAuth,
    requirePermission({ resource: RESOURCES.PERMISSION, action: ACTIONS.DELETE, scope: SCOPES.ALL }),
    deletePermission,
  );

export default router;