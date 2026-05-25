# Documents API

## Overview

This document describes Phase 1 of the Document Management APIs for the EDMS backend.

The Documents module is responsible for:

- Uploading single documents
- Uploading multiple documents in bulk
- Storing actual files in MinIO
- Storing document metadata in PostgreSQL
- Retrieving documents with filters and pagination
- Downloading documents
- Updating document metadata
- Archiving documents
- Restoring archived/deleted documents
- Soft deleting documents

Phase 1 does not include:

- Document versioning
- Workflow approval
- Comments
- Sharing
- OCR
- Elasticsearch indexing
- Permanent delete

---

## Storage Design

The EDMS backend stores document files and metadata separately.

| Storage    | Purpose                                                                                       |
| ---------- | --------------------------------------------------------------------------------------------- |
| MinIO      | Stores the actual uploaded files                                                              |
| PostgreSQL | Stores document metadata such as title, folder, department, file size, object key, and status |

The backend stores the MinIO `bucketName` and `objectKey` in PostgreSQL. These values are used later to download the file from MinIO.

---

## Base URL

```txt
/api/documents
```

---

## Endpoints

| Method | Endpoint        | Permission              | Purpose                                        |
| ------ | --------------- | ----------------------- | ---------------------------------------------- |
| GET    | `/`             | `document:read:all`     | Retrieve documents with filters and pagination |
| GET    | `/:id`          | `document:read:all`     | Retrieve a document by ID                      |
| POST   | `/`             | `document:upload:all`   | Upload a single document                       |
| POST   | `/bulk-upload`  | `document:upload:all`   | Upload multiple documents                      |
| PATCH  | `/:id`          | `document:update:all`   | Update document metadata                       |
| DELETE | `/:id`          | `document:delete:all`   | Soft delete a document                         |
| GET    | `/:id/download` | `document:download:all` | Download a document file                       |
| PATCH  | `/:id/archive`  | `document:archive:all`  | Archive a document                             |
| PATCH  | `/:id/restore`  | `document:restore:all`  | Restore an archived or deleted document        |

---

# Get Documents

## Endpoint

```txt
GET /api/documents
```

## Purpose

Retrieves documents using backend filters and pagination.

The frontend should not fetch all documents and filter them locally. Filtering must be handled on the backend for security, performance, and RBAC enforcement.

## Auth Required

Yes

## Required Permission

```txt
document:read:all
```

## Supported Query Parameters

| Query Param    | Type    | Purpose                                  |
| -------------- | ------- | ---------------------------------------- |
| `departmentId` | number  | Filter documents by department           |
| `folderId`     | number  | Filter documents by folder               |
| `status`       | string  | Filter documents by document status      |
| `isArchived`   | boolean | Filter archived or active documents      |
| `search`       | string  | Search documents by title or description |
| `page`         | number  | Current page number                      |
| `limit`        | number  | Number of records per page               |

## Example Requests

```txt
GET /api/documents
GET /api/documents?departmentId=1
GET /api/documents?folderId=2
GET /api/documents?departmentId=1&folderId=2
GET /api/documents?search=policy
GET /api/documents?page=1&limit=20
```

## Default Behavior

If `page` and `limit` are not provided:

```txt
page = 1
limit = 20
```

So the API returns the latest 20 documents by default.

## Success Response

```json
{
  "statusCode": 200,
  "data": {
    "documents": [
      {
        "id": 1,
        "title": "Leave Policy",
        "description": "HR leave policy document",
        "originalName": "leave-policy.pdf",
        "fileName": "leave-policy.pdf",
        "mimeType": "application/pdf",
        "fileSize": 204800,
        "bucketName": "edms-documents",
        "objectKey": "documents/1716012345678-leave-policy.pdf",
        "status": "ACTIVE",
        "isArchived": false,
        "isDeleted": false,
        "dept_id": 1,
        "folder_id": 2,
        "uploaded_by": 1
      }
    ]
  },
  "message": "Documents retrieved successfully",
  "success": true
}
```

---

# Get Document By ID

## Endpoint

```txt
GET /api/documents/:id
```

## Purpose

Retrieves a single document by its ID.

