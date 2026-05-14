
# Database Design

## Overview

The EDMS backend uses PostgreSQL as the primary relational database.

PostgreSQL is selected because the system requires strong relational integrity, structured data modeling, and reliable support for authorization, workflows, document metadata, and audit logs.

## ORM

Prisma is used as the database ORM.

Prisma provides:

- Type-safe database access
- Schema-based database modeling
- Migration management
- Cleaner database queries in TypeScript

## RBAC Data Model

The RBAC system is based on the following core entities:

```text
User
Role
Permission
UserRole
RolePermission
````

## Relationship Overview

```text
User → UserRole → Role
Role → RolePermission → Permission
```

## Permission Model

Permissions are represented using:

```text
resource
action
scope
```

Example:

```text
resource: document
action: approve
scope: department
```

This represents:

```text
document:approve:department
```

## Design Notes

* Users can have multiple roles.
* Roles can have multiple permissions.
* Permissions are not tied to specific role names.
* This makes the authorization system dynamic and extensible.