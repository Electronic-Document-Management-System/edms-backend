import { AuditAction, DocumentStatus, WorkflowStatus } from '@prisma/client';
import { Response } from 'express';
import { prisma } from '@/config/db.config';
import { convertToCSV } from '@/utils/csvExport';
import { generatePdfReport } from '@/utils/pdfExport';

type DateRangeFilter = {
    startDate?: Date;
    endDate?: Date;
};

const buildDateFilter = ({ startDate, endDate }: DateRangeFilter) => {
    if (!startDate && !endDate) return undefined;
    return {
        ...(startDate ? { gte: startDate } : {}),
        ...(endDate ? { lte: endDate } : {}),
    };
};


export const viewDocumentsReportService = async ({
    departmentId,
    status,
    startDate,
    endDate,
}: {
    departmentId?: number;
    status?: DocumentStatus;
    startDate?: Date;
    endDate?: Date;
}) => {
    const dateFilter = buildDateFilter({ startDate, endDate });

    const where = {
        ...(departmentId ? { dept_id: departmentId } : {}),
        ...(status ? { status } : {}),
        ...(dateFilter ? { createdAt: dateFilter } : {}),
    };

    const [totalDocuments, activeCount, archivedCount, documents] = await Promise.all([
        prisma.document.count({ where }),
        prisma.document.count({ where: { ...where, status: DocumentStatus.ACTIVE } }),
        prisma.document.count({ where: { ...where, isArchived: true } }),
        prisma.document.findMany({
            where,
            include: {
                department: { select: { id: true, name: true } },
                uploadedBy: { select: { id: true, name: true } },
            },
            orderBy: { createdAt: 'desc' },
        }),
    ]);

    const byDepartmentMap = new Map<number, { departmentId: number; departmentName: string; count: number }>();
    const byStatusMap = new Map<DocumentStatus, number>();
    let storageUsed = 0;

    for (const doc of documents) {
        storageUsed += doc.fileSize;

        const deptEntry = byDepartmentMap.get(doc.dept_id);
        if (deptEntry) {
            deptEntry.count += 1;
        } else {
            byDepartmentMap.set(doc.dept_id, {
                departmentId: doc.dept_id,
                departmentName: doc.department.name,
                count: 1,
            });
        }

        byStatusMap.set(doc.status, (byStatusMap.get(doc.status) ?? 0) + 1);
    }

    const recentUploads = documents.slice(0, 10).map((doc) => ({
        id: doc.id,
        title: doc.title,
        uploadedBy: doc.uploadedBy.name,
        createdAt: doc.createdAt,
    }));

    return {
        totalDocuments,
        activeCount,
        archivedCount,
        byDepartment: Array.from(byDepartmentMap.values()),
        byStatus: Array.from(byStatusMap.entries()).map(([status, count]) => ({ status, count })),
        storageUsed,
        recentUploads,
        documents,
    };
};


export const viewDepartmentsReportService = async () => {
    const departments = await prisma.department.findMany({
        include: {
            users: { select: { id: true } },
            documents: { select: { id: true } },
            folders: { select: { id: true } },
        },
    });

    const result = departments.map((dept) => ({
        id: dept.id,
        name: dept.name,
        userCount: dept.users.length,
        documentCount: dept.documents.length,
        folderCount: dept.folders.length,
    }));

    return {
        totalDepartments: result.length,
        departments: result,
    };
};



