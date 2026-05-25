# EDMS API Documentation

## Overview

This directory contains API documentation for the EDMS backend modules.

The API documentation is maintained alongside development so that implemented modules, routes, permissions, and expected behavior remain clear for developers and reviewers.

## Available API Docs

| Module | File | Status |
|---|---|---|
| Auth | `AUTH_API.md` | Partially Implemented |
| RBAC | `RBAC_API.md` | Implemented |
| Users | `USERS_API.md` | Implemented / In Progress |
| Departments | `DEPARTMENTS_API.md` | Implemented |
| Folders | `FOLDERS_API.md` | Implemented |
| Documents | `DOCUMENTS_API.md` | Implemented - Phase 1 |

## API Response Format

All APIs should follow the standard response format:

````json
{
  "statusCode": 200,
  "data": {},
  "message": "Request completed successfully",
  "success": true
}
````

## Error Response Format

```json
{
  "statusCode": 400,
  "data": null,
  "message": "Error message",
  "success": false
}
```

## Authentication

Protected APIs require a valid access token.

```http
Authorization: Bearer <access_token>
```

## Authorization

Authorization is handled through permission-based RBAC.

Permission format:

```txt
resource:action:scope
```

Example:

```txt
document:read:own
user:create:all
folder:move:all
```
