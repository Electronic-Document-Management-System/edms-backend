import { prisma } from '@/config/db.config';
import {
  generatePresignedUrl,
  getFileFromMinIO,
  uploadFileToMinIO,
} from '@/services/storage/minio.service';
import { uploadDocData } from '@/types/document';
import ApiError from '@/utils/ApiError';
import { generateDocumentObjectKey } from '@/utils/doc.utils';

export const getAllDocumentsService = async ({
  departmentId,
  folderId,
  search,
  status,
  page,
  limit,
  user,
}: {
  departmentId?: number;
  folderId?: number;
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
  user: any;
}) => {
  const where: any = {};

  if (departmentId) {
    where.dept_id = departmentId;
  }

  if (folderId) {
    where.folder_id = folderId;
  }

  if (status) {
    where.status = status;
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  const documents = await prisma.document.findMany({
    where,
    skip: (page! - 1) * limit!,
    take: limit!,
    orderBy: {
      createdAt: 'desc',
    },
  });

  return documents;
};

export const getDocumentByIdService = async (documentId: number) => {
  const document = await prisma.document.findUnique({
    where: {
      id: documentId,
    },
  });

  if (!document) {
    throw new ApiError(404, 'Document not found.');
  }

  return document;
};

export const uploadSingleDocumentService = async (
  documentData: uploadDocData,
  file: Express.Multer.File | undefined,
) => {
  const { title, description, folder_id, dept_id, uploaded_by } = documentData;

  if (!folder_id || Number.isNaN(folder_id)) {
    throw new ApiError(400, 'Valid folder ID is required.');
  }

  if (!dept_id || Number.isNaN(dept_id)) {
    throw new ApiError(400, 'Valid department ID is required.');
  }

  if (!file) {
    throw new ApiError(400, 'Document file is required.');
  }

  if (!title) {
    throw new ApiError(400, 'Document title is required.');
  }

  if (dept_id) {
    const department = await prisma.department.findUnique({
      where: { id: dept_id },
    });

    if (!department) {
      throw new ApiError(404, 'Department not found.');
    }
  }

  if (folder_id) {
    const folder = await prisma.folder.findUnique({
      where: { id: folder_id },
    });

    if (!folder) {
      throw new ApiError(404, 'Folder not found.');
    }
  }

  const objectKey = generateDocumentObjectKey(file.originalname);

  const uploadedFile = await uploadFileToMinIO(file, objectKey);

  if (!uploadedFile) {
    throw new ApiError(500, 'Failed to upload document to storage.');
  }

  const document = await prisma.$transaction(async (tx) => {

    const createdDocument = await prisma.document.create({
      data: {
        title,
        description,
        folder_id,
        dept_id,
        uploaded_by,
        originalName: uploadedFile.originalName,
        fileName: uploadedFile.originalName,
        mimeType: uploadedFile.mimeType,
        fileSize: uploadedFile.fileSize,
        bucketName: uploadedFile.bucketName,
        objectKey: uploadedFile.objectKey,
      },
    });

    await tx.documentVersion.create({
      data: {
        document_id: createdDocument.id,
        versionNumber: 1,
        originalName: uploadedFile.originalName,
        fileName: uploadedFile.originalName,
        mimeType: uploadedFile.mimeType,
        fileSize: uploadedFile.fileSize,
        bucketName: uploadedFile.bucketName,
        objectKey: uploadedFile.objectKey,
        isCurrent: true,
        uploaded_By: uploaded_by,
      }
    });

    return createdDocument;

  })
  return document;
};

export const uploadBulkDocumentsService = async (
  documentData: uploadDocData,
  files: Express.Multer.File[] | undefined,
) => {
  const { title, description, folder_id, dept_id, uploaded_by } = documentData;

  if (!folder_id || Number.isNaN(folder_id)) {
    throw new ApiError(400, 'Valid folder ID is required.');
  }

  if (!dept_id || Number.isNaN(dept_id)) {
    throw new ApiError(400, 'Valid department ID is required.');
  }

  if (!files || files.length === 0) {
    throw new ApiError(400, 'Document files are required.');
  }

  const department = await prisma.department.findUnique({
    where: { id: dept_id },
  });

  if (!department) {
    throw new ApiError(404, 'Department not found.');
  }

  const folder = await prisma.folder.findUnique({
    where: { id: folder_id },
  });

  if (!folder) {
    throw new ApiError(404, 'Folder not found.');
  }

  if (folder.dept_id !== dept_id) {
    throw new ApiError(400, 'Folder does not belong to selected department.');
  }

  const documentsData = await Promise.all(
    files.map(async (file) => {
      const objectKey = generateDocumentObjectKey(file.originalname);
      const uploadedFile = await uploadFileToMinIO(file, objectKey);

      return {
        title,
        description,
        folder_id,
        dept_id,
        uploaded_by,

        originalName: uploadedFile.originalName,
        fileName: uploadedFile.originalName,
        mimeType: uploadedFile.mimeType,
        fileSize: uploadedFile.fileSize,
        bucketName: uploadedFile.bucketName,
        objectKey: uploadedFile.objectKey,
      };
    }),
  );

  const documents = await prisma.$transaction(
    documentsData.map((document) =>
      prisma.document.create({
        data: document,
      }),
    ),
  );

  return {
    count: documents.length,
    documents,
  };
};

export const updateDocumentService = async (
  documentId: number,
  updateDocData: Partial<uploadDocData>,
) => {
  if (!documentId || Number.isNaN(documentId)) {
    throw new ApiError(400, 'Valid document ID is required.');
  }

  const document = await prisma.document.findUnique({
    where: {
      id: documentId,
    },
  });

  if (!document) {
    throw new ApiError(404, 'Document not found.');
  }

  const finalFolderId = updateDocData.folder_id ?? document.folder_id;
  const finalDeptId = updateDocData.dept_id ?? document.dept_id;

  const department = await prisma.department.findUnique({
    where: {
      id: finalDeptId,
    },
  });

  if (!department) {
    throw new ApiError(404, 'Department not found.');
  }

  const folder = await prisma.folder.findUnique({
    where: {
      id: finalFolderId,
    },
  });

  if (!folder) {
    throw new ApiError(404, 'Folder not found.');
  }

  if (folder.dept_id !== finalDeptId) {
    throw new ApiError(
      400,
      'Selected folder does not belong to the selected department.',
    );
  }

  const updatedDoc = await prisma.document.update({
    where: {
      id: documentId,
    },
    data: {
      title: updateDocData.title,
      description: updateDocData.description,
      folder_id: finalFolderId,
      dept_id: finalDeptId,
    },
  });

  return updatedDoc;
};

export const removeDocumentService = async (
  documentId: number,
  userId: number,
) => {
  if (!documentId || Number.isNaN(documentId)) {
    throw new ApiError(400, 'Valid document ID is required.');
  }

  if (!userId || Number.isNaN(userId)) {
    throw new ApiError(400, 'Valid user ID is required.');
  }

  const document = await prisma.document.findUnique({
    where: {
      id: documentId,
    },
  });

  if (!document) {
    throw new ApiError(404, 'Document not found.');
  }

  if (document.isDeleted) {
    throw new ApiError(400, 'Document is already deleted.');
  }

  const removedDocument = await prisma.document.update({
    where: {
      id: documentId,
    },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
      deletedBy: userId,
      status: 'DELETED',
    },
  });

  return removedDocument;
};

