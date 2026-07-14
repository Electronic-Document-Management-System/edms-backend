import { Request, Response } from "express";
import asyncHandler from "@/utils/asyncHandler";
import { ApiResponse } from "@/utils/ApiResponse";
import { viewDocumentsReportService, viewDepartmentsReportService, viewWorkflowsReportService, exportDepartmentsReportService, exportAuditReportService, viewAuditReportService, exportWorkflowsReportService, exportDocumentsReportService } from "./report.service";
import { AuditAction, DocumentStatus, WorkflowStatus } from "@prisma/client";

export const viewDocumentsReport = asyncHandler(async (req: Request, res: Response) => {

    const departmentId = Number(req.query.departmentId);
    const status = req.query.status as string;
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;
    const documentReport = await viewDocumentsReportService({
        departmentId,
        status: status as DocumentStatus,
        endDate,
        startDate
    });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                documentReport,
                "Documents report fetched successfully"
            )
        )
});

export const viewDepartmentsReport = asyncHandler(async (req: Request, res: Response) => {

    const departmentsReport = await viewDepartmentsReportService();

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                departmentsReport,
                "Departments report fetched successfully"
            )
        )
});

export const viewWorkflowsReport = asyncHandler(async (req: Request, res: Response) => {

    const status = req.query.status ? String(req.query.status) : undefined;
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;
    const workflowsReport = await viewWorkflowsReportService({
        status: status?.toUpperCase() as WorkflowStatus,
        startDate,
        endDate
    })

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                workflowsReport,
                "Workflows report fetched successfully"
            )
        )
});

export const viewAuditReport = asyncHandler(async (req: Request, res: Response) => {

    const userId = req.user?.id
    const resource = req.query.resource ? (req.query.resource as string).toUpperCase() : undefined;
    const action = req.query.action ? (req.query.action as string).toUpperCase() as AuditAction : undefined;
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;
    const auditReport = await viewAuditReportService({
        userId,
        resource,
        action,
        startDate,
        endDate
    });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                auditReport,
                "Audit report fetched successfully"
            )
        )
});

export const exportDocumentsReport = asyncHandler(async (req: Request, res: Response) => {
    const departmentId = req.query.departmentId ? Number(req.query.departmentId) : undefined;
    const format = (req.query.format as 'csv' | 'pdf') || 'csv';
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;
    const status = req.query.status
        ? (String(req.query.status).toUpperCase() as DocumentStatus)
        : undefined;

    await exportDocumentsReportService(
        res,
        { departmentId, startDate, endDate, status },
        format
    );
});

export const exportDepartmentsReport = asyncHandler(async (req: Request, res: Response) => {

    const format = (req.query.format as 'csv' | 'pdf') || 'csv';
    await exportDepartmentsReportService(res, format);

});

export const exportWorkflowReport = asyncHandler(async (req: Request, res: Response) => {
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;
    const status = req.query.status
        ? (String(req.query.status).toUpperCase() as WorkflowStatus)
        : undefined;
    const format = (req.query.format as 'csv' | 'pdf') || 'csv';
    await exportWorkflowsReportService(res, { endDate, startDate, status }, format);
});

export const exportAuditReport = asyncHandler(async (req: Request, res: Response) => {
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;
    const action = req.query.action ? String(req.query.action) as AuditAction : undefined;
    const resource = req.query.resource ? String(req.query.resource) : undefined;
    const format = (req.query.format as 'csv' | 'pdf') || 'csv';
    await exportAuditReportService(res, { startDate, endDate, action, resource }, format)

});