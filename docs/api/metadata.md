# Metadata API

## Overview

This document describes the Metadata APIs for the EDMS backend.

The Metadata module is responsible for:

* Creating reusable metadata fields
* Managing metadata field definitions
* Supporting dynamic metadata field types
* Assigning metadata values to documents
* Retrieving document-specific metadata
* Updating document metadata values
* Removing metadata values from documents

Metadata allows the EDMS to store structured business information against documents.

Examples:

* Document Type
* Confidentiality Level
* Expiry Date
* Reference Number
* Retention Category
* Priority

---

## Metadata Design

The Metadata module is divided into two parts:

| Component         | Purpose                                                   |
| ----------------- | --------------------------------------------------------- |
| Metadata Field    | Defines reusable metadata fields in the system            |
| Document Metadata | Stores actual metadata values against a specific document |

Example:

```txt
Metadata Field:
Document Type

Document Metadata:
Document #12 -> Document Type = Policy
```

---

## Metadata Field Types

The system supports the following metadata field types:

| Type      | Purpose                               |
| --------- | ------------------------------------- |
| `TEXT`    | Stores text values                    |
| `NUMBER`  | Stores numeric values                 |
| `DATE`    | Stores date values                    |
| `BOOLEAN` | Stores true/false values              |
| `SELECT`  | Stores predefined option-based values |

Example SELECT field:

```json
{
  "name": "Confidentiality Level",
  "key": "confidentiality_level",
  "type": "SELECT",
  "options": ["Public", "Internal", "Confidential", "Restricted"]
}
```

---

## Base URLs

```txt
/api/metadata
/api/documents
```

Metadata field routes are managed under:

```txt
/api/metadata/fields
```

Document metadata routes are nested under documents:

```txt
/api/documents/:documentId/metadata
```

---

## Endpoints

## Metadata Field APIs

| Method | Endpoint               | Permission                 | Purpose                       |
| ------ | ---------------------- | -------------------------- | ----------------------------- |
| GET    | `/metadata/fields`     | `metadataField:read:all`   | Retrieve all metadata fields  |
| GET    | `/metadata/fields/:id` | `metadataField:read:all`   | Retrieve metadata field by ID |
| POST   | `/metadata/fields`     | `metadataField:create:all` | Create metadata field         |
| PATCH  | `/metadata/fields/:id` | `metadataField:update:all` | Update metadata field         |
| DELETE | `/metadata/fields/:id` | `metadataField:delete:all` | Delete metadata field         |

## Document Metadata APIs

| Method | Endpoint                                           | Permission                    | Purpose                                |
| ------ | -------------------------------------------------- | ----------------------------- | -------------------------------------- |
| GET    | `/documents/:documentId/metadata`                  | `documentMetadata:read:all`   | Retrieve metadata values of a document |
| POST   | `/documents/:documentId/metadata`                  | `documentMetadata:create:all` | Add metadata value to a document       |
| PATCH  | `/documents/:documentId/metadata/:metadataFieldId` | `documentMetadata:update:all` | Update document metadata value         |
| DELETE | `/documents/:documentId/metadata/:metadataFieldId` | `documentMetadata:delete:all` | Remove metadata value from a document  |

---

# Get All Metadata Fields

## Endpoint

```txt
GET /api/metadata/fields
```

## Purpose

Retrieves all metadata fields defined in the system.

These fields are used by the frontend to display available metadata inputs when adding metadata to a document.

## Auth Required

Yes

## Required Permission

```txt
metadataField:read:all
```

## Success Response

```json
{
  "statusCode": 200,
  "data": {
    "metadataFields": [
      {
        "id": 1,
        "name": "Document Type",
        "key": "document_type",
        "type": "SELECT",
        "isRequired": true,
        "isActive": true,
        "options": ["Policy", "Contract", "Invoice", "Report"],
        "createdAt": "2026-06-01T10:00:00.000Z",
        "updatedAt": "2026-06-01T10:00:00.000Z"
      }
    ]
  },
  "message": "Metadata fields retrieved successfully",
  "success": true
}
```

---

# Get Metadata Field By ID

## Endpoint

```txt
GET /api/metadata/fields/:id
```

## Purpose

Retrieves a single metadata field definition by ID.

## Auth Required

Yes

