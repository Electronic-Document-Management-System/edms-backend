import { Router } from 'express';
import { requirePermission } from '../../middlewares/rbac.middleware';
import { requireAuth } from '../../middlewares/auth.middleware';
import {
  createNewDepartment,
  deleteDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartment,
} from './department.controller';
import { ACTIONS, RESOURCES, SCOPES } from '../../constants';

const router = Router();

// GET    /api/tenant/departments
// GET    /api/tenant/departments/:id
// POST   /api/tenant/departments
// PATCH  /api/tenant/departments/:id
// DELETE /api/tenant/departments/:id

router
  .route('/')
  .get(
    requireAuth,
    requirePermission({
      resource: RESOURCES.DEPARTMENT,
      action: ACTIONS.READ,
      scope: SCOPES.ALL,
    }),
    getAllDepartments,
  )
  .post(
    requireAuth,
    requirePermission({
      resource: RESOURCES.DEPARTMENT,
      action: ACTIONS.CREATE,
      scope: SCOPES.ALL,
    }),
    createNewDepartment,
  );

router
  .route('/:id')
  .get(
    requireAuth,
    requirePermission({
      resource: RESOURCES.DEPARTMENT,
      action: ACTIONS.READ,
      scope: SCOPES.ALL,
    }),
    getDepartmentById,
  )
  .patch(
    requireAuth,
    requirePermission({
      resource: RESOURCES.DEPARTMENT,
      action: ACTIONS.UPDATE,
      scope: SCOPES.ALL,
    }),
    updateDepartment,
  )
  .delete(
    requireAuth,
    requirePermission({
      resource: RESOURCES.DEPARTMENT,
      action: ACTIONS.DELETE,
      scope: SCOPES.ALL,
    }),
    deleteDepartment,
  );

export default router;
