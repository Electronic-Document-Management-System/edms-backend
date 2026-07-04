import { generateDocumentObjectKey } from "@/utils/doc.utils";
import ApiError from "@/utils/ApiError";
import { uploadFileToMinIO } from "@/services/storage/minio.service";
import { prisma } from "@/config/db.config";

export const getDocumentVersionsService = async (documentId: number) => {
    if (!documentId || Number.isNaN(documentId)) {
        throw new ApiError(400, 'Valid document ID is required.');
    }

    const document = await prisma.document.findUnique({
        where: { id: documentId },
    });

    if (!document) {
        throw new ApiError(404, 'Document not found.');
    }

    const versions = await prisma.documentVersion.findMany({
        where: { document_id: documentId },
        include: {
            uploadedBy: {
                select: { id: true, name: true, email: true },
            },
        },
        orderBy: { versionNumber: 'desc' },
    });

    return versions;
};

export const getDocumentVersionByIdService = async (
    documentId: number,
    versionId: number,
) => {
    if (!documentId || Number.isNaN(documentId)) {
        throw new ApiError(400, 'Valid document ID is required.');
    }

    if (!versionId || Number.isNaN(versionId)) {
        throw new ApiError(400, 'Valid version ID is required.');
    }

    const version = await prisma.documentVersion.findUnique({
        where: { id: versionId },
        include: {
            uploadedBy: {
                select: { id: true, name: true, email: true },
            },
        },
    });

    if (!version || version.document_id !== documentId) {
        throw new ApiError(404, 'Version not found for this document.');
    }

    return version;
};

export const createDocumentVersionService = async (
    documentId: number,
    uploadedById: number,
    file: Express.Multer.File | undefined,
    changeNote?: string,
) => {
    if (!documentId || Number.isNaN(documentId)) {
        throw new ApiError(400, 'Valid document ID is required.');
    }

    if (!file) {
        throw new ApiError(400, 'Document file is required.');
    }

    const document = await prisma.document.findUnique({
        where: { id: documentId },
    });

    if (!document) {
        throw new ApiError(404, 'Document not found.');
    }

    if (document.isDeleted) {
        throw new ApiError(400, 'Cannot version a deleted document.');
    }

    const latestVersion = await prisma.documentVersion.findFirst({
        where: { document_id: documentId },
        orderBy: { versionNumber: 'desc' },
    });

    const nextVersionNumber = (latestVersion?.versionNumber ?? 0) + 1;

    const objectKey = generateDocumentObjectKey(file.originalname);
    const uploadedFile = await uploadFileToMinIO(file, objectKey);

    if (!uploadedFile) {
        throw new ApiError(500, 'Failed to upload document version to storage.');
    }

    const newVersion = await prisma.$transaction(async (tx) => {
        await tx.documentVersion.updateMany({
            where: { document_id: documentId, isCurrent: true },
            data: { isCurrent: false },
        });

        const version = await tx.documentVersion.create({
            data: {
                document_id: documentId,
                versionNumber: nextVersionNumber,
                originalName: uploadedFile.originalName,
                fileName: uploadedFile.originalName,
                mimeType: uploadedFile.mimeType,
                fileSize: uploadedFile.fileSize,
                bucketName: uploadedFile.bucketName,
                objectKey: uploadedFile.objectKey,
                isCurrent: true,
                changeNote,
                uploaded_By: uploadedById,
            },
        });

        await tx.document.update({
            where: { id: documentId },
            data: {
                originalName: uploadedFile.originalName,
                fileName: uploadedFile.originalName,
                mimeType: uploadedFile.mimeType,
                fileSize: uploadedFile.fileSize,
                bucketName: uploadedFile.bucketName,
                objectKey: uploadedFile.objectKey,
            },
        });

        return version;
    });

    return newVersion;
};

export const restoreDocumentVersionService = async (
    documentId: number,
    versionId: number,
    restoredById: number,
    changeNote: string
) => {
    if (!documentId || Number.isNaN(documentId)) {
        throw new ApiError(400, 'Valid document ID is required.');
    }

    if (!versionId || Number.isNaN(versionId)) {
        throw new ApiError(400, 'Valid version ID is required.');
    }

    const document = await prisma.document.findUnique({
        where: { id: documentId },
    });

    if (!document) {
        throw new ApiError(404, 'Document not found.');
    }

    const versionToRestore = await prisma.documentVersion.findUnique({
        where: { id: versionId },
    });

    if (!versionToRestore || versionToRestore.document_id !== documentId) {
        throw new ApiError(404, 'Version not found for this document.');
    }

    if (versionToRestore.isCurrent) {
        throw new ApiError(400, 'This version is already the current version.');
    }

    // const latestVersion = await prisma.documentVersion.findFirst({
    //     where: { document_id: documentId },
    //     orderBy: { versionNumber: 'desc' },
    // });

    // const nextVersionNumber = (latestVersion?.versionNumber ?? 0) + 1;

    await prisma.$transaction(async (tx) => {

        await tx.documentVersion.updateMany({
            where: { document_id: documentId, isCurrent: true },
            data: { isCurrent: false },
        });

        await tx.documentVersion.update({
            where: { id: versionId },
            data: { isCurrent: true },
        });

        await tx.document.update({
            where: { id: documentId },
            data: {
                originalName: versionToRestore.originalName,
                fileName: versionToRestore.fileName,
                mimeType: versionToRestore.mimeType,
                fileSize: versionToRestore.fileSize,
                bucketName: versionToRestore.bucketName,
                objectKey: versionToRestore.objectKey,
            },
        });
    });

    return versionToRestore;
};