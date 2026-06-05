import { prisma } from '../src/config/db.config';
import logger from '../src/logger/winston.logger';
import bcrypt from 'bcrypt';

const ADMIN_EMAIL = 'admin@edms.com';
const ADMIN_PASSWORD = 'Admin@123';

const roles = [
  'Admin',
  'Employee',
  'Manager',
  'Reviewer',
  'Auditor',
  'External User',
];

const permissions = [
  // Role / Permission management
  { resource: 'role', action: 'create', scope: 'all' },
  { resource: 'role', action: 'assign', scope: 'all' },
  { resource: 'role', action: 'read', scope: 'all' },
  { resource: 'role', action: 'update', scope: 'all' },
  { resource: 'role', action: 'delete', scope: 'all' },

  { resource: 'permission', action: 'create', scope: 'all' },
  { resource: 'permission', action: 'assign', scope: 'all' },
  { resource: 'permission', action: 'read', scope: 'all' },
  { resource: 'permission', action: 'update', scope: 'all' },
  { resource: 'permission', action: 'delete', scope: 'all' },

  { resource: 'rolePermission', action: 'assign', scope: 'all' },
  { resource: 'rolePermission', action: 'remove', scope: 'all' },

  { resource: 'userRole', action: 'assign', scope: 'all' },
  { resource: 'userRole', action: 'remove', scope: 'all' },
  { resource: 'userRole', action: 'read', scope: 'all' },

  // User management
  { resource: 'user', action: 'create', scope: 'all' },
  { resource: 'user', action: 'read', scope: 'all' },
  { resource: 'user', action: 'update', scope: 'all' },
  { resource: 'user', action: 'delete', scope: 'all' },
  { resource: 'user', action: 'disable', scope: 'all' },
  { resource: 'user', action: 'activate', scope: 'all' },

  // Department management
  { resource: 'department', action: 'create', scope: 'all' },
  { resource: 'department', action: 'read', scope: 'all' },
  { resource: 'department', action: 'update', scope: 'all' },
  { resource: 'department', action: 'delete', scope: 'all' },

  // Folder management
  { resource: 'folder', action: 'create', scope: 'all' },
  { resource: 'folder', action: 'read', scope: 'all' },
  { resource: 'folder', action: 'update', scope: 'all' },
  { resource: 'folder', action: 'delete', scope: 'all' },
  { resource: 'folder', action: 'move', scope: 'all' },

  // Document management
  { resource: 'document', action: 'upload', scope: 'own' },
  { resource: 'document', action: 'upload', scope: 'all' },

  { resource: 'document', action: 'read', scope: 'own' },
  { resource: 'document', action: 'read', scope: 'department' },
  { resource: 'document', action: 'read', scope: 'assigned' },
  { resource: 'document', action: 'read', scope: 'shared' },
  { resource: 'document', action: 'read', scope: 'all' },

  { resource: 'document', action: 'download', scope: 'own' },
  { resource: 'document', action: 'download', scope: 'department' },
  { resource: 'document', action: 'download', scope: 'assigned' },
  { resource: 'document', action: 'download', scope: 'shared' },
  { resource: 'document', action: 'download', scope: 'all' },

  { resource: 'document', action: 'update', scope: 'own' },
  { resource: 'document', action: 'update', scope: 'department' },
  { resource: 'document', action: 'update', scope: 'all' },

  { resource: 'document', action: 'delete', scope: 'own' },
  { resource: 'document', action: 'delete', scope: 'department' },
  { resource: 'document', action: 'delete', scope: 'all' },

  { resource: 'document', action: 'share', scope: 'own' },
  { resource: 'document', action: 'share', scope: 'all' },

  { resource: 'document', action: 'approve', scope: 'department' },
  { resource: 'document', action: 'approve', scope: 'assigned' },

  { resource: 'document', action: 'reject', scope: 'department' },
  { resource: 'document', action: 'reject', scope: 'assigned' },

  { resource: 'document', action: 'archive', scope: 'own' },
  { resource: 'document', action: 'archive', scope: 'department' },
  { resource: 'document', action: 'archive', scope: 'all' },

  { resource: 'document', action: 'restore', scope: 'own' },
  { resource: 'document', action: 'restore', scope: 'department' },
  { resource: 'document', action: 'restore', scope: 'all' },

  // Metadata
  { resource: 'metadataField', action: 'create', scope: 'all' },
  { resource: 'metadataField', action: 'read', scope: 'all' },
  { resource: 'metadataField', action: 'update', scope: 'all' },
  { resource: 'metadataField', action: 'delete', scope: 'all' },

  { resource: 'documentMetadata', action: 'create', scope: 'own' },
  { resource: 'documentMetadata', action: 'create', scope: 'all' },
  { resource: 'documentMetadata', action: 'read', scope: 'own' },
  { resource: 'documentMetadata', action: 'read', scope: 'all' },
  { resource: 'documentMetadata', action: 'update', scope: 'own' },
  { resource: 'documentMetadata', action: 'update', scope: 'all' },
  { resource: 'documentMetadata', action: 'delete', scope: 'all' },

  { resource: 'documentShare', action: 'create', scope: 'all' },
  { resource: 'documentShare', action: 'read', scope: 'all' },
  { resource: 'documentShare', action: 'update', scope: 'all' },
  { resource: 'documentShare', action: 'delete', scope: 'all' },

  // Workflow / Comments / Audit / Reports
  { resource: 'workflow', action: 'assign', scope: 'department' },

  // Workflow
  { resource: 'workflow', action: 'submit', scope: 'own' },
  { resource: 'workflow', action: 'submit', scope: 'department' },
  { resource: 'workflow', action: 'submit', scope: 'all' },

  { resource: 'workflow', action: 'assign', scope: 'department' },
  { resource: 'workflow', action: 'assign', scope: 'all' },

  { resource: 'workflow', action: 'approve', scope: 'assigned' },
  { resource: 'workflow', action: 'approve', scope: 'department' },
  { resource: 'workflow', action: 'approve', scope: 'all' },

  { resource: 'workflow', action: 'reject', scope: 'assigned' },
  { resource: 'workflow', action: 'reject', scope: 'department' },
  { resource: 'workflow', action: 'reject', scope: 'all' },

  { resource: 'workflow', action: 'read', scope: 'own' },
  { resource: 'workflow', action: 'read', scope: 'assigned' },
  { resource: 'workflow', action: 'read', scope: 'department' },
  { resource: 'workflow', action: 'read', scope: 'all' },

  { resource: 'workflow', action: 'cancel', scope: 'own' },
  { resource: 'workflow', action: 'cancel', scope: 'department' },
  { resource: 'workflow', action: 'cancel', scope: 'all' },

  { resource: 'comment', action: 'create', scope: 'assigned' },
  { resource: 'auditLog', action: 'read', scope: 'all' },
  { resource: 'report', action: 'generate', scope: 'all' },

  // Notifications
  { resource: 'notification', action: 'read', scope: 'own' },
];

