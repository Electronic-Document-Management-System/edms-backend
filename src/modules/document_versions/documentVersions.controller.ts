import { Request, Response } from "express"
import { ApiResponse } from "../../utils/ApiResponse"
import asyncHandler from "../../utils/asyncHandler"
import { createDocumentVersionService, getDocumentVersionByIdService, getDocumentVersionsService, restoreDocumentVersionService } from "./documentVersions.service"

/**
 * @description Get all versions of a document.
 * @route GET /api/v1/tenant/document/:documentId/versions
 * @access Private
 */
export const getDocumentVersions = asyncHandler(async (req: Request, res: Response) => {

    const documentId = Number(req.params.documentId);
    const documentVersions = await getDocumentVersionsService(documentId);
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                documentVersions,
                "Document versions retrieved successfully",
            )
        )
});

/**
 * @description Get a specific version of a document.
 * @route GET /api/v1/tenant/document/:documentId/versions/:versionId
 * @access Private
 */
export const getDocumentVersionById = asyncHandler(async (req: Request, res: Response) => {
    const documentId = Number(req.params.documentId);
    const versionId = Number(req.params.versionId);
    const documentVersion = await getDocumentVersionByIdService(documentId, versionId);
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                documentVersion,
                "Document version retrieved successfully",
            )
        )
});

/**
 * @description Create a new version of a document by uploading a revised file.
 * @route POST /api/v1/tenant/document/:documentId/versions
 * @access Private
 */
export const createDocumentVersion = asyncHandler(
  async (req: Request, res: Response) => {
    const documentId = Number(req.params.documentId);

    const uploadedById = Number(req.user?.id);
    const changeNote = req.body.changeNote;

    const version = await createDocumentVersionService(
      documentId,
      uploadedById,
      req.file,
      changeNote,
    );

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { version },
          'Document version created successfully',
        ),
      );
  },
);

/**
 * @description Restore a previous version of a document.
 * @route POST /api/v1/tenant/document/:documentId/versions/:versionId/restore
 * @access Private
 */
export const restoreDocumentVersion = asyncHandler(async (req: Request, res: Response) => {

    const documentId = Number(req.params.documentId);
    const versionId = Number(req.params.versionId);
    const restoredById = Number(req.user?.id);
    const changeNote = req.body.changeNote;
    const restoredDocumentVersion = await restoreDocumentVersionService(documentId, versionId, restoredById, changeNote);
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                restoredDocumentVersion,
                "Document version restored successfully",
            )
        )
});