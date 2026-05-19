import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import { downloadDocumentSharedLinkService, getSharedDocumentsService, removeShareService, shareDocumentService, viewDocumentSharedLinkService } from "./sharing.service";
import { ApiResponse } from "../../utils/ApiResponse";

export const shareDocument = asyncHandler(async (req: Request, res: Response) => {
    req.body;
    // sharedWithUserId
    // externalEmail
    // accessType: view/download
    // expiresAt
    // visibility: private/public

    const sharedDocument = await shareDocumentService();

    res.status(200).json(
        new ApiResponse(200, sharedDocument, "Document shared successfully")
    )
});

export const getSharedDocuments = asyncHandler(async (req: Request, res: Response) => {
    // document shareing list
    const sharedDocuments = await getSharedDocumentsService();

    res.status(200).json(
        new ApiResponse(200, sharedDocuments, "Shared documents retrieved successfully")
    )
});

export const removeShare = asyncHandler(async (req: Request, res: Response) => {
    // document share removal
    const removedShare = await removeShareService();

    res.status(200).json(
        new ApiResponse(200, removedShare, "Share removed successfully")
    )
});

export const viewDocumentSharedLink = asyncHandler(async (req: Request, res: Response) => {
    // document share view
    const viewedDocument = await viewDocumentSharedLinkService();

    res.status(200).json(
        new ApiResponse(200, viewedDocument, "Document viewed successfully")
    )
});

export const downloadDocumentSharedLink = asyncHandler(async (req: Request, res: Response) => {
    // document share download
    const downloadedDocument = await downloadDocumentSharedLinkService();

    res.status(200).json(
        new ApiResponse(200, downloadedDocument, "Document downloaded successfully")
    )
});