const rolePermissions: Record<string, string[]> = {
  Admin: [
    'role:create:all',
    'role:assign:all',
    'role:read:all',
    'role:update:all',
    'role:delete:all',

    'permission:create:all',
    'permission:assign:all',
    'permission:read:all',
    'permission:update:all',
    'permission:delete:all',

    'rolePermission:assign:all',
    'rolePermission:remove:all',

    'userRole:assign:all',
    'userRole:remove:all',
    'userRole:read:all',

    'user:create:all',
    'user:read:all',
    'user:update:all',
    'user:delete:all',
    'user:disable:all',
    'user:activate:all',

    'department:create:all',
    'department:read:all',
    'department:update:all',
    'department:delete:all',

    'folder:create:all',
    'folder:read:all',
    'folder:update:all',
    'folder:delete:all',
    'folder:move:all',

    'document:upload:own',
    'document:upload:all',

    'document:read:own',
    'document:read:department',
    'document:read:assigned',
    'document:read:shared',
    'document:read:all',

    'document:update:own',
    'document:update:department',
    'document:update:all',

    'document:delete:own',
    'document:delete:department',
    'document:delete:all',

    'document:share:own',
    'document:share:all',

    'document:download:own',
    'document:download:department',
    'document:download:assigned',
    'document:download:shared',
    'document:download:all',

    'document:archive:own',
    'document:archive:department',
    'document:archive:all',

    'document:restore:own',
    'document:restore:department',
    'document:restore:all',

    'metadataField:create:all',
    'metadataField:read:all',
    'metadataField:update:all',
    'metadataField:delete:all',

    'documentMetadata:create:all',
    'documentMetadata:read:all',
    'documentMetadata:update:all',
    'documentMetadata:delete:all',

    'documentShare:create:own',
    'documentShare:create:department',
    'documentShare:create:all',

    'documentShare:read:own',
    'documentShare:read:shared',
    'documentShare:read:department',
    'documentShare:read:all',

    'documentShare:delete:own',
    'documentShare:delete:department',
    'documentShare:delete:all',

    'workflow:submit:own',
    'workflow:submit:department',
    'workflow:submit:all',

    'workflow:assign:department',
    'workflow:assign:all',

    'workflow:approve:assigned',
    'workflow:approve:department',
    'workflow:approve:all',

    'workflow:reject:assigned',
    'workflow:reject:department',
    'workflow:reject:all',

    'workflow:read:own',
    'workflow:read:assigned',
    'workflow:read:department',
    'workflow:read:all',

    'workflow:cancel:own',
    'workflow:cancel:department',
    'workflow:cancel:all',

    'notification:read:own',
  ],

  Employee: [
    'document:upload:own',

    'document:read:own',
    'document:read:department',

    'document:update:own',
    'document:delete:own',
    'document:archive:own',
    'document:restore:own',

    'document:share:own',
    'document:download:own',

    'documentMetadata:create:own',
    'documentMetadata:read:own',
    'documentMetadata:update:own',

    'documentShare:create:own',
    'documentShare:read:shared',
    'documentShare:delete:own',

    'workflow:submit:own',
    'workflow:read:own',
    'workflow:cancel:own',

    'notification:read:own',
  ],

  Manager: [
    'document:upload:own',

    'document:read:own',
    'document:read:department',

    'document:update:own',
    'document:update:department',

    'document:download:own',
    'document:download:department',

    'document:delete:own',
    'document:delete:department',

    'document:archive:own',
    'document:archive:department',

    'document:restore:own',
    'document:restore:department',

    'document:approve:department',
    'document:reject:department',

    'documentMetadata:create:own',
    'documentMetadata:read:own',
    'documentMetadata:update:own',

    'documentShare:create:own',
    'documentShare:create:department',

    'documentShare:read:shared',
    'documentShare:read:department',

    'documentShare:delete:own',
    'documentShare:delete:department',

    'workflow:submit:own',
    'workflow:submit:department',

    'workflow:assign:department',

    'workflow:read:own',
    'workflow:read:assigned',
    'workflow:read:department',

    'workflow:approve:assigned',
    'workflow:approve:department',

    'workflow:reject:assigned',
    'workflow:reject:department',

    'workflow:cancel:own',
    'workflow:cancel:department',
    'notification:read:own',
  ],

  Reviewer: [
    'document:read:assigned',
    'document:download:assigned',
    'document:approve:assigned',
    'document:reject:assigned',
    'comment:create:assigned',
    'notification:read:own',
    'documentShare:read:shared',
    'workflow:read:assigned',
    'workflow:approve:assigned',
    'workflow:reject:assigned',
  ],

  Auditor: [
    'document:read:all',
    'document:download:all',
    'auditLog:read:all',
    'report:generate:all',
    'documentShare:read:all',
    'workflow:read:all',
  ],

  'External User': ['document:read:shared', 'document:download:shared'],
};