## Auth Required

Yes

## Required Permission

```txt
document:read:all
```

## Success Response

```json
{
  "statusCode": 200,
  "data": {
    "document": {
      "id": 1,
      "title": "Leave Policy",
      "description": "HR leave policy document",
      "status": "ACTIVE",
      "isArchived": false,
      "isDeleted": false,
      "dept_id": 1,
      "folder_id": 2,
      "uploaded_by": 1
    }
  },
  "message": "Document retrieved successfully",
  "success": true
}
```

---

# Upload Single Document

## Endpoint

```txt
POST /api/documents
```

## Purpose

Uploads a single document file to MinIO and stores document metadata in PostgreSQL.

## Auth Required

Yes

## Required Permission

```txt
document:upload:all
```

## Request Type

```txt
multipart/form-data
```

## Request Body

| Field         | Type   | Required | Purpose              |
| ------------- | ------ | -------- | -------------------- |
| `title`       | string | Yes      | Document title       |
| `description` | string | No       | Document description |
| `dept_id`     | number | Yes      | Department ID        |
| `folder_id`   | number | Yes      | Folder ID            |
| `file`        | file   | Yes      | Document file        |

## Example Form Data

```txt
title: Leave Policy
description: HR leave policy document
dept_id: 1
folder_id: 2
file: leave-policy.pdf
```

## Success Response

```json
{
  "statusCode": 201,
  "data": {
    "document": {
      "id": 1,
      "title": "Leave Policy",
      "description": "HR leave policy document",
      "originalName": "leave-policy.pdf",
      "fileName": "leave-policy.pdf",
      "mimeType": "application/pdf",
      "fileSize": 204800,
      "bucketName": "edms-documents",
      "objectKey": "documents/1716012345678-leave-policy.pdf",
      "status": "ACTIVE",
      "isArchived": false,
      "isDeleted": false,
      "dept_id": 1,
      "folder_id": 2,
      "uploaded_by": 1
    }
  },
  "message": "Document created successfully",
  "success": true
}
```

## Important Validation

- `dept_id` is required.
- `folder_id` is required.
- The selected folder must belong to the selected department.
- The actual uploaded file is stored in MinIO.
- The document metadata is stored in PostgreSQL.
- `uploaded_by` is taken from the authenticated user, not from the request body.

---

# Bulk Upload Documents

## Endpoint

```txt
POST /api/documents/bulk-upload
```

## Purpose

Uploads multiple document files to MinIO and stores their metadata in PostgreSQL.

## Auth Required

Yes

## Required Permission

```txt
document:upload:all
```

## Request Type

```txt
multipart/form-data
```

## Request Body

| Field         | Type   | Required | Purpose                                    |
| ------------- | ------ | -------- | ------------------------------------------ |
| `title`       | string | No       | Common title/prefix for uploaded documents |
| `description` | string | No       | Common description                         |
| `dept_id`     | number | Yes      | Department ID                              |
| `folder_id`   | number | Yes      | Folder ID                                  |
| `files`       | file[] | Yes      | Multiple document files                    |

## Example Form Data

```txt
title: HR Documents
description: HR bulk upload
dept_id: 1
folder_id: 2
files: policy.pdf, handbook.pdf
```

## Success Response

```json
{
  "statusCode": 201,
  "data": {
    "documents": {
      "count": 2
    }
  },
  "message": "Documents created successfully",
  "success": true
}
```

## Important Validation

- At least one file is required.
- `dept_id` is required.
- `folder_id` is required.
- The selected folder must belong to the selected department.
- Each file is uploaded to MinIO.
- Metadata for uploaded files is saved in PostgreSQL.

---

# Update Document

## Endpoint

```txt
PATCH /api/documents/:id
```

## Purpose

Updates document metadata only.

This API does not replace the uploaded file. File replacement/versioning will be handled separately in a future document versioning module.

## Auth Required

Yes

## Required Permission

```txt
document:update:all
```

## Request Body

```json
{
  "title": "Updated Leave Policy",
  "description": "Updated HR leave policy document",
  "dept_id": 1,
  "folder_id": 3
}
```

## Success Response

