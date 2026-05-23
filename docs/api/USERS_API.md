# Users API

## Overview

This document describes tenant user management APIs for the EDMS backend.

The Users module handles:

- User listing
- User details
- User creation
- User profile updates
- User activation / deactivation
- Role assignment and removal

## Base URL

```txt
/api/v1/tenant/users
```

---

## Endpoints

| Method | Endpoint             | Permission          | Purpose                          |
| ------ | -------------------- | ------------------- | -------------------------------- |
| GET    | `/`                  | `user:read:all`     | Retrieve all users               |
| GET    | `/:id`               | `user:read:all`     | Retrieve a user by ID            |
| POST   | `/`                  | `user:create:all`   | Create a new user                |
| PATCH  | `/:id`               | `user:update:all`   | Update a user                    |
| PATCH  | `/:id/disable`       | `user:disable:all`  | Disable a user account           |
| PATCH  | `/:id/activate`      | `user:activate:all` | Activate a disabled user account |
| POST   | `/:id/roles`         | `user:assign:all`   | Assign a role to a user          |
| POST   | `/:id/roles/:roleId` | `user:remove:all`   | Remove a role from a user        |

---

## Create User

### Endpoint

```txt
POST /api/v1/tenant/users
```

### Purpose

Creates a new user inside the tenant/system.

### Request Body

```json
{
  "name": "Ali Khan",
  "email": "ali@example.com",
  "password": "password123",
  "dept_id": 1
}
```

### Success Response

```json
{
  "statusCode": 200,
  "data": {
    "id": 1,
    "name": "Ali Khan",
    "email": "ali@example.com",
    "dept_id": 1,
    "isActive": true
  },
  "message": "User created successfully",
  "success": true
}
```

## Disable User

### Endpoint

```txt
PATCH /api/v1/tenant/users/:id/disable
```

### Purpose

Disables a user account without permanently deleting the user record.

## Activate User

### Endpoint

```txt
PATCH /api/v1/tenant/users/:id/activate
```

### Purpose

Reactivates a disabled user account.

## Notes

* Password must be hashed before saving into the database.
* Password hash and refresh token must never be returned in API responses.
* Disabled users should not be allowed to log in.
* User-role assignment is handled through the `UserRole` relation.
