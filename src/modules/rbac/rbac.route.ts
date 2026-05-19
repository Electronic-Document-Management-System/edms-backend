import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth.middleware';
import {
  getAllPermissions,
  getAllRoles,
  getRoleById,
  getRolePermissions,
  getUserRoles,
} from './rbac.controller';
import {
  requireAnyPermission,
  requirePermission,
} from '../../middlewares/rbac.middleware';
import { ACTIONS, RESOURCES, SCOPES } from '../../constants';

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

export default router;
