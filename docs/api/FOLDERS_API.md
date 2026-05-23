# Folders API

## Overview

This document describes folder management APIs for the EDMS backend.

Folders are used to organize documents in a hierarchical structure.

The folder module supports:

- Folder listing
- Folder details
- Folder creation
- Folder updates
- Folder deletion
- Moving folders within hierarchy

## Base URL

```txt
/api/v1/tenant/folders
````

---

## Endpoints

| Method | Endpoint    | Permission          | Purpose                                |
| ------ | ----------- | ------------------- | -------------------------------------- |
| GET    | `/`         | `folder:read:all`   | Retrieve all folders                   |
| GET    | `/:id`      | `folder:read:all`   | Retrieve a folder by ID                |
| POST   | `/`         | `folder:create:all` | Create a new folder                    |
| PATCH  | `/:id`      | `folder:update:all` | Update a folder                        |
| DELETE | `/:id`      | `folder:delete:all` | Delete a folder                        |
| PATCH  | `/:id/move` | `folder:move:all`   | Move a folder to another parent folder |

---

## Create Folder

### Endpoint

```txt
POST /api/v1/tenant/folders
```

### Purpose

Creates a new folder.

### Request Body

```json
{
  "name": "Policies",
  "description": "Company policy documents",
  "parent_id": null,
  "dept_id": 1
}
```

### Success Response

```json
{
  "statusCode": 201,
  "data": {
    "folder": {
      "id": 1,
      "name": "Policies",
      "parent_id": null
    }
  },
  "message": "Folder created successfully",
  "success": true
}
```

## Move Folder

### Endpoint

```txt
PATCH /api/v1/tenant/folders/:id/move
```

### Purpose

Moves a folder under another parent folder or moves it to root level.

### Request Body

```json
{
  "parent_id": 2
}
```

To move folder to root level:

```json
{
  "parent_id": null
}
```

## Delete Folder

### Endpoint

```txt
DELETE /api/v1/tenant/folders/:id
```

### Purpose

Deletes a folder.

### Important Behavior

A folder should not be deleted if it contains child folders or documents.

## Error Cases

| Status Code | Reason                                                    |
| ----------- | --------------------------------------------------------- |
| 400         | Invalid folder ID or invalid move operation               |
| 404         | Folder or parent folder not found                         |
| 409         | Folder with same name already exists in the same location |
| 500         | Internal server error                                     |

## Notes

* Folder hierarchy is managed using `parent_id`.
* `parent_id = null` means the folder is at root level.
* A folder should not be moved inside itself.
* A folder should not be moved inside its own child folder.
* Duplicate folder names should be prevented within the same parent folder.