## Required Permission

```txt
metadataField:read:all
```

## Success Response

```json
{
  "statusCode": 200,
  "data": {
    "metadataField": {
      "id": 1,
      "name": "Document Type",
      "key": "document_type",
      "type": "SELECT",
      "isRequired": true,
      "isActive": true,
      "options": ["Policy", "Contract", "Invoice", "Report"]
    }
  },
  "message": "Metadata field retrieved successfully",
  "success": true
}
```

---

# Create Metadata Field

## Endpoint

```txt
POST /api/metadata/fields
```

## Purpose

Creates a new metadata field definition.

Metadata fields are reusable across documents.

## Auth Required

Yes

## Required Permission

```txt
metadataField:create:all
```

## Request Body

| Field        | Type    | Required            | Purpose                         |
| ------------ | ------- | ------------------- | ------------------------------- |
| `name`       | string  | Yes                 | Human-readable field name       |
| `key`        | string  | Yes                 | Unique internal field key       |
| `type`       | string  | Yes                 | Metadata field type             |
| `isRequired` | boolean | No                  | Whether this field is required  |
| `isActive`   | boolean | No                  | Whether this field is active    |
| `options`    | array   | Required for SELECT | Allowed values for SELECT field |

## Example Request

```json
{
  "name": "Document Type",
  "key": "document_type",
  "type": "SELECT",
  "isRequired": true,
  "isActive": true,
  "options": ["Policy", "Contract", "Invoice", "Report"]
}
```

## Success Response

```json
{
  "statusCode": 201,
  "data": {
    "metadataField": {
      "id": 1,
      "name": "Document Type",
      "key": "document_type",
      "type": "SELECT",
      "isRequired": true,
      "isActive": true,
      "options": ["Policy", "Contract", "Invoice", "Report"]
    }
  },
  "message": "Metadata field created successfully",
  "success": true
}
```

## Validation Rules

* `name` is required.
* `key` is required and must be unique.
* `key` is normalized before saving.
* `type` must be one of the supported metadata field types.
* `SELECT` fields must have non-empty `options`.
* `SELECT` options must be valid non-empty strings.

---

# Update Metadata Field

## Endpoint

```txt
PATCH /api/metadata/fields/:id
```

## Purpose

Updates an existing metadata field definition.

## Auth Required

Yes

## Required Permission

```txt
metadataField:update:all
```

## Example Request

```json
{
  "name": "Document Category",
  "isRequired": true,
  "options": ["Policy", "Contract", "Invoice", "Report", "Memo"]
}
```

## Success Response

```json
{
  "statusCode": 200,
  "data": {
    "metadataField": {
      "id": 1,
      "name": "Document Category",
      "key": "document_type",
      "type": "SELECT",
      "isRequired": true,
      "isActive": true,
      "options": ["Policy", "Contract", "Invoice", "Report", "Memo"]
    }
  },
  "message": "Metadata field updated successfully",
  "success": true
}
```

---

# Delete Metadata Field

## Endpoint

```txt
DELETE /api/metadata/fields/:id
```

## Purpose

Deletes a metadata field definition if it is not used by any document metadata.

## Auth Required

Yes

## Required Permission

```txt
metadataField:delete:all
```

## Success Response

```json
{
  "statusCode": 200,
  "data": {
    "metadataField": {
      "id": 1,
      "name": "Document Type",
      "key": "document_type"
    }
  },
  "message": "Metadata field deleted successfully",
  "success": true
}
```

## Delete Restriction

A metadata field cannot be deleted if it is already assigned to one or more documents.

Expected error:

```json
{
  "statusCode": 409,
  "message": "Metadata field cannot be deleted because it is used by documents.",
  "success": false,
  "errors": []
}
```

---

# Add Metadata To Document

## Endpoint

```txt
POST /api/documents/:documentId/metadata
```

## Purpose

Adds a metadata value to a specific document.

## Auth Required

Yes

## Required Permission

```txt
documentMetadata:create:all
```

## Request Body

| Field              | Type   | Required | Purpose           |
| ------------------ | ------ | -------- | ----------------- |
| `metadataField_id` | number | Yes      | Metadata field ID |
| `value`            | string | Yes      | Metadata value    |

## Example Request

```json
{
  "metadataField_id": 1,
  "value": "Policy"
}
```

