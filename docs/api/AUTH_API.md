# Auth API

## Overview

This document describes authentication-related APIs for the EDMS backend.

Currently implemented:

- Login

Planned:

- Current User Profile
- Logout
- Refresh Token
- Change Password

## Base URL

```txt
/api/v1/tenant/auth
````

## Endpoints

| Method | Endpoint           | Auth Required      | Purpose                                   | Status      |
| ------ | ------------------ | ------------------ | ----------------------------------------- | ----------- |
| POST   | `/login`           | No                 | Authenticate user and return access token | Implemented |
| GET    | `/me`              | Yes                | Retrieve logged-in user profile           | Planned     |
| POST   | `/logout`          | Yes                | Logout authenticated user                 | Planned     |
| POST   | `/refresh-token`   | No / Refresh Token | Generate new access token                 | Planned     |
| POST   | `/change-password` | Yes                | Change logged-in user password            | Planned     |

---

## Login

### Endpoint

```txt
POST /api/v1/tenant/auth/login
```

### Purpose

Authenticates a user using email and password.

### Auth Required

No

### Request Body

```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

### Success Response

```json
{
  "statusCode": 200,
  "data": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@example.com"
  },
  "message": "Login Successful",
  "success": true
}
```

**Note**: Access token and refresh token are set as HTTP-only cookies (`accesstoken` and `refreshToken`).

### Error Cases

| Status Code | Reason                    |
| ----------- | ------------------------- |
| 400         | Missing email or password |
| 401         | Invalid email or password |
| 403         | User account is disabled  |
| 500         | Internal server error     |

## Notes

* Password must never be returned in the response.
* JWT payload should contain only safe user/session information.
* Future authentication APIs will include logout, refresh token, and current user profile.

