# Auth and Permission Middlewares

## Overview

This document describes the authentication and permission middlewares used in the EDMS backend.

The middleware layer is responsible for protecting routes, validating authenticated users, and enforcing permission-based access control.

---

## Auth Middleware

### Purpose

The authentication middleware verifies the access token and attaches the authenticated user to the request object.

### Responsibilities

- Read the access token from the request.
- Verify the JWT access token.
- Extract the authenticated user ID from the token payload.
- Fetch the user from the database.
- Attach the authenticated user to `req.user`.
- Reject requests with missing, invalid, or expired tokens.

### Request Flow

```text
Request
  → Read Authorization Header
  → Verify Access Token
  → Fetch User
  → Attach User to req.user
  → Continue to Next Middleware / Controller
```

### Failure Cases

| Case           | Response         |
| -------------- | ---------------- |
| Missing token  | 401 Unauthorized |
| Invalid token  | 401 Unauthorized |
| Expired token  | 401 Unauthorized |
| User not found | 401 Unauthorized |

---

## Permission Middleware

### Purpose

The permission middleware verifies whether the authenticated user has the required permission to perform a specific action.

The system follows the following permission format:

```text
resource:action:scope
```

Example:

```text
document:approve:department
```

### Responsibilities

- Ensure the user is authenticated.
- Fetch the user's assigned roles.
- Fetch permissions assigned to those roles.
- Compare the required permission with the user's available permissions.
- Allow or deny access based on the result.

### Request Flow

```text
Request
  → Auth Middleware
  → req.user available
  → Fetch User Roles
  → Fetch Role Permissions
  → Compare Required Permission
  → Allow or Deny Request
```

### Example Permission Checks

```text
document:upload:own
document:approve:department
role:assign:all
auditLog:read:all
```

### Failure Cases

| Case                                   | Response         |
| -------------------------------------- | ---------------- |
| User is not authenticated              | 401 Unauthorized |
| User does not have required permission | 403 Forbidden    |

---

## Design Notes

- Authorization must be permission-based, not role-name based.
- Roles are dynamic and should be managed through the database.
- Permissions are structured using `resource`, `action`, and `scope`.
- This approach supports flexible RBAC configuration for different departments and organizational structures.