export const restoreDocumentService = async (documentId: number) => {
  if (!documentId || Number.isNaN(documentId)) {
    throw new ApiError(400, 'Valid document ID is required.');
  }

  const document = await prisma.document.findUnique({
    where: {
      id: documentId,
    },
  });

  if (!document) {
    throw new ApiError(404, 'Document not found.');
  }

  if (!document.isDeleted && !document.isArchived) {
    throw new ApiError(400, 'Document is already active.');
  }

  const restoredDocument = await prisma.document.update({
    where: {
      id: documentId,
    },
    data: {
      isDeleted: false,
      deletedAt: null,
      deletedBy: null,

      isArchived: false,
      archivedAt: null,
      archivedBy: null,

      status: 'ACTIVE',
    },
  });

  return restoredDocument;
};

export const searchDocumentsService = async () => { };

export const downloadDocumentService = async (documentId: number) => {
  if (!documentId || Number.isNaN(documentId)) {
    throw new ApiError(400, 'Valid document ID is required.');
  }

  const document = await prisma.document.findUnique({
    where: {
      id: documentId,
    },
  });

  if (!document) {
    throw new ApiError(404, 'Document not found.');
  }

  if (document.isDeleted) {
    throw new ApiError(400, 'Deleted document cannot be downloaded.');
  }

  if (!document.objectKey) {
    throw new ApiError(500, 'Document storage key is missing.');
  }

  try {
    const fileStream = await getFileFromMinIO(document.objectKey);

    return {
      document,
      fileStream,
    };
  } catch (error) {
    console.error('MinIO download error:', {
      documentId: document.id,
      objectKey: document.objectKey,
      bucketName: document.bucketName,
      error,
    });

    throw new ApiError(
      500,
      'Failed to download document file from storage.',
    );
  }
};

export const archiveDocumentService = async (
  documentId: number,
  userId: number,
) => {
  const document = await prisma.document.findUnique({
    where: {
      id: documentId,
    },
  });

  if (!document) {
    throw new ApiError(404, 'Document not found.');
  }

  if (document.isDeleted) {
    throw new ApiError(
      400,
      'Document cannot be archived because it is deleted.',
    );
  }

  if (document.isArchived) {
    throw new ApiError(400, 'Document is already archived.');
  }

  const archivedDocument = await prisma.document.update({
    where: { id: documentId },
    data: {
      isArchived: true,
      archivedAt: new Date(),
      status: 'ARCHIVED',
      archivedBy: userId,
    },
  });

  return archivedDocument;
};

export const getPreviewUrlService = async (documentId: number) => {
  const document = await prisma.document.findUnique({
    where: { id: documentId },
    select: {
      id: true, objectKey: true, mimeType: true, isDeleted: true
    }
  })

  if (!document) {
    throw new ApiError(404, 'Document not found.');
  }

  if (document.isDeleted) {
    throw new ApiError(400, 'Deleted document cannot be previewed.');
  }

  const previewUrl = await generatePresignedUrl(document?.objectKey || '');

  return {previewUrl, mimeType : document?.mimeType || ''};
}