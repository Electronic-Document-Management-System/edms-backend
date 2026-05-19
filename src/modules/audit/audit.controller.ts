import { ApiResponse } from "../../utils/ApiResponse";
import asyncHandler from "../../utils/asyncHandler";
import { Request, Response } from "express";
import { getAuditLogsService, getAuditLogByIdService, getAuditLogByDocumentIdService } from "./audit.service";

export const getAuditLogs = asyncHandler(async (req: Request, res: Response) => {

    const auditLogs = await getAuditLogsService();
    res.status(200).json(
        new ApiResponse(
            200,
            { auditLogs },
            "Audit logs retrieved successfully"
        )
    );
});

export const getAuditLogById = asyncHandler(async (req: Request, res: Response) => {
    const auditLog = await getAuditLogByIdService();
    res.status(200).json(
        new ApiResponse(
            200,
            { auditLog },
            "Audit log retrieved successfully"
        )
    );
});

export const getAuditLogByDocumentId = asyncHandler(async (req: Request, res: Response) => {
    const auditLog = await getAuditLogByDocumentIdService();
    res.status(200).json(
        new ApiResponse(
            200,
            { auditLog },
            "Audit log retrieved successfully"
        )
    );
});


