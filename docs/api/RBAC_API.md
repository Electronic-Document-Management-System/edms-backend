# RBAC API

## Overview

This document describes the Role-Based Access Control APIs for the EDMS backend.

The RBAC module is responsible for managing:

- Roles
- Permissions
- Role-permission mapping

User-role assignment is handled in the Users API because it is directly related to user management.

## Base URL

```txt
/api/v1/tenant/rbac
````

## Permission Format

The system uses permission-based authorization with the following format:

```txt
resource:action:scope
```

Example:

```txt
role:create:all
permission:read:all
rolePermission:assign:all
```

---

## Endpoints

### Roles

| Method | Endpoint       | Permission        | Purpose                 |
| ------ | -------------- | ----------------- | ----------------------- |
| GET    | `/roles`       | `role:read:all`   | Retrieve all roles      |
| GET    | `/roles/:roleId` | `role:read:all`   | Retrieve a role by ID   |
| POST   | `/roles`       | `role:create:all` | Create a new role       |
| PATCH  | `/roles/:roleId` | `role:update:all` | Update an existing role |
| DELETE | `/roles/:roleId` | `role:delete:all` | Delete an existing role |

### Permissions

| Method | Endpoint           | Permission              | Purpose                       |
| ------ | ------------------ | ----------------------- | ----------------------------- |
| GET    | `/permissions`     | `permission:read:all`   | Retrieve all permissions      |
| POST   | `/permissions`     | `permission:create:all` | Create a new permission       |
| PATCH  | `/permissions/:id` | `permission:update:all` | Update an existing permission |
| DELETE | `/permissions/:id` | `permission:delete:all` | Delete an existing permission |

### Role Permissions

| Method | Endpoint                               | Permission                  | Purpose                                 |
| ------ | -------------------------------------- | --------------------------- | --------------------------------------- |
| GET    | `/roles/:roleId/permissions`           | `role:read:all`             | Retrieve permissions assigned to a role |
| POST   | `/roles/:id/permissions`               | `rolePermission:assign:all` | Assign a permission to a role           |
| DELETE | `/roles/:id/permissions/:permissionId` | `rolePermission:delete:all` | Remove a permission from a role         |

### User Roles

| Method | Endpoint              | Permission        | Purpose                          |
| ------ | --------------------- | ----------------- | -------------------------------- |
| GET    | `/users/:userId/roles` | `role:read:all`   | Retrieve roles assigned to a user |

---

# Role APIs

## Get All Roles

### Endpoint

```txt
GET /api/v1/tenant/rbac/roles
```

### Purpose

Retrieves all roles available in the RBAC system.

### Auth Required

Yes

### Required Permission

```txt
role:read:all
```

### Success Response

```json
{
  "statusCode": 200,
  "data": {
    "roles": [
      {
        "id": 1,
        "name": "Admin"
      },
      {
        "id": 2,
        "name": "Manager"
      }
    ]
  },
  "message": "All roles retrieved successfully",
  "success": true
}
```

---

## Get Role By ID

### Endpoint

```txt
GET /api/v1/tenant/rbac/roles/:roleId
```

### Purpose

Retrieves a specific role by its ID.

### Auth Required

Yes

### Required Permission

```txt
role:read:all
```

### Success Response

```json
{
  "statusCode": 200,
  "data": {
    "role": {
      "id": 1,
      "name": "Admin"
    }
  },
  "message": "Role retrieved successfully",
  "success": true
}
```

---

## Create Role

### Endpoint

```txt
POST /api/v1/tenant/rbac/roles
```

### Purpose

Creates a new role in the RBAC system.

### Auth Required

Yes

### Required Permission

```txt
role:create:all
```

### Request Body

```json
{
  "name": "Reviewer"
}
```

### Success Response

```json
{
  "statusCode": 201,
  "data": {
    "role": {
      "id": 3,
      "name": "Reviewer"
    }
  },
  "message": "Role created successfully",
  "success": true
}
```

---

## Update Role

### Endpoint

```txt
PATCH /api/v1/tenant/rbac/roles/:roleId
```

### Purpose

Updates an existing role by its ID.

### Auth Required

Yes

### Required Permission

```txt
role:update:all
```

### Request Body

```json
{
  "name": "Senior Reviewer"
}
```

### Success Response

```json
{
  "statusCode": 200,
  "data": {
    "role": {
      "id": 3,
      "name": "Senior Reviewer"
    }
  },
  "message": "Role updated successfully",
  "success": true
}
```

---

## Delete Role

### Endpoint

```txt
DELETE /api/v1/tenant/rbac/roles/:roleId
```

### Purpose

Deletes an existing role by its ID.

### Auth Required

Yes

### Required Permission

```txt
role:delete:all
```

### Success Response

```json
{
  "statusCode": 200,
  "data": {
    "role": {
      "id": 3,
      "name": "Senior Reviewer"
    }
  },
  "message": "Role deleted successfully",
  "success": true
}
```

---

# Permission APIs

## Get All Permissions

### Endpoint

```txt
GET /api/v1/tenant/rbac/permissions
```

### Purpose

Retrieves all permissions available in the RBAC system.

### Auth Required

Yes

### Required Permission

```txt
permission:read:all
```

### Success Response

```json
{
  "statusCode": 200,
  "data": {
    "permissions": [
      {
        "id": 1,
        "resource": "document",
        "action": "read",
        "scope": "own"
      },
      {
        "id": 2,
        "resource": "document",
        "action": "approve",
        "scope": "department"
      }
    ]
  },
  "message": "All permissions retrieved successfully",
  "success": true
}
```

---

## Create Permission

### Endpoint

```txt
POST /api/v1/tenant/rbac/permissions
```

### Purpose

Creates a new permission using resource, action, and scope.

### Auth Required

Yes

### Required Permission

```txt
permission:create:all
```

### Request Body

```json
{
  "resource": "document",
  "action": "archive",
  "scope": "department"
}
```

### Success Response

```json
{
  "statusCode": 201,
  "data": {
    "permission": {
      "id": 10,
      "resource": "document",
      "action": "archive",
      "scope": "department"
    }
  },
  "message": "Permission created successfully",
  "success": true
}
```

---

## Update Permission

### Endpoint

```txt
PATCH /api/v1/tenant/rbac/permissions/:id
```

### Purpose

Updates an existing permission by its ID.

### Auth Required

Yes

### Required Permission

```txt
permission:update:all
```

### Request Body

```json
{
  "resource": "document",
  "action": "archive",
  "scope": "all"
}
```

### Success Response

```json
{
  "statusCode": 200,
  "data": {
    "permission": {
      "id": 10,
      "resource": "document",
      "action": "archive",
      "scope": "all"
    }
  },
  "message": "Permission updated successfully",
  "success": true
}
```

---

## Delete Permission

### Endpoint

```txt
DELETE /api/v1/tenant/rbac/permissions/:id
```

### Purpose

Deletes an existing permission by its ID.

### Auth Required

Yes

### Required Permission

```txt
permission:delete:all
```

### Success Response

```json
{
  "statusCode": 200,
  "data": {
    "permission": {
      "id": 10,
      "resource": "document",
      "action": "archive",
      "scope": "all"
    }
  },
  "message": "Permission deleted successfully",
  "success": true
}
```

---

# Role Permission APIs

## Get Role Permissions

### Endpoint

```txt
GET /api/v1/tenant/rbac/roles/:roleId/permissions
```

### Purpose

Retrieves all permissions assigned to a specific role.

### Auth Required

Yes

### Required Permission

```txt
role:read:all
```

### Success Response

```json
{
  "statusCode": 200,
  "data": {
    "rolePermissions": {
      "id": 1,
      "name": "Manager",
      "rolePermissions": [
        {
          "permission": {
            "id": 2,
            "resource": "document",
            "action": "approve",
            "scope": "department"
          }
        }
      ]
    }
  },
  "message": "Role permissions retrieved successfully",
  "success": true
}
```

---

## Assign Permission To Role

### Endpoint

```txt
POST /api/v1/tenant/rbac/roles/:id/permissions
```

### Purpose

Assigns a permission to a specific role.

### Auth Required

Yes

### Required Permission

```txt
rolePermission:assign:all
```

### Request Body

```json
{
  "permissionId": 2
}
```

### Success Response

```json
{
  "statusCode": 201,
  "data": {
    "rolePermission": {
      "role_id": 1,
      "permission_id": 2
    }
  },
  "message": "Permission assigned to role successfully",
  "success": true
}
```

---

## Remove Permission From Role

### Endpoint

```txt
DELETE /api/v1/tenant/rbac/roles/:id/permissions/:permissionId
```

### Purpose

Removes a permission from a specific role.

### Auth Required

Yes

### Required Permission

```txt
rolePermission:delete:all
```

### Success Response

```json
{
  "statusCode": 200,
  "data": {
    "rolePermission": {
      "role_id": 1,
      "permission_id": 2
    }
  },
  "message": "Permission removed from role successfully",
  "success": true
}
```

---

## Get User Roles

### Endpoint

```txt
GET /api/v1/tenant/rbac/users/:userId/roles
```

### Purpose

Retrieves all roles assigned to a specific user.

### Auth Required

Yes

### Required Permission

```txt
role:read:all
```

### Success Response

```json
{
  "statusCode": 200,
  "data": {
    "userRoles": [
      {
        "id": 1,
        "name": "Admin"
      }
    ]
  },
  "message": "User roles retrieved successfully",
  "success": true
}
```

---

# Error Cases

| Status Code | Reason                                      |
| ----------- | ------------------------------------------- |
| 400         | Invalid ID or missing required data         |
| 401         | Missing or invalid access token             |
| 403         | User does not have required permission      |
| 404         | Role, permission, or mapping not found      |
| 409         | Role, permission, or mapping already exists |
| 500         | Internal server error                       |

---

# Notes

* RBAC permissions are based on `resource`, `action`, and `scope`.
* Roles should not be hardcoded in business logic.
* Role-permission mappings are stored in the `RolePermission` junction table.
* User-role assignment is documented in the Users API.
* Backend permission middleware is the final authority for authorization.
