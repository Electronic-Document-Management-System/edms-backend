# Workflow API

## Overview

This document describes Phase 1 of the Workflow APIs for the EDMS backend.

The Workflow module is responsible for:

* Submitting documents for review
* Assigning reviewers
* Tracking current workflow status
* Allowing assigned reviewers to approve documents
* Allowing assigned reviewers to reject documents
* Cancelling active workflows
* Retrieving workflows assigned to the logged-in reviewer
* Maintaining workflow action history

Phase 1 focuses on a simple document approval lifecycle.

It does not include:

* Multi-level approval chains
* Dynamic workflow templates
* Parallel reviewers
* Approval conditions
* SLA tracking
* Escalations
* Email notifications

---

## Workflow Design

The Workflow module is document-specific.

Each workflow belongs to one document.

The system stores:

| Component        | Purpose                                      |
| ---------------- | -------------------------------------------- |
| DocumentWorkflow | Stores current workflow status of a document |
| WorkflowHistory  | Stores workflow action history               |

Example flow:

```txt
Document uploaded
-> Submit for review
-> Assign reviewer
-> Reviewer approves/rejects
-> Workflow completed
```

---

## Workflow Statuses

| Status           | Purpose                                |
| ---------------- | -------------------------------------- |
| `PENDING_REVIEW` | Document has been submitted for review |
| `IN_REVIEW`      | Reviewer has been assigned             |
| `APPROVED`       | Reviewer approved the document         |
| `REJECTED`       | Reviewer rejected the document         |
| `CANCELLED`      | Workflow was cancelled                 |

---

## Workflow Actions

| Action                | Purpose                           |
| --------------------- | --------------------------------- |
| `SUBMITTED`           | Document was submitted for review |
| `REVIEWER_ASSIGNED`   | Reviewer was assigned             |
| `REVIEWER_REASSIGNED` | Reviewer was reassigned           |
| `APPROVED`            | Document was approved             |
| `REJECTED`            | Document was rejected             |
| `CANCELLED`           | Workflow was cancelled            |

---

## Base URLs

Document-specific workflow routes:

```txt
/api/documents
```

Reviewer workflow route:

```txt
/api/workflow
```

---

## Endpoints

| Method | Endpoint                                          | Permission               | Purpose                                      |
| ------ | ------------------------------------------------- | ------------------------ | -------------------------------------------- |
| POST   | `/documents/:documentId/workflow/submit`          | `workflow:submit:all`    | Submit document for review                   |
| POST   | `/documents/:documentId/workflow/assign-reviewer` | `workflow:assign:all`    | Assign reviewer to workflow                  |
| POST   | `/documents/:documentId/workflow/approve`         | `workflow:approve:all`   | Approve document workflow                    |
| POST   | `/documents/:documentId/workflow/reject`          | `workflow:reject:all`    | Reject document workflow                     |
| POST   | `/documents/:documentId/workflow/cancel`          | `workflow:cancel:all`    | Cancel document workflow                     |
| GET    | `/documents/:documentId/workflow-status`          | `workflow:read:all`      | Get workflow status and history              |
| GET    | `/workflow/assigned-to-me`                        | `workflow:read:assigned` | Get workflows assigned to logged-in reviewer |

---

# Submit Document Workflow

## Endpoint

```txt
POST /api/documents/:documentId/workflow/submit
```

## Purpose

Submits a document for review.

If the document does not already have an active workflow, a new workflow record is created with status:

```txt
PENDING_REVIEW
```

## Auth Required

Yes

## Required Permission

```txt
workflow:submit:all
```

## Request Body

No request body is required.

```json
{}
```

## Success Response

```json
{
  "statusCode": 200,
  "data": {
    "workflow": {
      "id": 1,
      "document_id": 12,
      "status": "PENDING_REVIEW",
      "submittedById": 1,
      "submittedAt": "2026-06-01T10:00:00.000Z",
      "reviewerId": null,
      "assignedById": null,
      "assignedAt": null
    }
  },
  "message": "Document submitted successfully",
  "success": true
}
```

## Validation Rules

* Document must exist.
* Document must not be deleted.
* Document must not be archived.
* Document must not already be in an active workflow.
* If workflow already exists but is completed or cancelled, it can be restarted.

---

# Assign Reviewer

## Endpoint

```txt
POST /api/documents/:documentId/workflow/assign-reviewer
```

## Purpose

Assigns a reviewer to a submitted document workflow.

After reviewer assignment, workflow status becomes:

