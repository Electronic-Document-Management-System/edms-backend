// // USERS
// GET    /api/tenant/users
// GET    /api/tenant/users/:id
// POST   /api/tenant/users
// PATCH  /api/tenant/users/:id 
// PATCH  /api/tenant/users/:id/disable
// PATCH  /api/tenant/users/:id/activate
// POST   /api/tenant/users/:id/roles

import { Router } from 'express';
import { requireAuth } from '@/middlewares/auth.middleware';
import {
  createNewUser,
  getAllUsers,
  getUserById,
  updateUserById,
  disableUser,
  activateUser,
  assignRoleToUser,
  removeRoleFromUser,
} from './users.controller';
import { requirePermission } from '@/middlewares/rbac.middleware';
import { ACTIONS, RESOURCES, SCOPES } from '@/constants';
import { getUserRoles } from '../rbac/rbac.controller';

const router = Router();

router
  .route('/')
  .get(requireAuth, requirePermission({ resource: RESOURCES.USER, action: ACTIONS.READ, scope: SCOPES.ALL }), getAllUsers)
  .post(requireAuth, requirePermission({ resource: RESOURCES.USER, action: ACTIONS.CREATE, scope: SCOPES.ALL }), createNewUser);

router
  .route('/:userId')
  .get(requireAuth, requirePermission({ resource: RESOURCES.USER, action: ACTIONS.READ, scope: SCOPES.ALL }), getUserById)
  .patch(requireAuth, requirePermission({ resource: RESOURCES.USER, action: ACTIONS.UPDATE, scope: SCOPES.ALL }), updateUserById);

router
  .route("/:userId/disable")
  .patch(requireAuth, requirePermission({ resource: RESOURCES.USER, action: ACTIONS.DISABLE, scope: SCOPES.ALL }), disableUser)

router
  .route("/:userId/activate")
  .patch(requireAuth, requirePermission({ resource: RESOURCES.USER, action: ACTIONS.ACTIVATE, scope: SCOPES.ALL }), activateUser)

router
  .route("/:userId/roles")
  .post(requireAuth, requirePermission({ resource: RESOURCES.ROLE, action: ACTIONS.ASSIGN, scope: SCOPES.ALL }), assignRoleToUser);

router
  .route("/:userId/roles/:roleId")
  .delete(requireAuth, requirePermission({ resource: RESOURCES.USER_ROLE, action: ACTIONS.REMOVE, scope: SCOPES.ALL }), removeRoleFromUser);

  
router
  .route('/:userId/roles')
  .get(
    requireAuth,
    requirePermission({ resource: RESOURCES.ROLE, action: ACTIONS.READ, scope: SCOPES.ALL }),
    getUserRoles,
  );
export default router;
