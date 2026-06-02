-- CreateEnum
CREATE TYPE "MetadataFieldType" AS ENUM ('TEXT', 'NUMBER', 'DATE', 'BOOLEAN', 'SELECT');

-- CreateTable
CREATE TABLE "MetadataField" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "type" "MetadataFieldType" NOT NULL DEFAULT 'TEXT',
    "isRequired" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "options" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MetadataField_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentMetadata" (
    "id" SERIAL NOT NULL,
    "document_id" INTEGER NOT NULL,
    "metadataField_id" INTEGER NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DocumentMetadata_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MetadataField_key_key" ON "MetadataField"("key");

-- CreateIndex
CREATE INDEX "MetadataField_key_idx" ON "MetadataField"("key");

-- CreateIndex
CREATE INDEX "MetadataField_type_idx" ON "MetadataField"("type");

-- CreateIndex
CREATE INDEX "MetadataField_isActive_idx" ON "MetadataField"("isActive");

-- CreateIndex
CREATE INDEX "DocumentMetadata_document_id_idx" ON "DocumentMetadata"("document_id");

-- CreateIndex
CREATE INDEX "DocumentMetadata_metadataField_id_idx" ON "DocumentMetadata"("metadataField_id");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentMetadata_document_id_metadataField_id_key" ON "DocumentMetadata"("document_id", "metadataField_id");

-- CreateIndex
CREATE INDEX "Document_isDeleted_idx" ON "Document"("isDeleted");

-- AddForeignKey
ALTER TABLE "DocumentMetadata" ADD CONSTRAINT "DocumentMetadata_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentMetadata" ADD CONSTRAINT "DocumentMetadata_metadataField_id_fkey" FOREIGN KEY ("metadataField_id") REFERENCES "MetadataField"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
