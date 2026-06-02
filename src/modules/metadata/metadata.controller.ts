import asyncHandler from '@/utils/asyncHandler';
import { Request, Response } from 'express';
import {
  addDocumentMetadataService,
  createMetadataFieldService,
  deleteMetadataFieldService,
  getDocumentMetadataService,
  getMetadataFieldByIdService,
  getAllMetadataFieldsService,
  removeDocumentMetadataService,
  updateDocumentMetadataService,
  updateMetadataFieldService,
} from './metadata.service';
import { ApiResponse } from '@/utils/ApiResponse';
import ApiError from '@/utils/ApiError';

/**
 * @description Get all metadata fields defined in the system.
 * @route GET /api/metadata/fields
 * @access Private
 */
export const getAllMetadataFields = asyncHandler(
  async (_req: Request, res: Response) => {
    const metadataFields = await getAllMetadataFieldsService();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { metadataFields },
          'Metadata fields retrieved successfully',
        ),
      );
  },
);

/**
 * @description Get a single metadata field by ID.
 * @route GET /api/metadata/fields/:id
 * @access Private
 */
export const getMetadataFieldById = asyncHandler(
  async (req: Request, res: Response) => {
    const metadataFieldId = Number(req.params.id);

    if (Number.isNaN(metadataFieldId)) {
      throw new ApiError(400, 'Invalid metadata field ID.');
    }

    const metadataField = await getMetadataFieldByIdService(metadataFieldId);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { metadataField },
          'Metadata field retrieved successfully',
        ),
      );
  },
);

/**
 * @description Create a new metadata field definition.
 * @route POST /api/metadata/fields
 * @access Private
 */
export const createMetadataField = asyncHandler(
  async (req: Request, res: Response) => {
    const metadataFieldData = req.body;

    const metadataField =
      await createMetadataFieldService(metadataFieldData);

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { metadataField },
          'Metadata field created successfully',
        ),
      );
  },
);

/**
 * @description Update an existing metadata field definition.
 * @route PATCH /api/metadata/fields/:id
 * @access Private
 */
export const updateMetadataField = asyncHandler(
  async (req: Request, res: Response) => {
    const metadataFieldId = Number(req.params.id);

    if (Number.isNaN(metadataFieldId)) {
      throw new ApiError(400, 'Invalid metadata field ID.');
    }

    const metadataFieldData = req.body;

    const metadataField = await updateMetadataFieldService(
      metadataFieldId,
      metadataFieldData,
    );

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { metadataField },
          'Metadata field updated successfully',
        ),
      );
  },
);

/**
 * @description Delete a metadata field definition if it is not used by any document metadata.
 * @route DELETE /api/metadata/fields/:id
 * @access Private
 */
export const deleteMetadataField = asyncHandler(
  async (req: Request, res: Response) => {
    const metadataFieldId = Number(req.params.id);

    if (Number.isNaN(metadataFieldId)) {
      throw new ApiError(400, 'Invalid metadata field ID.');
    }

    const metadataField =
      await deleteMetadataFieldService(metadataFieldId);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { metadataField },
          'Metadata field deleted successfully',
        ),
      );
  },
);

// Document metadata controllers

/**
 * @description Get all metadata values assigned to a document.
 * @route GET /api/documents/:documentId/metadata
 * @access Private
 */
export const getDocumentMetadata = asyncHandler(
  async (req: Request, res: Response) => {
    const documentId = Number(req.params.documentId);

    if (Number.isNaN(documentId)) {
      throw new ApiError(400, 'Invalid document ID.');
    }

    const documentMetadata = await getDocumentMetadataService(documentId);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { documentMetadata },
          'Document metadata retrieved successfully',
        ),
      );
  },
);

/**
 * @description Add a metadata value to a document.
 * @route POST /api/documents/:documentId/metadata
 * @access Private
 */
export const addDocumentMetadata = asyncHandler(
  async (req: Request, res: Response) => {
    const documentId = Number(req.params.documentId);

    if (Number.isNaN(documentId)) {
      throw new ApiError(400, 'Invalid document ID.');
    }

    const metadataInput = req.body;

    const documentMetadata = await addDocumentMetadataService(
      documentId,
      metadataInput,
    );

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { documentMetadata },
          'Document metadata added successfully',
        ),
      );
  },
);

/**
 * @description Update a specific metadata value assigned to a document.
 * @route PATCH /api/documents/:documentId/metadata/:metadataFieldId
 * @access Private
 */
export const updateDocumentMetadata = asyncHandler(
  async (req: Request, res: Response) => {
    const documentId = Number(req.params.documentId);
    const metadataFieldId = Number(req.params.metadataFieldId);
    const { value } = req.body;

    if (Number.isNaN(documentId)) {
      throw new ApiError(400, 'Invalid document ID.');
    }

    if (Number.isNaN(metadataFieldId)) {
      throw new ApiError(400, 'Invalid metadata field ID.');
    }

    const documentMetadata = await updateDocumentMetadataService(
      documentId,
      metadataFieldId,
      value,
    );

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { documentMetadata },
          'Document metadata updated successfully',
        ),
      );
  },
);

/**
 * @description Remove a specific metadata value from a document.
 * @route DELETE /api/documents/:documentId/metadata/:metadataFieldId
 * @access Private
 */
export const removeDocumentMetadata = asyncHandler(
  async (req: Request, res: Response) => {
    const documentId = Number(req.params.documentId);
    const metadataFieldId = Number(req.params.metadataFieldId);

    if (Number.isNaN(documentId)) {
      throw new ApiError(400, 'Invalid document ID.');
    }

    if (Number.isNaN(metadataFieldId)) {
      throw new ApiError(400, 'Invalid metadata field ID.');
    }

    const documentMetadata = await removeDocumentMetadataService(
      documentId,
      metadataFieldId,
    );

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { documentMetadata },
          'Document metadata removed successfully',
        ),
      );
  },
);