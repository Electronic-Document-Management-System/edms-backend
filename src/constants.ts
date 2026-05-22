export const RESOURCES = {
  ROLE_PERMISSION: 'rolePermission',
  USER_ROLE: 'userRole',
  DOCUMENT: 'document',
  USER: 'user',
  ROLE: 'role',
  PERMISSION: 'permission',
  AUDITLOG: 'auditLog',
  REPORT: 'report',
  NOTIFICATION: 'notification',
  WORKFLOW: 'workflow',
  COMMENT: 'comment',
  METADATA_FIELD: 'metadataField',
  DOCUMENT_METADATA: 'documentMetadata',
  DEPARTMENT: 'department',
  FOLDER: 'folder',
} as const;

export const ACTIONS = {
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
  APPROVE: 'approve',
  REJECT: 'reject',
  ASSIGN: 'assign',
  GENERATE: 'generate',
  ACTIVATE: 'activate',
  DISABLE: 'disable',
  REMOVE: 'remove',
} as const;

export const SCOPES = {
  OWN: 'own',
  ALL: 'all',
  SHARED: 'shared',
  ASSIGNED: 'assigned',
  DEPARTMENT: 'department',
} as const;
