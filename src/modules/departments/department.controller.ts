import asyncHandler from "../../utils/asyncHandler";
import { Request, Response } from "express";
import { createNewDepartmentService, deleteDepartmentService, getAllDepartmentsService, getDepartmentByIdService, updateDepartmentService } from "./department.service";
import { ApiResponse } from "../../utils/ApiResponse";

export const getAllDepartments = asyncHandler(async (req: Request, res: Response) => {
    const departments = await getAllDepartmentsService();

    res
        .status(200)
        .json(new ApiResponse(
            200,
            { departments },
            "Departments retrieved successfully"
        ))
});

export const getDepartmentById = asyncHandler(async (req: Request, res: Response) => {

    const { id } = req.params;

    const department = await getDepartmentByIdService(id);

    res
        .status(200)
        .json(new ApiResponse(
            200,
            { department },
            "Department retrieved successfully"
        ))
});

export const createNewDepartment = asyncHandler(async (req: Request, res: Response) => {

    const department = await createNewDepartmentService();

    res
        .status(201)
        .json(new ApiResponse(
            201,
            { department },
            "Department created successfully"
        ))
});

export const updateDepartment = asyncHandler(async (req: Request, res: Response) => {

    const { id } = req.params;
    const updatedDepartment = await updateDepartmentService(id)
    res
        .status(201)
        .json(new ApiResponse(
            201,
            { department: updatedDepartment },
            "Department updated successfully"
        ));

});

export const deleteDepartment = asyncHandler(async (req: Request, res: Response) => {

    const { id } = req.params;
    const deletedDepartment = await deleteDepartmentService(id)

    res
        .status(200)
        .json(new ApiResponse(
            200,
            {  },
            "Department updated successfully"
        ));
});
