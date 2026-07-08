import { Request, Response } from "express";
import asyncHandler from "@/utils/asyncHandler";
import { ApiResponse } from "@/utils/ApiResponse";
import { addDocumentCommentService, deleteCommentService, getDocumentCommentsService, updateCommentService } from "./comment.service";

/**
 * @description Get all comments for a document
 * @route GET /api/v1/comments/:documentId
 * @access Private
 */
export const getDocumentComments = asyncHandler(async (req: Request, res: Response) => {
    const documentId = Number(req.params.documentId);

    const comments = await getDocumentCommentsService(documentId);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { comments },
                "Comments retrieved successfully"
            )
        );
})

/**
 * @description Add a comment to a document
 * @route POST /api/v1/comments/:documentId
 * @access Private
 */
export const addDocumentComment = asyncHandler(async (req: Request, res: Response) => {
    const documentId = Number(req.params.documentId);
    const userId = Number(req.user?.id);
    const content = req.body.content;

    const comment = await addDocumentCommentService({
        documentId,
        userId,
        content,
    });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { comment },
                "Comment added successfully"
            )
        );
})

/**
 * @description Update a comment
 * @route PUT /api/v1/comments/:id
 * @access Private
 */
export const updateComment = asyncHandler(async (req: Request, res: Response) => {
    const commentId = Number(req.params.commentId)
    const userId = Number(req.user?.id)
    const content = req.body.content;

    const comment = await updateCommentService({ userId, commentId, content });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { comment },
                "Comment updated successfully"
            )
        );
})

/**
 * @description Delete a comment
 * @route DELETE /api/v1/comments/:id
 * @access Private
 */
export const deleteComment = asyncHandler(async (req: Request, res: Response) => {
    const commentId = Number(req.params.commentId);
    const userId = Number(req.user?.id);

    const comment = await deleteCommentService({ commentId, userId });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { comment },
                "Comment deleted successfully"
            )
        );
})

