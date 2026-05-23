import asyncHandler from "../../utils/asyncHandler";
import { Request, Response } from "express";
import { createNewDepartmentService, deleteDepartmentService, getAllDepartmentsService, getDepartmentByIdService, updateDepartmentService } from "./department.service";
import { ApiResponse } from "../../utils/ApiResponse";

export const getAllDepartments = asyncHandler(async (req: Request, res: Response) => {
    const departments = await getAllDepartmentsService();

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            { departments },
            "Departments retrieved successfully"
        ))
});

export const getDepartmentById = asyncHandler(async (req: Request, res: Response) => {

    const deptartmentId = Number(req.params.id);

    const department = await getDepartmentByIdService(deptartmentId);

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            { department },
            "Department retrieved successfully"
        ))
});

export const createNewDepartment = asyncHandler(async (req: Request, res: Response) => {

    const departmentData = req.body;
    const department = await createNewDepartmentService(departmentData);

    return res
        .status(201)
        .json(new ApiResponse(
            201,
            { department },
            "Department created successfully"
        ))
});

export const updateDepartment = asyncHandler(async (req: Request, res: Response) => {

    const deptId = Number(req.params.id);
    const departmentData = req.body;

    const updatedDepartment = await updateDepartmentService(deptId, departmentData)
    return res
        .status(201)
        .json(new ApiResponse(
            201,
            { department: updatedDepartment },
            "Department updated successfully"
        ));

});

export const deleteDepartment = asyncHandler(async (req: Request, res: Response) => {

    const deptartmentId = Number(req.params.id);
    const deletedDepartment = await deleteDepartmentService(deptartmentId)

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            { department: deletedDepartment },
            "Department deleted successfully"
        ));
});
