import { ApiResponse } from "@/utils/ApiResponse";
import asyncHandler from "@/utils/asyncHandler";
import { Request, Response } from "express";
import { getAuditLogByIdService, getAllAuditLogsService } from "./audit.service";
import { AuditAction } from "@prisma/client";

/**
 * @description Get all audit logs with pagination and filtering
 * @route GET /api/v1/audit/logs
 * @access Private
 */
export const getAuditLogs = asyncHandler(async (req: Request, res: Response) => {

    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 20;
    const action = req.query.action as AuditAction;
    const resource = req.query.resource as string;
    const resourceId = req.query.resourceId ? Number(req.query.resourceId) : undefined;
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;
    const userId = req.query.userId ? Number(req.query.userId) : undefined;
    
    const auditLogs = await getAllAuditLogsService({ page, limit, action, resource, userId, resourceId, startDate, endDate });
    
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { auditLogs },
                "Audit logs retrieved successfully"
            )
        );
});

/**
 * @description Get audit log by ID
 * @route GET /api/v1/audit/logs/:logId
 * @access Private
 */
export const getAuditLogById = asyncHandler(async (req: Request, res: Response) => {

    const logId = Number(req.params.logId);
    const auditLog = await getAuditLogByIdService(logId);
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { auditLog },
                "Audit log retrieved successfully"
            )
        );
});
