import { prisma } from '../src/config/db.config';
import logger from '../src/logger/winston.logger';

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
  { resource: 'permission', action: 'create', scope: 'all' },
  { resource: 'permission', action: 'assign', scope: 'all' },

  // User management
  { resource: 'user', action: 'create', scope: 'all' },
  { resource: 'user', action: 'update', scope: 'all' },
  { resource: 'user', action: 'delete', scope: 'all' },

  // Department management
  { resource: 'department', action: 'create', scope: 'all' },
  { resource: 'department', action: 'update', scope: 'all' },
  { resource: 'department', action: 'delete', scope: 'all' },

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
  { resource: 'document', action: 'archive', scope: 'department' },
  { resource: 'document', action: 'archive', scope: 'all' },
  { resource: 'document', action: 'restore', scope: 'all' },

  // Metadata
  { resource: 'metadataField', action: 'create', scope: 'all' },
  { resource: 'metadataField', action: 'update', scope: 'all' },
  { resource: 'metadataField', action: 'delete', scope: 'all' },

  { resource: 'documentMetadata', action: 'create', scope: 'own' },
  { resource: 'documentMetadata', action: 'create', scope: 'all' },
  { resource: 'documentMetadata', action: 'update', scope: 'own' },
  { resource: 'documentMetadata', action: 'update', scope: 'all' },
  { resource: 'documentMetadata', action: 'delete', scope: 'all' },

  // Workflow / Comments / Audit / Reports
  { resource: 'workflow', action: 'assign', scope: 'department' },
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
    'permission:create:all',
    'permission:assign:all',
    'user:create:all',
    'user:update:all',
    'user:delete:all',
    'department:create:all',
    'department:update:all',
    'department:delete:all',
    'document:upload:all',
    'document:read:all',
    'document:update:all',
    'document:delete:all',
    'document:share:all',
    'document:download:all',
    'document:archive:all',
    'document:restore:all',
    'metadataField:create:all',
    'metadataField:update:all',
    'metadataField:delete:all',
    'documentMetadata:create:all',
    'documentMetadata:update:all',
    'documentMetadata:delete:all',
    'notification:read:own',
  ],

  Employee: [
    'document:upload:own',
    'document:read:own',
    'document:read:department',
    'document:share:own',
    'document:download:own',
    'document:delete:own',
    'documentMetadata:create:own',
    'documentMetadata:update:own',
    'notification:read:own',
  ],

  Manager: [
    'document:upload:own',
    'document:read:own',
    'document:read:department',
    'document:download:department',
    'document:delete:department',
    'document:approve:department',
    'document:reject:department',
    'document:archive:department',
    'documentMetadata:create:own',
    'documentMetadata:update:own',
    'workflow:assign:department',
    'notification:read:own',
  ],

  Reviewer: [
    'document:read:assigned',
    'document:download:assigned',
    'document:approve:assigned',
    'document:reject:assigned',
    'comment:create:assigned',
    'notification:read:own',
  ],

  Auditor: [
    'document:read:all',
    'document:download:all',
    'auditLog:read:all',
    'report:generate:all',
  ],

  'External User': ['document:read:shared', 'document:download:shared'],
};

function createPermissionKey(permission: {
  resource: string;
  action: string;
  scope: string;
}) {
  return `${permission.resource}:${permission.action}:${permission.scope}`;
}

async function main() {
  logger.info('🌱 RBAC seed started...');

  // 1. Create permissions
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

  // 2. Create roles
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

  // 3. Assign permissions to roles
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
  logger.info('🎉 RBAC seed completed successfully');
}

main()
  .catch((error) => {
    logger.error('❌ RBAC seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
