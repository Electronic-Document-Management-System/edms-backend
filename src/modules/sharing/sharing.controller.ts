import { Request, Response } from "express";
import asyncHandler from "@/utils/asyncHandler";
import { getDocumentsSharedWithMeService, removeShareService, shareDocumentService, getDocumentSharesService } from "./sharing.service";
import { ApiResponse } from "@/utils/ApiResponse";

export const shareDocument = asyncHandler(async (req: Request, res: Response) => {
    // sharedWithUserId
    // externalEmail
    // accessType: view/download
    // expiresAt
    // visibility: private/public
    const shareData = req.body;
    const sharedByUserId = Number(req.user?.id);
    const documentId = Number(req.params.documentId)
    const sharedDocument = await shareDocumentService(documentId, sharedByUserId, shareData);

    return res.status(200).json(
        new ApiResponse(
            200,
            { sharedDocument },
            "Document shared successfully"
        )
    )
});

export const getDocumentsSharedWithMe = asyncHandler(async (req: Request, res: Response) => {
    // document sharing list
    const userId = Number(req.user?.id);
    const sharedDocuments = await getDocumentsSharedWithMeService(userId);

    return res.status(201).json(
        new ApiResponse(
            201,
            { sharedDocuments },
            "Shared documents retrieved successfully"
        )
    )
});

export const getDocumentShares = asyncHandler(async (req: Request, res: Response) => {
    // document share view
    const documentId = Number(req.params.documentId);
    const shares = await getDocumentSharesService(documentId);

    return res.status(201).json(
        new ApiResponse(
            201,
            { shares },
            "Document shares retrieved successfully"
        )
    )
});

export const removeShare = asyncHandler(async (req: Request, res: Response) => {
    // document share removal
    const documentId = Number(req.params.documentId);
    const shareId = Number(req.params.shareId);
    const revokedByUserId = Number(req.user?.id);
    const removedShare = await removeShareService(documentId, shareId, revokedByUserId);

    return res.status(200).json(
        new ApiResponse(
            200,
            { removedShare },
            "Share removed successfully"
        )
    )
});

// export const downloadDocumentSharedLink = asyncHandler(async (req: Request, res: Response) => {
//     // document share download
//     const downloadedDocument = await downloadDocumentSharedLinkService();

//     return res.status(200).json(
//         new ApiResponse(200, downloadedDocument, "Document downloaded successfully")
//     )
// });
