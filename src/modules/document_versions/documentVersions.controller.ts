import { Request, Response } from "express"
import { ApiResponse } from "../../utils/ApiResponse"
import asyncHandler from "../../utils/asyncHandler"
import { createDocumentVersionService, getDocumentVersionByIdService, getDocumentVersionsService, restoreDocumentVersionService } from "./documentVersions.service"

export const getDocumentVersions = asyncHandler(async (req: Request, res: Response) => {
    const documentVersions = await getDocumentVersionsService();
    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                [],
                "Document versions retrieved successfully",
            )
        )
}
)

export const getDocumentVersionById = asyncHandler(async (req: Request, res: Response) => {
    const documentVersion = await getDocumentVersionByIdService();
    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                [],
                "Document version retrieved successfully",
            )
        )
})

export const createDocumentVersion = asyncHandler(async (req: Request, res: Response) => {

    const createdDocumentVersion = await createDocumentVersionService();
    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                createdDocumentVersion,
                "Document version created successfully",
            )
        )
})

export const restoreDocumentVersion = asyncHandler(async (req: Request, res: Response) => {

    const restoredDocumentVersion = await restoreDocumentVersionService();
    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                restoredDocumentVersion,
                "Document version restored successfully",
            )
        )
})