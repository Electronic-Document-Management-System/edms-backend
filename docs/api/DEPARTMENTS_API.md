# Departments API

## Overview

This document describes department management APIs for the EDMS backend.

Departments are used to organize users, documents, approvals, and department-level access control.

## Base URL

```txt
/api/v1/tenant/departments
````

---

## Endpoints

| Method | Endpoint | Permission              | Purpose                     |
| ------ | -------- | ----------------------- | --------------------------- |
| GET    | `/`      | `department:read:all`   | Retrieve all departments    |
| GET    | `/:id`   | `department:read:all`   | Retrieve a department by ID |
| POST   | `/`      | `department:create:all` | Create a new department     |
| PATCH  | `/:id`   | `department:update:all` | Update a department         |
| DELETE | `/:id`   | `department:delete:all` | Delete a department         |

---

## Create Department

### Endpoint

```txt
POST /api/v1/tenant/departments
```

### Purpose

Creates a new department.

### Request Body

```json
{
  "name": "Human Resources"
}
```

### Success Response

```json
{
  "statusCode": 201,
  "data": {
    "department": {
      "id": 1,
      "name": "Human Resources"
    }
  },
  "message": "Department created successfully",
  "success": true
}
```

## Update Department

### Endpoint

```txt
PATCH /api/v1/tenant/departments/:id
```

### Purpose

Updates an existing department.

## Delete Department

### Endpoint

```txt
DELETE /api/v1/tenant/departments/:id
```

### Purpose

Deletes an existing department.

## Error Cases

| Status Code | Reason                                         |
| ----------- | ---------------------------------------------- |
| 400         | Invalid department ID or missing required data |
| 404         | Department not found                           |
| 409         | Department already exists                      |
| 500         | Internal server error                          |

## Notes

* Department names should be unique within the relevant tenant/system scope.
* Department relation is used in user management and document access control.