```txt
IN_REVIEW
```

## Auth Required

Yes

## Required Permission

```txt
workflow:assign:all
```

## Request Body

| Field        | Type   | Required | Purpose             |
| ------------ | ------ | -------- | ------------------- |
| `reviewerId` | number | Yes      | User ID of reviewer |

## Example Request

```json
{
  "reviewerId": 2
}
```

## Success Response

```json
{
  "statusCode": 200,
  "data": {
    "workflow": {
      "id": 1,
      "document_id": 12,
      "status": "IN_REVIEW",
      "submittedById": 1,
      "reviewerId": 2,
      "assignedById": 1,
      "assignedAt": "2026-06-01T10:05:00.000Z"
    }
  },
  "message": "Reviewer assigned successfully",
  "success": true
}
```

## Validation Rules

* Workflow must exist.
* Workflow must not be approved, rejected, or cancelled.
* Reviewer must exist.
* Reviewer must be active.
* Assigning user cannot assign themselves as reviewer.

---

# Approve Document Workflow

## Endpoint

```txt
POST /api/documents/:documentId/workflow/approve
```

## Purpose

Approves a document workflow.

Only the assigned reviewer can approve the workflow.

After approval, workflow status becomes:

```txt
APPROVED
```

## Auth Required

Yes

## Required Permission

```txt
workflow:approve:all
```

## Request Body

| Field     | Type   | Required | Purpose          |
| --------- | ------ | -------- | ---------------- |
| `comment` | string | No       | Reviewer comment |

## Example Request

```json
{
  "comment": "Document reviewed and approved."
}
```

## Success Response

```json
{
  "statusCode": 200,
  "data": {
    "workflow": {
      "id": 1,
      "document_id": 12,
      "status": "APPROVED",
      "reviewerId": 2,
      "reviewedAt": "2026-06-01T10:20:00.000Z",
      "reviewComment": "Document reviewed and approved.",
      "completedAt": "2026-06-01T10:20:00.000Z"
    }
  },
  "message": "Document approved successfully",
  "success": true
}
```

## Validation Rules

* Workflow must exist.
* Workflow status must be `IN_REVIEW`.
* Only assigned reviewer can approve the document.

---

# Reject Document Workflow

## Endpoint

```txt
POST /api/documents/:documentId/workflow/reject
```

## Purpose

Rejects a document workflow.

Only the assigned reviewer can reject the workflow.

After rejection, workflow status becomes:

```txt
REJECTED
```

## Auth Required

Yes

## Required Permission

```txt
workflow:reject:all
```

## Request Body

| Field     | Type   | Required | Purpose                    |
| --------- | ------ | -------- | -------------------------- |
| `comment` | string | No       | Reviewer rejection comment |

## Example Request

```json
{
  "comment": "Document rejected due to missing required information."
}
```

## Success Response

```json
{
  "statusCode": 200,
  "data": {
    "workflow": {
      "id": 1,
      "document_id": 12,
      "status": "REJECTED",
      "reviewerId": 2,
      "reviewedAt": "2026-06-01T10:20:00.000Z",
      "reviewComment": "Document rejected due to missing required information.",
      "completedAt": "2026-06-01T10:20:00.000Z"
    }
  },
  "message": "Document rejected successfully",
  "success": true
}
```

## Validation Rules

* Workflow must exist.
* Workflow status must be `IN_REVIEW`.
* Only assigned reviewer can reject the document.

---

# Cancel Document Workflow

## Endpoint

```txt
POST /api/documents/:documentId/workflow/cancel
```

## Purpose

Cancels an active workflow.

A workflow can be cancelled only when it is not already approved, rejected, or cancelled.

After cancellation, workflow status becomes:

```txt
CANCELLED
```

## Auth Required

Yes

## Required Permission

```txt
workflow:cancel:all
```

## Request Body

| Field    | Type   | Required | Purpose             |
| -------- | ------ | -------- | ------------------- |
| `reason` | string | No       | Cancellation reason |

## Example Request

```json
{
  "reason": "Workflow cancelled for correction."
}
```

## Success Response

```json
{
  "statusCode": 200,
  "data": {
    "workflow": {
      "id": 1,
      "document_id": 12,
      "status": "CANCELLED",
      "cancelledAt": "2026-06-01T10:30:00.000Z",
      "cancelledById": 1,
      "cancelReason": "Workflow cancelled for correction.",
      "completedAt": "2026-06-01T10:30:00.000Z"
    }
  },
  "message": "Document workflow cancelled successfully",
  "success": true
}
```