## Success Response

```json
{
  "statusCode": 201,
  "data": {
    "documentMetadata": {
      "id": 1,
      "document_id": 12,
      "metadataField_id": 1,
      "value": "Policy",
      "metadataField": {
        "id": 1,
        "name": "Document Type",
        "key": "document_type",
        "type": "SELECT"
      }
    }
  },
  "message": "Document metadata added successfully",
  "success": true
}
```

## Validation Rules

* Document must exist.
* Document must not be deleted.
* Metadata field must exist.
* Metadata field must be active.
* Metadata value must match the metadata field type.
* Same metadata field cannot be added twice to the same document.

---

# Get Document Metadata

## Endpoint

```txt
GET /api/documents/:documentId/metadata
```

## Purpose

Retrieves all metadata values assigned to a document.

## Auth Required

Yes

## Required Permission

```txt
documentMetadata:read:all
```

## Success Response

```json
{
  "statusCode": 200,
  "data": {
    "documentMetadata": [
      {
        "id": 1,
        "document_id": 12,
        "metadataField_id": 1,
        "value": "Policy",
        "metadataField": {
          "id": 1,
          "name": "Document Type",
          "key": "document_type",
          "type": "SELECT"
        }
      }
    ]
  },
  "message": "Document metadata retrieved successfully",
  "success": true
}
```

---

# Update Document Metadata

## Endpoint

```txt
PATCH /api/documents/:documentId/metadata/:metadataFieldId
```

## Purpose

Updates a specific metadata value assigned to a document.

The metadata record is identified by the document ID and metadata field ID.

## Auth Required

Yes

## Required Permission

```txt
documentMetadata:update:all
```

## Example Request

```json
{
  "value": "Contract"
}
```

## Success Response

```json
{
  "statusCode": 200,
  "data": {
    "documentMetadata": {
      "id": 1,
      "document_id": 12,
      "metadataField_id": 1,
      "value": "Contract",
      "metadataField": {
        "id": 1,
        "name": "Document Type",
        "key": "document_type",
        "type": "SELECT"
      }
    }
  },
  "message": "Document metadata updated successfully",
  "success": true
}
```

---

# Remove Document Metadata

## Endpoint

```txt
DELETE /api/documents/:documentId/metadata/:metadataFieldId
```

## Purpose

Removes a metadata value from a document.

This does not delete the metadata field definition. It only removes the selected metadata value from the selected document.

## Auth Required

Yes

## Required Permission

```txt
documentMetadata:delete:all
```

## Success Response

```json
{
  "statusCode": 200,
  "data": {
    "documentMetadata": {
      "id": 1,
      "document_id": 12,
      "metadataField_id": 1,
      "value": "Policy"
    }
  },
  "message": "Document metadata removed successfully",
  "success": true
}
```

---

# Common Error Responses

## Duplicate Metadata Field Key

```json
{
  "statusCode": 409,
  "message": "Metadata field with this key already exists.",
  "success": false,
  "errors": []
}
```

## SELECT Field Without Options

```json
{
  "statusCode": 400,
  "message": "Options are required for SELECT metadata field.",
  "success": false,
  "errors": []
}
```

## Invalid SELECT Value

```json
{
  "statusCode": 400,
  "message": "Metadata value must be one of the allowed options.",
  "success": false,
  "errors": []
}
```

## Duplicate Document Metadata

```json
{
  "statusCode": 409,
  "message": "Metadata value already exists for this document and field.",
  "success": false,
  "errors": []
}
```

## Document Not Found

```json
{
  "statusCode": 404,
  "message": "Document not found.",
  "success": false,
  "errors": []
}
```

## Metadata Field Not Found

```json
{
  "statusCode": 404,
  "message": "Metadata field not found.",
  "success": false,
  "errors": []
}
```

---

# Design Notes

* Metadata fields are reusable system-level definitions.
* Document metadata stores actual values against documents.
* Metadata values are stored as strings for dynamic field support.
* Validation is handled in the service layer based on metadata field type.
* `SELECT` fields enforce consistent predefined values.
* A document cannot have duplicate values for the same metadata field.
* A metadata field cannot be deleted if it is used by any document.
* Metadata improves future search, filtering, reporting, and workflow automation.