async function main() {
  logger.info('🌱 RBAC seed started...');

  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: {
        resource_action_scope: {
          resource: permission.resource,
          action: permission.action,
          scope: permission.scope,
        },
      },
      update: {},
      create: permission,
    });
  }

  logger.info('✅ Permissions seeded');

  for (const roleName of roles) {
    await prisma.role.upsert({
      where: {
        name: roleName,
      },
      update: {},
      create: {
        name: roleName,
      },
    });
  }

  logger.info('✅ Roles seeded');

  for (const [roleName, permissionKeys] of Object.entries(rolePermissions)) {
    const role = await prisma.role.findUnique({
      where: {
        name: roleName,
      },
    });

    if (!role) continue;

    for (const permissionKey of permissionKeys) {
      const [resource, action, scope] = permissionKey.split(':');

      const permission = await prisma.permission.findUnique({
        where: {
          resource_action_scope: {
            resource,
            action,
            scope,
          },
        },
      });

      if (!permission) continue;

      await prisma.rolePermission.upsert({
        where: {
          role_id_permission_id: {
            role_id: role.id,
            permission_id: permission.id,
          },
        },
        update: {},
        create: {
          role_id: role.id,
          permission_id: permission.id,
        },
      });
    }
  }

  logger.info('✅ Role permissions mapped');

  const adminDepartment = await prisma.department.upsert({
    where: {
      name: 'Administration',
    },
    update: {},
    create: {
      name: 'Administration',
    },
  });

  const adminRole = await prisma.role.findUnique({
    where: {
      name: 'Admin',
    },
  });

  if (!adminRole) {
    throw new Error('Admin role not found. Please seed roles first.');
  }

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);

  const adminUser = await prisma.user.upsert({
    where: {
      email: ADMIN_EMAIL,
    },
    update: {
      name: 'System Admin',
      password_hash: passwordHash,
      dept_id: adminDepartment.id,
      isActive: true,
    },
    create: {
      name: 'System Admin',
      email: ADMIN_EMAIL,
      password_hash: passwordHash,
      dept_id: adminDepartment.id,
      isActive: true,
    },
  });

  await prisma.userRole.upsert({
    where: {
      user_id_role_id: {
        user_id: adminUser.id,
        role_id: adminRole.id,
      },
    },
    update: {},
    create: {
      user_id: adminUser.id,
      role_id: adminRole.id,
    },
  });

  logger.info(`✅ Admin user seeded: ${ADMIN_EMAIL}`);
  logger.info(`🔐 Admin password: ${ADMIN_PASSWORD}`);
  logger.info('🎉 Database seed completed successfully');
}

main()
  .catch((error) => {
    logger.error('❌ Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
