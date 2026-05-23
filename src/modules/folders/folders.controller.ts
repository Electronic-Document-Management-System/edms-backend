import asyncHandler from "../../utils/asyncHandler";
import { Request, Response } from "express";
import { ApiResponse } from "../../utils/ApiResponse";
import { createFolderService, deleteFolderService, getFolderByIdService, getFoldersService, moveFolderService, updateFolderService } from "./folders.service";

/**
 * @description Retrieves all folders available in the system.
 * @route GET /api/tenant/folders
 * @access Private
 */
export const getFolders = asyncHandler(async (req: Request, res: Response) => {

    const folders = await getFoldersService();
    res.status(200)
        .json(
            new ApiResponse(
                200,
                folders,
                "Folders retrieved successfully"
            )
        );
});

/**
 * @description Retrieves a single folder by its unique ID.
 * @route GET /api/tenant/folders/:id
 * @access Private
 */
export const getFolderById = asyncHandler(async (req: Request, res: Response) => {

    const folderId = Number(req.params.id);
    const folder = await getFolderByIdService(folderId);

    res.status(200)
        .json(
            new ApiResponse(
                200,
                folder,
                "Folder retrieved successfully"
            )
        );
});

/**
 * @description Creates a new folder in the system.
 * @route POST /api/tenant/folders
 * @access Private
 */
export const createFolder = asyncHandler(async (req: Request, res: Response) => {

    const folder = req.body;
    const createdFolder = await createFolderService(folder);

    res.status(201)
        .json(
            new ApiResponse(
                201,
                createdFolder,
                "Folder created successfully"
            )
        );
});

/**
 * @description Updates an existing folder by its unique ID.
 * @route PATCH /api/tenant/folders/:id
 * @access Private
 */
export const updateFolder = asyncHandler(async (req: Request, res: Response) => {

    const folderId = Number(req.params.id);
    const folder = req.body;
    const updatedFolder = await updateFolderService(folderId, folder);
    res.status(200)
        .json(
            new ApiResponse(
                200,
                updatedFolder,
                "Folder updated successfully"
            )
        );
});

/**
 * @description Deletes an existing folder by its unique ID.
 * @route DELETE /api/tenant/folders/:id
 * @access Private
 */
export const deleteFolder = asyncHandler(async (req: Request, res: Response) => {
    const folderId = Number(req.params.id)
    const deletedFolder = await deleteFolderService(folderId);
    res.status(200)
        .json(
            new ApiResponse(
                200,
                deletedFolder,
                "Folder deleted successfully"
            )
        );
});

/**
 * @description Moves a folder to a new parent folder.
 * @route POST /api/tenant/folders/:id/move
 * @access Private
 */
export const moveFolder = asyncHandler(async (req: Request, res: Response) => {

    const folderId = Number(req.params.id);
    const newParentId = req.body.parent_id;
    const movedFolder = await moveFolderService(folderId, newParentId);

    res.status(200)
        .json(
            new ApiResponse(
                200,
                movedFolder,
                "Folder moved successfully"
            )
        );
});