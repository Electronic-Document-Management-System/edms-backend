-- CreateEnum
CREATE TYPE "WorkflowStatus" AS ENUM ('PENDING_REVIEW', 'IN_REVIEW', 'APPROVED', 'REJECTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "WorkflowAction" AS ENUM ('SUBMITTED', 'REVIEWER_ASSIGNED', 'REVIEWER_REASSIGNED', 'APPROVED', 'REJECTED', 'CANCELLED');

-- CreateTable
CREATE TABLE "DocumentWorkflow" (
    "id" SERIAL NOT NULL,
    "document_id" INTEGER NOT NULL,
    "status" "WorkflowStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
    "submittedById" INTEGER NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewerId" INTEGER,
    "assignedById" INTEGER,
    "assignedAt" TIMESTAMP(3),
    "reviewedAt" TIMESTAMP(3),
    "reviewComment" TEXT,
    "completedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "cancelledById" INTEGER,
    "cancelReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DocumentWorkflow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowHistory" (
    "id" SERIAL NOT NULL,
    "workflow_id" INTEGER NOT NULL,
    "document_id" INTEGER NOT NULL,
    "action" "WorkflowAction" NOT NULL,
    "fromStatus" "WorkflowStatus",
    "toStatus" "WorkflowStatus",
    "performedById" INTEGER NOT NULL,
    "reviewerId" INTEGER,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkflowHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DocumentWorkflow_document_id_key" ON "DocumentWorkflow"("document_id");

-- CreateIndex
CREATE INDEX "DocumentWorkflow_document_id_idx" ON "DocumentWorkflow"("document_id");

-- CreateIndex
CREATE INDEX "DocumentWorkflow_status_idx" ON "DocumentWorkflow"("status");

-- CreateIndex
CREATE INDEX "DocumentWorkflow_submittedById_idx" ON "DocumentWorkflow"("submittedById");

-- CreateIndex
CREATE INDEX "DocumentWorkflow_reviewerId_idx" ON "DocumentWorkflow"("reviewerId");

-- CreateIndex
CREATE INDEX "DocumentWorkflow_assignedById_idx" ON "DocumentWorkflow"("assignedById");

-- CreateIndex
CREATE INDEX "WorkflowHistory_workflow_id_idx" ON "WorkflowHistory"("workflow_id");

-- CreateIndex
CREATE INDEX "WorkflowHistory_document_id_idx" ON "WorkflowHistory"("document_id");

-- CreateIndex
CREATE INDEX "WorkflowHistory_performedById_idx" ON "WorkflowHistory"("performedById");

-- CreateIndex
CREATE INDEX "WorkflowHistory_reviewerId_idx" ON "WorkflowHistory"("reviewerId");

-- CreateIndex
CREATE INDEX "WorkflowHistory_action_idx" ON "WorkflowHistory"("action");

-- CreateIndex
CREATE INDEX "WorkflowHistory_createdAt_idx" ON "WorkflowHistory"("createdAt");

-- AddForeignKey
ALTER TABLE "DocumentWorkflow" ADD CONSTRAINT "DocumentWorkflow_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentWorkflow" ADD CONSTRAINT "DocumentWorkflow_submittedById_fkey" FOREIGN KEY ("submittedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentWorkflow" ADD CONSTRAINT "DocumentWorkflow_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentWorkflow" ADD CONSTRAINT "DocumentWorkflow_assignedById_fkey" FOREIGN KEY ("assignedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentWorkflow" ADD CONSTRAINT "DocumentWorkflow_cancelledById_fkey" FOREIGN KEY ("cancelledById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowHistory" ADD CONSTRAINT "WorkflowHistory_workflow_id_fkey" FOREIGN KEY ("workflow_id") REFERENCES "DocumentWorkflow"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowHistory" ADD CONSTRAINT "WorkflowHistory_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowHistory" ADD CONSTRAINT "WorkflowHistory_performedById_fkey" FOREIGN KEY ("performedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowHistory" ADD CONSTRAINT "WorkflowHistory_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
