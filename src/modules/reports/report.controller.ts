import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import { ApiResponse } from "../../utils/ApiResponse";
import { viewDocumentsReportService, viewDepartmentsReportService, viewWorkflowsReportService, exportDepartmentsReportService, exportAuditReportService, viewAuditReportService } from "./report.service";

export const viewDocumentsReport = asyncHandler(async (req: Request, res: Response) => {

    const documentReport = await viewDocumentsReportService();

    res
        .status(200)
        .json(
            new ApiResponse(200, documentReport, "Documents report fetched successfully")
        )
});

export const viewDepartmentsReport = asyncHandler(async (req: Request, res: Response) => {

    const departmentsReport = await viewDepartmentsReportService();

    res
        .status(200)
        .json(
            new ApiResponse(200, departmentsReport, "Departments report fetched successfully")
        )
});

export const viewWorkflowsReport = asyncHandler(async (req: Request, res: Response) => {

    const workflowsReport = await viewWorkflowsReportService();

    res
        .status(200)
        .json(
            new ApiResponse(200, workflowsReport, "Workflows report fetched successfully")
        )
});


export const viewAuditReport = asyncHandler(async (req: Request, res: Response) => {

    const auditReport = await viewAuditReportService();

    res
        .status(200)
        .json(
            new ApiResponse(200, auditReport, "Audit report fetched successfully")
        )
});



export const exportDocumentsReport = asyncHandler(async (req: Request, res: Response) => {

    const documentReport = await viewDocumentsReportService();

    res
        .status(200)
        .json(
            new ApiResponse(200, documentReport, "Documents report fetched successfully")
        )
});

export const exportDepartmentsReport = asyncHandler(async (req: Request, res: Response) => {

    const departmentsReport = await exportDepartmentsReportService();

    res
        .status(200)
        .json(
            new ApiResponse(200, departmentsReport, "Departments report fetched successfully")
        )
});


export const exportAuditReport = asyncHandler(async (req: Request, res: Response) => {

    const auditReport = await exportAuditReportService();

    res
        .status(200)
        .json(
            new ApiResponse(200, auditReport, "Audit report fetched successfully")
        )
});