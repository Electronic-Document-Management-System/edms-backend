import { NotificationType, WorkflowAction, WorkflowStatus } from '@prisma/client';
import { prisma } from '@/config/db.config';
import ApiError from '@/utils/ApiError';
import { WorkflowHistoryData } from '@/types/workflow';
import { createNotificationService } from '../notification/notification.service';

const validateId = (id: number, message: string) => {
    if (!id || Number.isNaN(id)) {
        throw new ApiError(400, message);
    }
};

const createWorkflowHistory = async ({
    workflowId,
    documentId,
    action,
    fromStatus,
    toStatus,
    performedById,
    reviewerId,
    comment,
}: WorkflowHistoryData) => {
    return prisma.workflowHistory.create({
        data: {
            workflow_id: workflowId,
            document_id: documentId,
            action,
            fromStatus,
            toStatus,
            performedById,
            reviewerId,
            comment,
        },
    });
};

export const submitDocumentWorkflowService = async (
    documentId: number,
    submittedById: number,
) => {
    validateId(documentId, 'Valid document ID is required.');
    validateId(submittedById, 'Valid user ID is required.');

    const document = await prisma.document.findUnique({
        where: { id: documentId },
    });

    if (!document) {
        throw new ApiError(404, 'Document not found.');
    }

    if (document.isDeleted) {
        throw new ApiError(400, 'Deleted document cannot be submitted for review.');
    }

    if (document.isArchived) {
        throw new ApiError(400, 'Archived document cannot be submitted for review.');
    }

    const existingWorkflow = await prisma.documentWorkflow.findUnique({
        where: { document_id: documentId },
    });

    if (existingWorkflow) {
        if (
            existingWorkflow.status === WorkflowStatus.PENDING_REVIEW ||
            existingWorkflow.status === WorkflowStatus.IN_REVIEW
        ) {
            throw new ApiError(409, 'Document is already in workflow.');
        }

        const restartedWorkflow = await prisma.documentWorkflow.update({
            where: { document_id: documentId },
            data: {
                status: WorkflowStatus.PENDING_REVIEW,
                submittedById,
                submittedAt: new Date(),
                reviewerId: null,
                assignedById: null,
                assignedAt: null,
                reviewedAt: null,
                reviewComment: null,
                completedAt: null,
                cancelledAt: null,
                cancelledById: null,
                cancelReason: null,
            },
        });

        await createWorkflowHistory({
            workflowId: restartedWorkflow.id,
            documentId,
            action: WorkflowAction.SUBMITTED,
            fromStatus: existingWorkflow.status,
            toStatus: WorkflowStatus.PENDING_REVIEW,
            performedById: submittedById,
            comment: 'Workflow resubmitted for review.',
        });

        return restartedWorkflow;
    }

    const workflow = await prisma.documentWorkflow.create({
        data: {
            document_id: documentId,
            status: WorkflowStatus.PENDING_REVIEW,
            submittedById,
            submittedAt: new Date(),
        },
    });

    await createWorkflowHistory({
        workflowId: workflow.id,
        documentId,
        action: WorkflowAction.SUBMITTED,
        fromStatus: null,
        toStatus: WorkflowStatus.PENDING_REVIEW,
        performedById: submittedById,
        comment: 'Document submitted for review.',
    });

    return workflow;
};

