import asyncHandler from '../../utils/asyncHandler';
import { Request, Response } from 'express';
import {
    createNewDepartmentService,
    deleteDepartmentService,
    getAllDepartmentsService,
    getDepartmentByIdService,
    updateDepartmentService,
} from './department.service';
import { ApiResponse } from '../../utils/ApiResponse';

/**
 * @description Retrieves all departments available in the system.
 * @route GET /api/tenant/departments
 * @access Private
 */
export const getAllDepartments = asyncHandler(async (_req: Request, res: Response) => {
    const departments = await getAllDepartmentsService();

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { departments },
                'Departments retrieved successfully',
            ),
        );
},
);

/**
 * @description Retrieves a single department by its unique ID.
 * @route GET /api/tenant/departments/:id
 * @access Private
 */
export const getDepartmentById = asyncHandler(async (req: Request, res: Response) => {
    const departmentId = Number(req.params.id);

    const department = await getDepartmentByIdService(departmentId);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { department },
                'Department retrieved successfully',
            ),
        );
},
);

/**
 * @description Creates a new department inside the tenant/system.
 * @route POST /api/tenant/departments
 * @access Private
 */
export const createNewDepartment = asyncHandler(async (req: Request, res: Response) => {
    const departmentData = req.body;

    const department = await createNewDepartmentService(departmentData);

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                { department },
                'Department created successfully',
            ),
        );
},
);

/**
 * @description Updates an existing department by its unique ID.
 * @route PATCH /api/tenant/departments/:id
 * @access Private
 */
export const updateDepartment = asyncHandler(async (req: Request, res: Response) => {
    const departmentId = Number(req.params.id);
    const departmentData = req.body;

    const updatedDepartment = await updateDepartmentService(
        departmentId,
        departmentData,
    );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { department: updatedDepartment },
                'Department updated successfully',
            ),
        );
},
);

/**
 * @description Deletes an existing department by its unique ID.
 * @route DELETE /api/tenant/departments/:id
 * @access Private
 */
export const deleteDepartment = asyncHandler(async (req: Request, res: Response) => {
    const departmentId = Number(req.params.id);

    const deletedDepartment = await deleteDepartmentService(departmentId);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { department: deletedDepartment },
                'Department deleted successfully',
            ),
        );
},
);