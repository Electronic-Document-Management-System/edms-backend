import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth.middleware';
import {
  addPermissionToRole,
  createPermission,
  createRole,
  deletePermission,
  deleteRole,
  getAllPermissions,
  getAllRoles,
  getRoleById,
  getRolePermissions,
  getUserRoles,
  removePermissionFromRole,
  updatePermission,
  updateRole,
} from './rbac.controller';
import {
  requirePermission,
} from '../../middlewares/rbac.middleware';
import { ACTIONS, RESOURCES, SCOPES } from '../../constants';

// POST   /api/rbac/roles
// PATCH  /api/rbac/roles/:id
// DELETE /api/rbac/roles/:id

// POST   /api/rbac/permissions
// PATCH  /api/rbac/permissions/:id
// DELETE /api/rbac/permissions/:id

// POST   /api/rbac/roles/:id/permissions
// DELETE /api/rbac/roles/:id/permissions/:id


const router = Router();

router
  .route('/roles')
  .get(
    requireAuth,
    requirePermission({
      resource: RESOURCES.ROLE,
      action: ACTIONS.READ,
      scope: SCOPES.ALL,
    }),
    getAllRoles,
  );

router
  .route('/roles/:roleId')
  .get(
    requireAuth,
    requirePermission({
      resource: RESOURCES.ROLE,
      action: ACTIONS.READ,
      scope: SCOPES.ALL,
    }),
    getRoleById,
  );

router
  .route('/roles/:roleId/permissions')
  .get(
    requireAuth,
    requirePermission({
      resource: RESOURCES.ROLE,
      action: ACTIONS.READ,
      scope: SCOPES.ALL,
    }),
    getRolePermissions,
  );

router
  .route('/permissions')
  .get(
    requireAuth,
    requirePermission({
      resource: RESOURCES.PERMISSION,
      action: ACTIONS.READ,
      scope: SCOPES.ALL,
    }),
    getAllPermissions,
  );

router
  .route('/users/:userId/roles')
  .get(
    requireAuth,
    requirePermission({
      resource: RESOURCES.ROLE,
      action: ACTIONS.READ,
      scope: SCOPES.ALL,
    }),
    getUserRoles,
  );

router
  .route("/roles")
  .post(
    requireAuth,
    requirePermission({
      resource: RESOURCES.ROLE,
      action: ACTIONS.CREATE,
      scope: SCOPES.ALL
    }),
    createRole
  );

router
  .route("/roles/:roleId")
  .patch(
    requireAuth,
    requirePermission({
      resource: RESOURCES.ROLE,
      action: ACTIONS.UPDATE,
      scope: SCOPES.ALL
    }),
    updateRole
  ).delete(
    requireAuth,
    requirePermission({
      resource: RESOURCES.ROLE,
      action: ACTIONS.DELETE,
      scope: SCOPES.ALL
    }),
    deleteRole
  );


router
  .route("/permissions")
  .post(
    requireAuth,
    requirePermission({
      resource: RESOURCES.PERMISSION,
      action: ACTIONS.CREATE,
      scope: SCOPES.ALL
    }),
    createPermission
  );

router
  .route("/permissions/:id")
  .patch(
    requireAuth,
    requirePermission({
      resource: RESOURCES.PERMISSION,
      action: ACTIONS.UPDATE,
      scope: SCOPES.ALL
    }),
    updatePermission
  )
  .delete(
    requireAuth,
    requirePermission({
      resource: RESOURCES.PERMISSION,
      action: ACTIONS.DELETE,
      scope: SCOPES.ALL
    }),
    deletePermission
  );

router
  .route("/roles/:id/permissions")
  .post(
    requireAuth,
    requirePermission({
      resource: RESOURCES.ROLE_PERMISSION,
      action: ACTIONS.ASSIGN,
      scope: SCOPES.ALL
    }),
    addPermissionToRole
  );

router
  .route("/roles/:id/permissions/:id")
  .delete(
    requireAuth,
    requirePermission({
      resource: RESOURCES.ROLE_PERMISSION,
      action: ACTIONS.DELETE,
      scope: SCOPES.ALL
    }),
    removePermissionFromRole
  );

export default router;