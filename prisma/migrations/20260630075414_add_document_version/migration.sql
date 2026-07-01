-- CreateTable
CREATE TABLE "DocumentVersion" (
    "id" SERIAL NOT NULL,
    "document_id" INTEGER NOT NULL,
    "versionNumber" INTEGER NOT NULL,
    "originalName" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "bucketName" TEXT NOT NULL,
    "objectKey" TEXT NOT NULL,
    "isCurrent" BOOLEAN NOT NULL DEFAULT false,
    "changeNote" TEXT,
    "uploaded_By" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DocumentVersion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DocumentVersion_objectKey_key" ON "DocumentVersion"("objectKey");

-- CreateIndex
CREATE INDEX "DocumentVersion_document_id_idx" ON "DocumentVersion"("document_id");

-- CreateIndex
CREATE INDEX "DocumentVersion_uploaded_By_idx" ON "DocumentVersion"("uploaded_By");

-- CreateIndex
CREATE INDEX "DocumentVersion_isCurrent_idx" ON "DocumentVersion"("isCurrent");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentVersion_document_id_versionNumber_key" ON "DocumentVersion"("document_id", "versionNumber");

-- AddForeignKey
ALTER TABLE "DocumentVersion" ADD CONSTRAINT "DocumentVersion_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentVersion" ADD CONSTRAINT "DocumentVersion_uploaded_By_fkey" FOREIGN KEY ("uploaded_By") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