export const assignReviewerService = async (
    documentId: number,
    reviewerId: number,
    assignedById: number,
) => {
    validateId(documentId, 'Valid document ID is required.');
    validateId(reviewerId, 'Valid reviewer ID is required.');
    validateId(assignedById, 'Valid assigning user ID is required.');

    if (reviewerId === assignedById) {
        throw new ApiError(400, 'You cannot assign yourself as reviewer.');
    }

    const workflow = await prisma.documentWorkflow.findUnique({
        where: { document_id: documentId },
    });

    if (!workflow) {
        throw new ApiError(404, 'Workflow not found. Submit document for review first.');
    }

    if (workflow.status === WorkflowStatus.APPROVED || workflow.status === WorkflowStatus.REJECTED) {
        throw new ApiError(400, 'Completed workflow cannot be reassigned.');
    }

    if (workflow.status === WorkflowStatus.CANCELLED) {
        throw new ApiError(400, 'Cancelled workflow cannot be assigned.');
    }

    const reviewer = await prisma.user.findUnique({
        where: { id: reviewerId },
    });

    if (!reviewer) {
        throw new ApiError(404, 'Reviewer not found.');
    }

    if (!reviewer.isActive) {
        throw new ApiError(400, 'Reviewer is inactive.');
    }

    const action =
        workflow.reviewerId && workflow.reviewerId !== reviewerId
            ? WorkflowAction.REVIEWER_REASSIGNED
            : WorkflowAction.REVIEWER_ASSIGNED;

    const updatedWorkflow = await prisma.documentWorkflow.update({
        where: { document_id: documentId },
        data: {
            status: WorkflowStatus.IN_REVIEW,
            reviewerId,
            assignedById,
            assignedAt: new Date(),
        },
        include: { document: true }
    });

    await createWorkflowHistory({
        workflowId: workflow.id,
        documentId,
        action,
        fromStatus: workflow.status,
        toStatus: WorkflowStatus.IN_REVIEW,
        performedById: assignedById,
        reviewerId,
        comment:
            action === WorkflowAction.REVIEWER_REASSIGNED
                ? 'Reviewer reassigned.'
                : 'Reviewer assigned.',
    });

    await createNotificationService({
        userId: workflow.reviewerId!,
        type: NotificationType.REVIEWER_ASSIGNED,
        title: `New document assigned for review`,
        message: `You have been assigned for review ${updatedWorkflow.document.title}.`,
        resource: 'document',
        resourceId: workflow.document_id,
    });

    return updatedWorkflow;
};

export const approveDocumentWorkflowService = async (
    documentId: number,
    reviewerId: number,
    comment?: string,
) => {
    validateId(documentId, 'Valid document ID is required.');
    validateId(reviewerId, 'Valid reviewer ID is required.');

    const workflow = await prisma.documentWorkflow.findUnique({
        where: { document_id: documentId },
    });

    if (!workflow) {
        throw new ApiError(404, 'Workflow not found.');
    }

    if (workflow.status !== WorkflowStatus.IN_REVIEW) {
        throw new ApiError(400, 'Only in-review workflows can be approved.');
    }

    if (workflow.reviewerId !== reviewerId) {
        throw new ApiError(403, 'Only assigned reviewer can approve this document.');
    }

    const updatedWorkflow = await prisma.documentWorkflow.update({
        where: { document_id: documentId },
        data: {
            status: WorkflowStatus.APPROVED,
            reviewedAt: new Date(),
            reviewComment: comment,
            completedAt: new Date(),
            reviewerId: reviewerId,
        },
        include: { document: true }
    });

    await createWorkflowHistory({
        workflowId: workflow.id,
        documentId,
        action: WorkflowAction.APPROVED,
        fromStatus: workflow.status,
        toStatus: WorkflowStatus.APPROVED,
        performedById: reviewerId,
        reviewerId: reviewerId,
        comment,
    });

    await createNotificationService({
        userId: workflow.submittedById,
        type: NotificationType.WORKFLOW_APPROVED,
        title: `Document Approved`,
        message: `Your ${updatedWorkflow.document.title} document have been approved.`,
        resource: `document`,
        resourceId: workflow.document_id,
    });

    return updatedWorkflow;
};

export const rejectDocumentWorkflowService = async (
    documentId: number,
    reviewerId: number,
    comment?: string,
) => {
    validateId(documentId, 'Valid document ID is required.');
    validateId(reviewerId, 'Valid reviewer ID is required.');

    const workflow = await prisma.documentWorkflow.findUnique({
        where: { document_id: documentId },
    });

    if (!workflow) {
        throw new ApiError(404, 'Workflow not found.');
    }

    if (workflow.status !== WorkflowStatus.IN_REVIEW) {
        throw new ApiError(400, 'Only in-review workflows can be rejected.');
    }

    if (workflow.reviewerId !== reviewerId) {
        throw new ApiError(403, 'Only assigned reviewer can reject this document.');
    }

    const updatedWorkflow = await prisma.documentWorkflow.update({
        where: { document_id: documentId },
        data: {
            status: WorkflowStatus.REJECTED,
            reviewedAt: new Date(),
            reviewComment: comment,
            completedAt: new Date(),
        },
        include: { document: true, reviewer: true }
    });

    await createWorkflowHistory({
        workflowId: workflow.id,
        documentId,
        action: WorkflowAction.REJECTED,
        fromStatus: workflow.status,
        toStatus: WorkflowStatus.REJECTED,
        performedById: reviewerId,
        reviewerId,
        comment,
    });

    await createNotificationService({
        userId: updatedWorkflow.submittedById,
        type: NotificationType.WORKFLOW_REJECTED,
        title: `Your document has been rejected.`,
        message: `Your ${updatedWorkflow.document.title} document has been rejected by ${updatedWorkflow.reviewer?.name}`,
        resource: "document",
        resourceId: workflow.document_id,
    });

    return updatedWorkflow;
};

