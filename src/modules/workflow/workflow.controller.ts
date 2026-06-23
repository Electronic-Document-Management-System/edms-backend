import { Request, Response } from "express";
import asyncHandler from "@/utils/asyncHandler";
import { ApiResponse } from "@/utils/ApiResponse";
import { approveDocumentWorkflowService, assignReviewerService, cancelDocumentWorkflowService, getWorkflowsAssignedToMeService, getWorkflowStatusService, rejectDocumentWorkflowService, submitDocumentWorkflowService } from "./workflow.service";


// Document workflow endpoints
/**
 * @description Submit document for review
 * @route POST /api/v1/workflows/documents/submit
 * @access Private
 */
export const submitDocumentWorkflow = asyncHandler(async (req: Request, res: Response) => {

    const documentId = Number(req.params.documentId);
    const userId = Number(req.user?.id);

    const submittedDocument = await submitDocumentWorkflowService(documentId, userId)

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { submittedDocument },
                "Document submitted successfully"
            )
        )
});

/**
 * @description Assign reviewer
 * @route POST /api/v1/workflows/documents/assign-reviewer
 * @access Private
 */
export const assignReviewer = asyncHandler(async (req: Request, res: Response) => {

    const documentId = Number(req.params.documentId);
    const reviewerId = Number(req.body.reviewerId)
    const assignedById = Number(req.user?.id)
    const assignedReviewer = await assignReviewerService(documentId, reviewerId, assignedById)

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { assignedReviewer },
                "Reviewer assigned successfully"
            )
        )
});

/**
 * @description Approve document
 * @route POST /api/v1/workflows/documents/approve
 * @access Private
 */
export const approveDocumentWorkflow = asyncHandler(async (req: Request, res: Response) => {

    const documentId = Number(req.params.documentId);
    const reviewerId = Number(req.user?.id);
    const comment = req.body.comment;
    const approvedDocument = await approveDocumentWorkflowService(documentId, reviewerId, comment)

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { approvedDocument },
                "Document approved successfully"
            )
        )
});

/**
 * @description Reject document
 * @route POST /api/v1/workflows/documents/reject
 * @access Private
 */
export const rejectDocumentWorkflow = asyncHandler(async (req: Request, res: Response) => {

    const documentId = Number(req.params.documentId);
    const reviewerId = Number(req.user?.id);
    const comment = req.body.comment;
    const rejectedDocument = await rejectDocumentWorkflowService(documentId, reviewerId, comment)

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { rejectedDocument },
                "Document rejected successfully"
            )
        )
});

/**
 * @description Get workflow status
 * @route GET /api/v1/workflows/status
 * @access Private
 */
export const getWorkflowStatus = asyncHandler(async (req: Request, res: Response) => {

    const documentId = Number(req.params.documentId);
    const workflowStatus = await getWorkflowStatusService(documentId);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { workflowStatus },
                "Workflow status retrieved successfully"
            )
        )
});

/**
 * @description Cancel document workflow
 * @route POST /api/v1/workflows/documents/cancel
 * @access Private
*/
export const cancelDocumentWorkflow = asyncHandler(async (req: Request, res: Response) => {

    const documentId = Number(req.params.documentId);
    const cancelledById = Number(req.user?.id)
    const reason = req.body.reason;
    const cancelledDocument = await cancelDocumentWorkflowService(documentId, cancelledById, reason)

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { cancelledDocument },
                "Document cancelled successfully"
            )
        )
});

/**
 * @description Get workflows assigned to me
 * @route GET /api/v1/workflows/assigned-to-me
 * @access Private
 */
export const getWorkflowsAssignedToMe = asyncHandler(async (req: Request, res: Response) => {

    const reviewerId = Number(req.user?.id);
    const workflowsAssignedToMe = await getWorkflowsAssignedToMeService(reviewerId)

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { workflowsAssignedToMe },
                "Workflows assigned to me retrieved successfully"
            )
        )
});