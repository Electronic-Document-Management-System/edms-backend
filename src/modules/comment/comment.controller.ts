import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import { ApiResponse } from "../../utils/ApiResponse";
import { addDocumentCommentService, deleteCommentService, getDocumentCommentsService, updateCommentService } from "./comment.service";

export const getDocumentComments = asyncHandler(async (req: Request, res: Response) => {
    const comments = await getDocumentCommentsService();
    
    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                "Comments retrieved successfully"
            )
        );
})

export const addDocumentComment = asyncHandler(async (req: Request, res: Response) => {
    const comment = await addDocumentCommentService();

    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                "Comment added successfully"
            )
        );
})

export const updateComment = asyncHandler(async (req: Request, res: Response) => {
    const comment = await updateCommentService();
    
    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                "Comment updated successfully"
            )
        );
})

export const deleteComment = asyncHandler(async (req: Request, res: Response) => {
    const comment = await deleteCommentService();
    
    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                "Comment deleted successfully"
            )
        );
})