export const cancelDocumentWorkflowService = async (
    documentId: number,
    cancelledById: number,
    reason?: string,
) => {
    validateId(documentId, 'Valid document ID is required.');
    validateId(cancelledById, 'Valid user ID is required.');

    const workflow = await prisma.documentWorkflow.findUnique({
        where: { document_id: documentId },
    });

    if (!workflow) {
        throw new ApiError(404, 'Workflow not found.');
    }

    if (
        workflow.status === WorkflowStatus.APPROVED ||
        workflow.status === WorkflowStatus.REJECTED ||
        workflow.status === WorkflowStatus.CANCELLED
    ) {
        throw new ApiError(400, 'Completed or cancelled workflow cannot be cancelled.');
    }

    const updatedWorkflow = await prisma.documentWorkflow.update({
        where: { document_id: documentId },
        data: {
            status: WorkflowStatus.CANCELLED,
            cancelledAt: new Date(),
            cancelledById,
            cancelReason: reason,
            completedAt: new Date(),
        },
        include: { document: true }
    });

    await createWorkflowHistory({
        workflowId: workflow.id,
        documentId,
        action: WorkflowAction.CANCELLED,
        fromStatus: workflow.status,
        toStatus: WorkflowStatus.CANCELLED,
        performedById: cancelledById,
        reviewerId: cancelledById,
        comment: reason,
    });

    if (workflow.reviewerId) {
        await createNotificationService({
            userId: workflow.reviewerId!,
            type: NotificationType.WORKFLOW_CANCELLED,
            title: `Workflow Cancelled.`,
            message: `The review for "${updatedWorkflow.document.title}" has been cancelled.`,
            resource: "document",
            resourceId: workflow.document_id,
        });
    }

    return updatedWorkflow;
};

export const getWorkflowStatusService = async (documentId: number) => {
    validateId(documentId, 'Valid document ID is required.');

    const workflow = await prisma.documentWorkflow.findUnique({
        where: { document_id: documentId },
        include: {
            document: true,
            submittedBy: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            reviewer: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            assignedBy: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            history: {
                include: {
                    performedBy: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                    reviewer: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: 'asc',
                },
            },
        },
    });

    if (!workflow) {
        throw new ApiError(404, 'Workflow not found.');
    }

    return workflow;
};

export const getWorkflowsAssignedToMeService = async (reviewerId: number) => {
    validateId(reviewerId, 'Valid reviewer ID is required.');

    const workflows = await prisma.documentWorkflow.findMany({
        where: {
            reviewerId,
            status: WorkflowStatus.IN_REVIEW,
            document: {
                isDeleted: false,
            },
        },
        include: {
            document: {
                include: {
                    department: true,
                    folder: true,
                    uploadedBy: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                    metadata: {
                        include: {
                            metadataField: true,
                        },
                    },
                },
            },
            submittedBy: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            assignedBy: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
        orderBy: {
            assignedAt: 'desc',
        },
    });

    return workflows;
};

export const getMyWorkflowSubmissionsService = async (submittedById: number) => {
    validateId(submittedById, 'Valid user ID is required.');

    const workflows = await prisma.documentWorkflow.findMany({
        where: {
            submittedById,
            document: {
                isDeleted: false,
            },
        },
        include: {
            document: {
                include: {
                    department: true,
                    folder: true,
                    uploadedBy: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                    metadata: {
                        include: {
                            metadataField: true,
                        },
                    },
                },
            },
            reviewer: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            assignedBy: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
        orderBy: {
            submittedAt: 'desc',
        },
    });

    return workflows;
};