export const viewWorkflowsReportService = async ({
    status,
    startDate,
    endDate,
}: {
    status?: WorkflowStatus;
    startDate?: Date;
    endDate?: Date;
}) => {
    const dateFilter = buildDateFilter({ startDate, endDate });

    const where = {
        ...(status ? { status } : {}),
        ...(dateFilter ? { submittedAt: dateFilter } : {}),
    };

    const workflows = await prisma.documentWorkflow.findMany({
        where,
        include: {
            document: { select: { title: true } },
            reviewer: { select: { name: true } },
        },
        orderBy: { updatedAt: 'desc' },
    });

    const totalWorkflows = workflows.length;
    const statusCounts = {
        pendingReview: 0,
        inReview: 0,
        approved: 0,
        rejected: 0,
        cancelled: 0,
    };

    let totalTurnaroundHours = 0;
    let completedCount = 0;

    for (const wf of workflows) {
        switch (wf.status) {
            case WorkflowStatus.PENDING_REVIEW:
                statusCounts.pendingReview += 1;
                break;
            case WorkflowStatus.IN_REVIEW:
                statusCounts.inReview += 1;
                break;
            case WorkflowStatus.APPROVED:
                statusCounts.approved += 1;
                break;
            case WorkflowStatus.REJECTED:
                statusCounts.rejected += 1;
                break;
            case WorkflowStatus.CANCELLED:
                statusCounts.cancelled += 1;
                break;
        }

        if (wf.completedAt) {
            const hours = (wf.completedAt.getTime() - wf.submittedAt.getTime()) / (1000 * 60 * 60);
            totalTurnaroundHours += hours;
            completedCount += 1;
        }
    }

    const avgTurnaroundHours = completedCount > 0
        ? Number((totalTurnaroundHours / completedCount).toFixed(2))
        : 0;

    const recentActivity = workflows.slice(0, 10).map((wf) => ({
        documentTitle: wf.document.title,
        status: wf.status,
        reviewerName: wf.reviewer?.name ?? null,
        updatedAt: wf.updatedAt,
    }));

    return {
        totalWorkflows,
        ...statusCounts,
        avgTurnaroundHours,
        recentActivity,
        workflows,
    };
};


export const viewAuditReportService = async ({
    userId,
    action,
    resource,
    startDate,
    endDate,
}: {
    userId?: number;
    action?: AuditAction;
    resource?: string;
    startDate?: Date;
    endDate?: Date;
}) => {
    const dateFilter = buildDateFilter({ startDate, endDate });

    const where = {
        ...(userId ? { userId } : {}),
        ...(action ? { action } : {}),
        ...(resource ? { resource } : {}),
        ...(dateFilter ? { createdAt: dateFilter } : {}),
    };

    const logs = await prisma.auditLog.findMany({
        where,
        include: {
            user: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: 'desc' },
    });

    const byActionMap = new Map<AuditAction, number>();
    const byUserMap = new Map<number, { userId: number; userName: string; count: number }>();

    for (const log of logs) {
        byActionMap.set(log.action, (byActionMap.get(log.action) ?? 0) + 1);

        const userEntry = byUserMap.get(log.userId);
        if (userEntry) {
            userEntry.count += 1;
        } else {
            byUserMap.set(log.userId, {
                userId: log.userId,
                userName: log.user.name,
                count: 1,
            });
        }
    }

    const byUser = Array.from(byUserMap.values())
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

    return {
        totalEvents: logs.length,
        byAction: Array.from(byActionMap.entries()).map(([action, count]) => ({ action, count })),
        byUser,
        recentEvents: logs.slice(0, 20),
        logs,
    };
};


export const exportDocumentsReportService = async (
    res: Response,
    filters: { departmentId?: number; status?: DocumentStatus; startDate?: Date; endDate?: Date },
    format: 'csv' | 'pdf',
) => {
    const data = await viewDocumentsReportService(filters);

    const rows = data.documents.map((doc) => ({
        ID: doc.id,
        Title: doc.title,
        Department: doc.department.name,
        Status: doc.status,
        'Uploaded By': doc.uploadedBy.name,
        'File Size (bytes)': doc.fileSize,
        'Created At': doc.createdAt.toISOString(),
    }));

    if (format === 'pdf') {
        generatePdfReport(res, {
            title: 'Documents Report',
            summary: [
                { label: 'Total Documents', value: data.totalDocuments },
                { label: 'Active', value: data.activeCount },
                { label: 'Archived', value: data.archivedCount },
                { label: 'Storage Used', value: `${(data.storageUsed / 1024 / 1024).toFixed(2)} MB` },
            ],
            columns: ['ID', 'Title', 'Department', 'Status', 'Uploaded By'],
            rows: data.documents.map((d) => [d.id, d.title, d.department.name, d.status, d.uploadedBy.name]),
            filename: 'documents-report.pdf',
        });
        return;
    }

    const csv = convertToCSV(rows);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="documents-report.csv"');
    res.status(200).send(csv);
};


