# RBAC Permission Matrix

## Overview

This document defines the initial Role-Based Access Control (RBAC) permission matrix for the EDMS backend.

The RBAC system follows a permission-based authorization model using the following format:

```text
resource:action:scope
```

Example:

```text
document:read:own
document:approve:department
role:assign:all
```

## Scope Definitions

| Scope      | Description                                                          |
| ---------- | -------------------------------------------------------------------- |
| own        | Access is limited to resources created or owned by the current user. |
| department | Access is limited to resources within the user's department.         |
| assigned   | Access is limited to resources specifically assigned to the user.    |
| shared     | Access is limited to resources shared with the user.                 |
| all        | Access is available across the complete system.                      |

## Roles

The initial system roles are:

- Admin
- Employee
- Manager
- Reviewer
- Auditor
- External User

## Admin Permissions

```text
role:create:all
role:assign:all
permission:create:all
permission:assign:all

user:create:all
user:update:all
user:delete:all

department:create:all
department:update:all
department:delete:all

folder:create:all
folder:update:all
folder:delete:all
folder:move:all

document:upload:all
document:read:all
document:update:all
document:delete:all
document:share:all
document:download:all
document:archive:all
document:restore:all

metadataField:create:all
metadataField:update:all
metadataField:delete:all

documentMetadata:create:all
documentMetadata:update:all
documentMetadata:delete:all

notification:read:own
```

## Employee Permissions

```text
document:upload:own
document:read:own
document:read:department
document:share:own
document:download:own
document:delete:own

documentMetadata:create:own
documentMetadata:update:own

notification:read:own
```

## Manager Permissions

```text
document:upload:own
document:read:own
document:read:department
document:download:department
document:delete:department
document:approve:department
document:reject:department
document:archive:department

documentMetadata:create:own
documentMetadata:update:own

workflow:assign:department

notification:read:own
```

## Reviewer Permissions

```text
document:read:assigned
document:download:assigned
document:approve:assigned
document:reject:assigned

comment:create:assigned

notification:read:own
```

## Auditor Permissions

```text
document:read:all
document:download:all

auditLog:read:all

report:generate:all
```

## External User Permissions

```text
document:read:shared
document:download:shared
```

## Notes

- Roles must not be hardcoded in business logic.
- Authorization should be based on permissions, not role names.
- Permissions should be seeded into the database and mapped to roles through the `role_permissions` relation.
- Future permissions can be added without changing the authorization middleware structure.


