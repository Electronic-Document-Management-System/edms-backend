import { Request, Response } from "express";
import { ApiResponse } from "@/utils/ApiResponse";
import asyncHandler from "@/utils/asyncHandler";
import {
    archiveDocumentService,
    downloadDocumentService,
    getAllDocumentsService,
    getDocumentByIdService,
    removeDocumentService,
    restoreDocumentService,
    searchDocumentsService,
    updateDocumentService,
    uploadBulkDocumentsService,
    uploadSingleDocumentService
} from "./document.service";
import ApiError from "@/utils/ApiError";

/**
 * @description Retrieves all documents from PostgreSQL.
 * @route GET /api/documents
 * @access Private
 */
export const getAllDocuments = asyncHandler(async (req: Request, res: Response) => {

    const departmentId = req.query.departmentId
      ? Number(req.query.departmentId)
      : undefined;

    const folderId = req.query.folderId
      ? Number(req.query.folderId)
      : undefined;

    const search = req.query.search as string | undefined;
    const status = req.query.status as string | undefined;

    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 20;

    const allDocuments = await getAllDocumentsService({ departmentId, folderId, search, status, page, limit, user: req.user });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { documents: allDocuments },
                'All documents retrieved successfully'
            )
        );
});

/**
 * @description Retrieves a document by ID from PostgreSQL.
 * @route GET /api/documents/:id
 * @access Private
 */
export const getDocumentById = asyncHandler(async (req: Request, res: Response) => {

    const documentId = Number(req.params.id);
    const document = await getDocumentByIdService(documentId);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { document },
                'Document retrieved successfully'
            )
        );
});

/**
 * @description Uploads a document file to MinIO and stores document metadata in PostgreSQL.
 * @route POST /api/documents
 * @access Private
 */
export const uploadDocument = asyncHandler(async (req: Request, res: Response) => {

    if (!req.user?.id) {
        throw new ApiError(401, "Unauthorized request");
    };
    const uploaded_by = Number(req.user.id);
    const { title, description, dept_id, folder_id } = req.body;

    const deptId = Number(dept_id);
    const folderId = Number(folder_id);
    const uploadedBy = Number(uploaded_by);
    if (Number.isNaN(deptId)) {
        throw new ApiError(400, "Department ID must be a number");
    }
    if (Number.isNaN(folderId)) {
        throw new ApiError(400, "Folder ID must be a number");
    };

    const newDocument = await uploadSingleDocumentService({ title, description, dept_id: deptId, folder_id: folderId, uploaded_by: uploadedBy }, req.file);

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                { document: newDocument },
                'Document created successfully'
            )
        );
});

/**
 * @description Uploads multiple document files to MinIO and stores document metadata in PostgreSQL.
 * @route POST /api/documents/bulk
 * @access Private
 */
export const uploadBulkDocuments = asyncHandler(async (req: Request, res: Response) => {

    if (!req.user?.id) {
        throw new ApiError(401, "Unauthorized request");
    };
    const uploaded_by = Number(req.user.id);
    const { title, description, dept_id, folder_id } = req.body;

    const deptId = Number(dept_id);
    const folderId = Number(folder_id);
    if (Number.isNaN(deptId)) {
        throw new ApiError(400, "Department ID must be a number");
    }
    if (Number.isNaN(folderId)) {
        throw new ApiError(400, "Folder ID must be a number");
    };

    const newDocuments = await uploadBulkDocumentsService({
        title, description, dept_id: deptId, folder_id: folderId, uploaded_by
    }, req.files as Express.Multer.File[]);

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                { documents: newDocuments },
                'Documents uploaded successfully'
            )
        );
});

/**
 * @description Updates a document's metadata.
 * @route PUT /api/documents/:id
 * @access Private
 */
export const updateDocument = asyncHandler(
    async (req: Request, res: Response) => {
        const documentId = Number(req.params.id);

        if (Number.isNaN(documentId)) {
            throw new ApiError(400, 'Invalid document ID.');
        }

        const { title, description, dept_id, folder_id } = req.body;

        const updateData: any = {};

        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;

        if (dept_id !== undefined) {
            const deptId = Number(dept_id);

            if (Number.isNaN(deptId)) {
                throw new ApiError(400, 'Invalid department ID.');
            }

            updateData.dept_id = deptId;
        }

        if (folder_id !== undefined) {
            const folderId = Number(folder_id);

            if (Number.isNaN(folderId)) {
                throw new ApiError(400, 'Invalid folder ID.');
            }

            updateData.folder_id = folderId;
        }

        const updatedDocument = await updateDocumentService(documentId, updateData);

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    { document: updatedDocument },
                    'Document updated successfully',
                ),
            );
    },
);

/**
 * @description Removes a document from MinIO and PostgreSQL.
 * @route DELETE /api/documents/:id
 * @access Private
 */
export const removeDocument = asyncHandler(async (req: Request, res: Response) => {

    const documentId = Number(req.params.id);
    const userId = req.user?.id;
    const removedDocument = await removeDocumentService(documentId, userId!);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { document: removedDocument },
                'Document removed successfully'
            )
        );
});

/**
 * @description Archives a document in PostgreSQL.
 * @route POST /api/documents/:id/archive
 * @access Private
 */
export const archiveDocument = asyncHandler(async (req: Request, res: Response) => {

    const documentId = Number(req.params.id);
    const userId = req.user?.id;
    const archivedDocument = await archiveDocumentService(documentId, userId!);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { document: archivedDocument },
                'Document archived successfully'
            )
        );
});

/**
 * @description Downloads a document from MinIO.
 * @route GET /api/documents/:id/download
 * @access Private
 */
export const downloadDocument = asyncHandler(
  async (req: Request, res: Response) => {
    const documentId = Number(req.params.id);

    if (Number.isNaN(documentId)) {
      throw new ApiError(400, 'Invalid document ID.');
    }

    const { document, fileStream } = await downloadDocumentService(documentId);

    res.setHeader(
      'Content-Type',
      document.mimeType || 'application/octet-stream',
    );

    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${encodeURIComponent(document.originalName)}"`,
    );

    fileStream.on('error', (error) => {
      console.error('File stream error:', error);

      if (!res.headersSent) {
        res.status(500).json({
          statusCode: 500,
          message: 'File stream failed.',
          success: false,
          errors: [],
        });
      }
    });

    fileStream.pipe(res);
  },
);

/**
 * @description Restores a document in PostgreSQL.
 * @route POST /api/documents/:id/restore
 * @access Private
 */
export const restoreDocument = asyncHandler(async (req: Request, res: Response) => {

    const documentId = Number(req.params.id);
    const restoredDocument = await restoreDocumentService(documentId);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { document: restoredDocument },
                'Document restored successfully'
            )
        );
});

export const searchDocuments = asyncHandler(async (req: Request, res: Response) => {

    const searchedDocuments = await searchDocumentsService();

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                searchedDocuments,
                'Documents searched successfully'
            )
        );
});
