import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import { ApiResponse } from "../../utils/ApiResponse";
import { approveDocumentService, assignReviewerService, createNewWorkflowService, finishWorkflowService, getAllworkflowsService, getWorkflowByIdService, getWorkflowStatusService, reassignReviewerService, rejectDocumentService, submitDocumentService, updateWorkflowService } from "./workflow.service";

export const getAllWorkflows = asyncHandler(async (req: Request, res: Response) => {

    const workflows = await getAllworkflowsService()

    res.status(200).json(
        new ApiResponse(200, workflows, "Workflows retrieved successfully")
    )
});

export const getWorkflows = asyncHandler(async (req: Request, res: Response) => {

    const workflows = await getAllworkflowsService()

    res.status(200).json(
        new ApiResponse(200, workflows, "Workflows retrieved successfully")
    )
});

export const getWorkflowById = asyncHandler(async (req: Request, res: Response) => {

    const workflowId = Number(req.params.id);
    const workflow = await getWorkflowByIdService(workflowId)

    res.status(200).json(
        new ApiResponse(200, workflow, "Workflow retrieved successfully")
    )
});

export const createNewWorkflow = asyncHandler(async (req: Request, res: Response) => {

    req.body;
    const newWorkflow = await createNewWorkflowService()

    res.status(200).json(
        new ApiResponse(200, newWorkflow, "Workflow created successfully")
    )
});

export const updateWorkflow = asyncHandler(async (req: Request, res: Response) => {

    const workflowId = Number(req.params.id);
    const updatedWorkflow = await updateWorkflowService(workflowId)

    res.status(200).json(
        new ApiResponse(200, updatedWorkflow, "Workflow updated successfully")
    )
});

export const finishWorkflow = asyncHandler(async (req: Request, res: Response) => {

    const workflowId = Number(req.params.id);
    const finishedWorkflow = await finishWorkflowService(workflowId)

    res.status(200).json(
        new ApiResponse(200, finishedWorkflow, "Workflow finished successfully")
    )
});


// Document workflow endpoints
export const submitDocument = asyncHandler(async (req: Request, res: Response) => {

    req.body;
    const submittedDocument = await submitDocumentService()

    res.status(200).json(
        new ApiResponse(200, submittedDocument, "Document submitted successfully")
    )
});

export const approveDocument = asyncHandler(async (req: Request, res: Response) => {

    req.body;
    const approvedDocument = await approveDocumentService()

    res.status(200).json(
        new ApiResponse(200, approvedDocument, "Document approved successfully")
    )
});

export const rejectDocument = asyncHandler(async (req: Request, res: Response) => {

    req.body;
    const rejectedDocument = await rejectDocumentService()

    res.status(200).json(
        new ApiResponse(200, rejectedDocument, "Document rejected successfully")
    )
});

export const assignReviewer = asyncHandler(async (req: Request, res: Response) => {

    const assignedReviewer = await assignReviewerService()

    res.status(200).json(
        new ApiResponse(200, assignedReviewer, "Reviewer assigned successfully")
    )
});

export const reassignReviewer = asyncHandler(async (req: Request, res: Response) => {

    const reassignedReviewer = await reassignReviewerService()

    res.status(200).json(
        new ApiResponse(200, reassignedReviewer, "Reviewer reassigned successfully")
    )
});

export const getWorkflowStatus = asyncHandler(async (req: Request, res: Response) => {

    const workflowStatus = await getWorkflowStatusService()

    res.status(200).json(
        new ApiResponse(200, workflowStatus, "Workflow status retrieved successfully")
    )
});