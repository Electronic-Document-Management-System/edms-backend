import { Request, Response } from "express";
import { ApiResponse } from "../../utils/ApiResponse";
import asyncHandler from "../../utils/asyncHandler";
import { archiveDocumentService, createNewDocumentService, downloadDocumentService, getAllDocumentsService, getDocumentByIdService, removeDocumentService, restoreDocumentService, searchDocumentsService, updateDocumentService } from "./document.service";

export const getAllDocuments = asyncHandler(async (req: Request, res: Response) => {

    const allDocuments = await getAllDocumentsService();

    res
        .status(200)
        .json(new ApiResponse(200, 'All documents retrieved successfully'));
});

export const getDocumentById = asyncHandler(async (req: Request, res: Response) => {

    const documentId = Number(req.params.id);
    const document = await getDocumentByIdService(documentId);

    res
        .status(200)
        .json(new ApiResponse(200, document, 'Document retrieved successfully'));
});

export const createNewDocument = asyncHandler(async (req: Request, res: Response) => {

    const { title, description, file } = req.body;
    const newDocument = await createNewDocumentService();

    res
        .status(201)
        .json(new ApiResponse(201, 'All documents retrieved successfully'));
});

export const updateDocument = asyncHandler(async (req: Request, res: Response) => {

    const documentId = Number(req.params.id);
    const updatedDocument = await updateDocumentService(documentId);

    res
        .status(200)
        .json(new ApiResponse(200, updatedDocument, 'Document updated successfully'));
});

export const removeDocument = asyncHandler(async (req: Request, res: Response) => {

    const documentId = Number(req.params.id);
    const removedDocument = await removeDocumentService(documentId);

    res
        .status(200)
        .json(new ApiResponse(200, removedDocument, 'Document removed successfully'));
});

export const archiveDocument = asyncHandler(async (req: Request, res: Response) => {

    const documentId = Number(req.params.id);
    const archivedDocument = await archiveDocumentService(documentId);

    res
        .status(200)
        .json(new ApiResponse(200, archivedDocument, 'Document archived successfully'));
});

export const downloadDocument = asyncHandler(async (req: Request, res: Response) => {

    const documentId = Number(req.params.id);
    const downloadedDocument = await downloadDocumentService(documentId);

    res
        .status(200)
        .json(new ApiResponse(200, downloadedDocument, 'Document downloaded successfully'));
});

export const restoreDocument = asyncHandler(async (req: Request, res: Response) => {

    const documentId = Number(req.params.id);
    const restoredDocument = await restoreDocumentService(documentId);

    res
        .status(200)
        .json(new ApiResponse(200, restoredDocument, 'Document restored successfully'));
});

export const searchDocuments = asyncHandler(async (req: Request, res: Response) => {

    const searchedDocuments = await searchDocumentsService();

    res
        .status(200)
        .json(new ApiResponse(200, searchedDocuments, 'Documents searched successfully'));
});