export const exportDepartmentsReportService = async (
    res: Response,
    format: 'csv' | 'pdf',
) => {
    const data = await viewDepartmentsReportService();

    const rows = data.departments.map((dept) => ({
        ID: dept.id,
        Name: dept.name,
        Users: dept.userCount,
        Documents: dept.documentCount,
        Folders: dept.folderCount,
    }));

    if (format === 'pdf') {
        generatePdfReport(res, {
            title: 'Departments Report',
            columns: ['ID', 'Name', 'Users', 'Documents', 'Folders'],
            rows: data.departments.map((d) => [d.id, d.name, d.userCount, d.documentCount, d.folderCount]),
            filename: 'departments-report.pdf',
        });
        return;
    }

    const csv = convertToCSV(rows);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="departments-report.csv"');
    res.status(200).send(csv);
};


export const exportWorkflowsReportService = async (
    res: Response,
    filters: { status?: WorkflowStatus; startDate?: Date; endDate?: Date },
    format: 'csv' | 'pdf',
) => {
    const data = await viewWorkflowsReportService(filters);

    const rows = data.workflows.map((wf) => ({
        ID: wf.id,
        Document: wf.document.title,
        Status: wf.status,
        Reviewer: wf.reviewer?.name ?? '—',
        'Submitted At': wf.submittedAt.toISOString(),
        'Completed At': wf.completedAt ? wf.completedAt.toISOString() : '—',
    }));

    if (format === 'pdf') {
        generatePdfReport(res, {
            title: 'Workflows Report',
            summary: [
                { label: 'Total Workflows', value: data.totalWorkflows },
                { label: 'Pending Review', value: data.pendingReview },
                { label: 'In Review', value: data.inReview },
                { label: 'Approved', value: data.approved },
                { label: 'Rejected', value: data.rejected },
                { label: 'Avg Turnaround (hrs)', value: data.avgTurnaroundHours },
            ],
            columns: ['ID', 'Document', 'Status', 'Reviewer', 'Submitted At'],
            rows: data.workflows.map((wf) => [
                wf.id,
                wf.document.title,
                wf.status,
                wf.reviewer?.name ?? '—',
                wf.submittedAt.toISOString(),
            ]),
            filename: 'workflows-report.pdf',
        });
        return;
    }

    const csv = convertToCSV(rows);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="workflows-report.csv"');
    res.status(200).send(csv);
};


export const exportAuditReportService = async (
    res: Response,
    filters: { userId?: number; action?: AuditAction; resource?: string; startDate?: Date; endDate?: Date },
    format: 'csv' | 'pdf',
) => {
    const data = await viewAuditReportService(filters);

    const rows = data.logs.map((log) => ({
        ID: log.id,
        Action: log.action,
        Resource: log.resource,
        'Resource ID': log.resourceId ?? '—',
        User: log.user.name,
        'IP Address': log.ipAddress ?? '—',
        'Created At': log.createdAt.toISOString(),
    }));

    if (format === 'pdf') {
        generatePdfReport(res, {
            title: 'Audit Report',
            summary: [
                { label: 'Total Events', value: data.totalEvents },
                { label: 'Unique Actions', value: data.byAction.length },
                { label: 'Active Users', value: data.byUser.length },
            ],
            columns: ['ID', 'Action', 'Resource', 'User', 'Created At'],
            rows: data.logs.map((log) => [
                log.id,
                log.action,
                log.resource,
                log.user.name,
                log.createdAt.toISOString(),
            ]),
            filename: 'audit-report.pdf',
        });
        return;
    }

    const csv = convertToCSV(rows);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="audit-report.csv"');
    res.status(200).send(csv);
};