---

# Get Workflow Status

## Endpoint

```txt
GET /api/documents/:documentId/workflow-status
```

## Purpose

Retrieves the current workflow status of a document along with workflow history.

This endpoint is used by the frontend to display the workflow status badge and workflow timeline.

## Auth Required

Yes

## Required Permission

```txt
workflow:read:all
```

## Success Response

```json
{
  "statusCode": 200,
  "data": {
    "workflow": {
      "id": 1,
      "document_id": 12,
      "status": "IN_REVIEW",
      "submittedBy": {
        "id": 1,
        "name": "System Admin",
        "email": "admin@edms.com"
      },
      "reviewer": {
        "id": 2,
        "name": "Reviewer User",
        "email": "reviewer@edms.com"
      },
      "history": [
        {
          "id": 1,
          "action": "SUBMITTED",
          "fromStatus": null,
          "toStatus": "PENDING_REVIEW",
          "comment": "Document submitted for review.",
          "createdAt": "2026-06-01T10:00:00.000Z"
        },
        {
          "id": 2,
          "action": "REVIEWER_ASSIGNED",
          "fromStatus": "PENDING_REVIEW",
          "toStatus": "IN_REVIEW",
          "comment": "Reviewer assigned.",
          "createdAt": "2026-06-01T10:05:00.000Z"
        }
      ]
    }
  },
  "message": "Workflow status retrieved successfully",
  "success": true
}
```

---

# Get Workflows Assigned To Me

## Endpoint

```txt
GET /api/workflow/assigned-to-me
```

## Purpose

Retrieves workflows assigned to the currently logged-in reviewer.

This endpoint is used for the reviewer dashboard or review task list.

## Auth Required

Yes

## Required Permission

```txt
workflow:read:assigned
```

## Success Response

```json
{
  "statusCode": 200,
  "data": {
    "workflows": [
      {
        "id": 1,
        "document_id": 12,
        "status": "IN_REVIEW",
        "document": {
          "id": 12,
          "title": "Leave Policy",
          "description": "HR leave policy document",
          "status": "ACTIVE",
          "isDeleted": false,
          "department": {
            "id": 1,
            "name": "HR"
          },
          "folder": {
            "id": 2,
            "name": "Policies"
          }
        },
        "submittedBy": {
          "id": 1,
          "name": "System Admin",
          "email": "admin@edms.com"
        },
        "assignedBy": {
          "id": 1,
          "name": "System Admin",
          "email": "admin@edms.com"
        }
      }
    ]
  },
  "message": "Workflows assigned to me retrieved successfully",
  "success": true
}
```

---

# Common Error Responses

## Document Not Found

```json
{
  "statusCode": 404,
  "message": "Document not found.",
  "success": false,
  "errors": []
}
```

## Workflow Not Found

```json
{
  "statusCode": 404,
  "message": "Workflow not found.",
  "success": false,
  "errors": []
}
```

## Duplicate Active Workflow

```json
{
  "statusCode": 409,
  "message": "Document is already in workflow.",
  "success": false,
  "errors": []
}
```

## Reviewer Not Found

```json
{
  "statusCode": 404,
  "message": "Reviewer not found.",
  "success": false,
  "errors": []
}
```

## Inactive Reviewer

```json
{
  "statusCode": 400,
  "message": "Reviewer is inactive.",
  "success": false,
  "errors": []
}
```

## Approve By Non-Assigned Reviewer

```json
{
  "statusCode": 403,
  "message": "Only assigned reviewer can approve this document.",
  "success": false,
  "errors": []
}
```

## Reject By Non-Assigned Reviewer

```json
{
  "statusCode": 403,
  "message": "Only assigned reviewer can reject this document.",
  "success": false,
  "errors": []
}
```

## Invalid Workflow State

```json
{
  "statusCode": 400,
  "message": "Only in-review workflows can be approved.",
  "success": false,
  "errors": []
}
```

---

# Design Notes

* Workflow is document-specific.
* A document has one current workflow record in Phase 1.
* Workflow actions are tracked in `WorkflowHistory`.
* Workflow status is changed only through explicit actions.
* Generic workflow CRUD endpoints are intentionally avoided in Phase 1.
* `assigned-to-me` is used for reviewer task lists.
* Approval and rejection can only be performed by the assigned reviewer.
* Completed workflows cannot be reassigned or cancelled.
* Workflow module prepares the backend for future notification and reporting features.
