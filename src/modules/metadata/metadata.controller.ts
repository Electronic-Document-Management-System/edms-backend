import asyncHandler from "../../utils/asyncHandler";
import { Request, Response } from "express";
import { addDocumentMetadataService, createMetadataFieldService, deleteMetadataFieldService, getDocumentMetadataService, getMetadataFieldByIdService, getMetadataFieldsService, removeDocumentMetadataService, updateDocumentMetadataService, updateMetadataFieldService } from "./metadata.service";
import { ApiResponse } from "../../utils/ApiResponse";

export const getAllMetadataFields = asyncHandler(async (req: Request, res: Response) => {
    const metadataFields = await getMetadataFieldsService();

    res.status(200).json(
        new ApiResponse(
            200,
            metadataFields,
            "Metadata fields retrieved successfully"
        )
    )
});

export const getMetadataFieldById = asyncHandler(async (req: Request, res: Response) => {
    const metadataField = await getMetadataFieldByIdService();

    res.status(200).json(
        new ApiResponse(
            200,
            metadataField,
            "Metadata field retrieved successfully"
        )
    )
});

export const createMetadataField = asyncHandler(async (req: Request, res: Response) => {
    const newMetadataField = await createMetadataFieldService();

    res.status(200).json(
        new ApiResponse(
            200,
            newMetadataField,
            "Metadata field created successfully"
        )
    )
});

export const updateMetadataField = asyncHandler(async (req: Request, res: Response) => {
    const updatedMetadataField = await updateMetadataFieldService();

    res.status(200).json(
        new ApiResponse(
            200,
            updatedMetadataField,
            "Metadata field updated successfully"
        )
    )
});

export const deleteMetadataField = asyncHandler(async (req: Request, res: Response) => {
    const deletedMetadataField = await deleteMetadataFieldService();

    res.status(200).json(
        new ApiResponse(
            200,
            deletedMetadataField,
            "Metadata field deleted successfully"
        )
    )
});

// Document metadata controllers

export const getDocumentMetadata = asyncHandler(async (req: Request, res: Response) => {
    const documentMetadata = await getDocumentMetadataService();

    res.status(200).json(
        new ApiResponse(
            200,
            documentMetadata,
            "Document metadata retrieved successfully"
        )
    )
});

export const addDocumentMetadata = asyncHandler(async (req: Request, res: Response) => {
    const documentMetadata = await addDocumentMetadataService();

    res.status(200).json(
        new ApiResponse(
            200,
            documentMetadata,
            "Document metadata retrieved successfully"
        )
    )
});

export const updateDocumentMetadata = asyncHandler(async (req: Request, res: Response) => {
    const updatedDocumentMetadata = await updateDocumentMetadataService();

    res.status(200).json(
        new ApiResponse(
            200,
            updatedDocumentMetadata,
            "Document metadata updated successfully"
        )
    )
});

export const removeDocumentMetadata = asyncHandler(async (req: Request, res: Response) => {
    const result = await removeDocumentMetadataService();

    res.status(200).json(
        new ApiResponse(
            200,
            result,
            "Document metadata removed successfully"
        )
    )
});
