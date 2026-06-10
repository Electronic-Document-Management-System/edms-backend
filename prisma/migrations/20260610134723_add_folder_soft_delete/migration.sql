-- AlterTable
ALTER TABLE "Folder" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "deletedBy" INTEGER,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Folder_isDeleted_idx" ON "Folder"("isDeleted");
