-- CreateEnum
CREATE TYPE "SharePermission" AS ENUM ('VIEW', 'DOWNLOAD');

-- CreateTable
CREATE TABLE "DocumentShare" (
    "id" SERIAL NOT NULL,
    "document_id" INTEGER NOT NULL,
    "sharedWithUserId" INTEGER NOT NULL,
    "sharedByUserId" INTEGER NOT NULL,
    "permission" "SharePermission" NOT NULL DEFAULT 'VIEW',
    "message" TEXT,
    "expiresAt" TIMESTAMP(3),
    "isRevoked" BOOLEAN NOT NULL DEFAULT false,
    "revokedAt" TIMESTAMP(3),
    "revokedBy" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DocumentShare_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DocumentShare_document_id_idx" ON "DocumentShare"("document_id");

-- CreateIndex
CREATE INDEX "DocumentShare_sharedWithUserId_idx" ON "DocumentShare"("sharedWithUserId");

-- CreateIndex
CREATE INDEX "DocumentShare_sharedByUserId_idx" ON "DocumentShare"("sharedByUserId");

-- CreateIndex
CREATE INDEX "DocumentShare_permission_idx" ON "DocumentShare"("permission");

-- CreateIndex
CREATE INDEX "DocumentShare_isRevoked_idx" ON "DocumentShare"("isRevoked");

-- CreateIndex
CREATE INDEX "DocumentShare_expiresAt_idx" ON "DocumentShare"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentShare_document_id_sharedWithUserId_key" ON "DocumentShare"("document_id", "sharedWithUserId");

-- AddForeignKey
ALTER TABLE "DocumentShare" ADD CONSTRAINT "DocumentShare_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentShare" ADD CONSTRAINT "DocumentShare_sharedWithUserId_fkey" FOREIGN KEY ("sharedWithUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentShare" ADD CONSTRAINT "DocumentShare_sharedByUserId_fkey" FOREIGN KEY ("sharedByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
