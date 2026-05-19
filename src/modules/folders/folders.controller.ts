import asyncHandler from "../../utils/asyncHandler";
import { Request, Response } from "express";
import { ApiResponse } from "../../utils/ApiResponse";
import { moveFolderService } from "./folders.service";

export const getFolders = asyncHandler(async (req: Request, res: Response) => {

    res.status(200)
        .json(
            new ApiResponse(
                200,
                "Folders retrieved successfully"
            ));
});

export const getFolderById = asyncHandler(async (req: Request, res: Response) => {

    res.status(200)
        .json(
            new ApiResponse(
                200, "Folder retrieved successfully"
            )
        );
});

export const createFolder = asyncHandler(async (req: Request, res: Response) => {

    res.status(201)
        .json(
            new ApiResponse(
                201, "Folder created successfully"
            )
        );
});

export const updateFolder = asyncHandler(async (req: Request, res: Response) => {

    res.status(200)
        .json(
            new ApiResponse(
                200, "Folder updated successfully"
            )
        );
});

export const deleteFolder = asyncHandler(async (req: Request, res: Response) => {

    res.status(200)
        .json(
            new ApiResponse(
                200, "Folder deleted successfully"
            )
        );
});

export const moveFolder = asyncHandler(async (req: Request, res: Response) => {

    const { id } = req.params;
    const movedFolder = await moveFolderService(id, req.body);

    res.status(200)
        .json(
            new ApiResponse(
                200, movedFolder, "Folder moved successfully"
            )   
        );
});