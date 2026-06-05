import { WorkflowAction, WorkflowStatus } from "@prisma/client";

export type WorkflowHistoryData = {
    workflowId: number;
    documentId: number;
    action: WorkflowAction;
    fromStatus?: WorkflowStatus | null;
    toStatus?: WorkflowStatus | null;
    performedById: number;
    reviewerId?: number | null;
    comment?: string | null;
}