```json
{
  "statusCode": 200,
  "data": {
    "document": {
      "id": 1,
      "title": "Updated Leave Policy",
      "description": "Updated HR leave policy document",
      "dept_id": 1,
      "folder_id": 3,
      "status": "ACTIVE"
    }
  },
  "message": "Document updated successfully",
  "success": true
}
```

## Important Validation

- The document must exist.
- If `dept_id` or `folder_id` is updated, both must remain valid.
- The selected folder must belong to the selected department.
- This API updates metadata only, not the actual file.

---

# Download Document

## Endpoint

```txt
GET /api/documents/:id/download
```

## Purpose

Downloads the actual document file from MinIO.

## Auth Required

Yes

## Required Permission

```txt
document:download:all
```

## Behavior

The API:

1. Finds the document metadata from PostgreSQL.
2. Reads `objectKey` from the document record.
3. Fetches the file stream from MinIO.
4. Sends the file as a download response.

---

# Archive Document

## Endpoint

```txt
PATCH /api/documents/:id/archive
```

## Purpose

Archives a document without deleting it.

Archived documents are hidden from the normal active document list but remain recoverable and available for historical records.

## Auth Required

Yes

## Required Permission

```txt
document:archive:all
```

## Success Response

```json
{
  "statusCode": 200,
  "data": {
    "document": {
      "id": 1,
      "isArchived": true,
      "archivedAt": "2026-05-25T10:00:00.000Z",
      "archivedBy": 1,
      "status": "ARCHIVED"
    }
  },
  "message": "Document archived successfully",
  "success": true
}
```

## Important Behavior

- Deleted documents cannot be archived.
- Already archived documents should not be archived again.
- Archiving does not remove the file from MinIO.

---

# Restore Document

## Endpoint

```txt
PATCH /api/documents/:id/restore
```

## Purpose

Restores an archived or soft-deleted document back to active state.

## Auth Required

Yes

## Required Permission

```txt
document:restore:all
```

## Success Response

```json
{
  "statusCode": 200,
  "data": {
    "document": {
      "id": 1,
      "isArchived": false,
      "archivedAt": null,
      "archivedBy": null,
      "isDeleted": false,
      "deletedAt": null,
      "deletedBy": null,
      "status": "ACTIVE"
    }
  },
  "message": "Document restored successfully",
  "success": true
}
```

## Important Behavior

- Archived documents can be restored.
- Soft-deleted documents can be restored.
- Already active documents should not be restored again.

---

# Remove Document

## Endpoint

```txt
DELETE /api/documents/:id
```

## Purpose

Soft deletes a document.

The document record remains in PostgreSQL and the actual file remains in MinIO. The document is marked as deleted and removed from normal active views.

## Auth Required

Yes

## Required Permission

```txt
document:delete:all
```

## Success Response

```json
{
  "statusCode": 200,
  "data": {
    "document": {
      "id": 1,
      "isDeleted": true,
      "deletedAt": "2026-05-25T10:00:00.000Z",
      "deletedBy": 1,
      "status": "DELETED"
    }
  },
  "message": "Document removed successfully",
  "success": true
}
```

## Important Behavior

- This is a soft delete.
- The document is not removed from PostgreSQL.
- The file is not removed from MinIO.
- Already deleted documents should not be deleted again.

---

# Error Cases

| Status Code | Reason                                                         |
| ----------- | -------------------------------------------------------------- |
| 400         | Invalid document ID, folder ID, department ID, or request body |
| 401         | Missing or invalid access token                                |
| 403         | User does not have required permission                         |
| 404         | Document, folder, or department not found                      |
| 409         | Duplicate or conflicting document operation                    |
| 500         | Internal server error or storage upload failure                |

---

# Notes

- Documents must always belong to a department and a folder.
- A document cannot be uploaded without `dept_id` and `folder_id`.
- The selected folder must belong to the selected department.
- Files are stored in MinIO.
- Metadata is stored in PostgreSQL.
- Search is handled through `GET /api/documents?search=...`.
- Separate search route is not required in Phase 1.
- Elasticsearch, OCR, BullMQ, workflow, comments, sharing, and versioning are planned for later phases.
