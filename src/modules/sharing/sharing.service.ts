import { prisma } from "@/config/db.config";
import { ShareDocumentInput } from "@/types/sharing";
import ApiError from "@/utils/ApiError";
import { SharePermission } from "@prisma/client";

const validateId = (id: number, message: string) => {
  if (!id || Number.isNaN(id)) {
    throw new ApiError(400, message);
  }
};

const validateSharePermission = (permission?: SharePermission) => {
  if (!permission) return SharePermission.VIEW;

  const allowedPermissions = Object.values(SharePermission);

  if (!allowedPermissions.includes(permission)) {
    throw new ApiError(400, 'Invalid share permission.');
  }

  return permission;
};

const validateExpiryDate = (expiresAt?: string | Date | null) => {
  if (!expiresAt) return null;

  const expiryDate = new Date(expiresAt);

  if (Number.isNaN(expiryDate.getTime())) {
    throw new ApiError(400, 'Invalid expiry date.');
  }

  if (expiryDate <= new Date()) {
    throw new ApiError(400, 'Expiry date must be in the future.');
  }

  return expiryDate;
};

export const shareDocumentService = async (
  documentId: number,
  sharedByUserId: number,
  shareData: ShareDocumentInput,
) => {
  validateId(documentId, 'Valid document ID is required.');
  validateId(sharedByUserId, 'Valid sharing user ID is required.');

  const { sharedWithUserId, message } = shareData;

  validateId(sharedWithUserId, 'Valid shared user ID is required.');

  if (sharedByUserId === sharedWithUserId) {
    throw new ApiError(400, 'You cannot share a document with yourself.');
  }

  const permission = validateSharePermission(shareData.permission);
  const expiresAt = validateExpiryDate(shareData.expiresAt);

  const document = await prisma.document.findUnique({
    where: {
      id: documentId,
    },
  });

  if (!document) {
    throw new ApiError(404, 'Document not found.');
  }

  if (document.isDeleted) {
    throw new ApiError(400, 'Deleted document cannot be shared.');
  }

  const sharedWithUser = await prisma.user.findUnique({
    where: {
      id: sharedWithUserId,
    },
  });

  if (!sharedWithUser) {
    throw new ApiError(404, 'User to share with not found.');
  }

  if (!sharedWithUser.isActive) {
    throw new ApiError(400, 'Cannot share document with an inactive user.');
  }

  const existingShare = await prisma.documentShare.findUnique({
    where: {
      document_id_sharedWithUserId: {
        document_id: documentId,
        sharedWithUserId,
      },
    },
  });

  if (existingShare && !existingShare.isRevoked) {
    throw new ApiError(409, 'Document is already shared with this user.');
  }

  /**
   * If share existed before but was revoked, reactivate/update it.
   * Because @@unique([document_id, sharedWithUserId]) prevents duplicate rows.
   */
  if (existingShare && existingShare.isRevoked) {
    const reactivatedShare = await prisma.documentShare.update({
      where: {
        id: existingShare.id,
      },
      data: {
        permission,
        message,
        expiresAt,
        isRevoked: false,
        revokedAt: null,
        revokedBy: null,
        sharedByUserId,
      },
      include: {
        document: true,
        sharedWithUser: {
          select: {
            id: true,
            name: true,
            email: true,
            dept_id: true,
            isActive: true,
          },
        },
        sharedByUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return reactivatedShare;
  }

  const documentShare = await prisma.documentShare.create({
    data: {
      document_id: documentId,
      sharedWithUserId,
      sharedByUserId,
      permission,
      message,
      expiresAt,
    },
    include: {
      document: true,
      sharedWithUser: {
        select: {
          id: true,
          name: true,
          email: true,
          dept_id: true,
          isActive: true,
        },
      },
      sharedByUser: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return documentShare;
};

export const getDocumentsSharedWithMeService = async (userId: number) => {
  validateId(userId, 'Valid user ID is required.');

  const sharedDocuments = await prisma.documentShare.findMany({
    where: {
      sharedWithUserId: userId,
      isRevoked: false,
      OR: [
        {
          expiresAt: null,
        },
        {
          expiresAt: {
            gt: new Date(),
          },
        },
      ],
      document: {
        isDeleted: false,
      },
    },
    include: {
      document: {
        include: {
          department: true,
          folder: true,
          uploadedBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          metadata: {
            include: {
              metadataField: true,
            },
          },
        },
      },
      sharedByUser: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return sharedDocuments;
};

export const getDocumentSharesService = async (documentId: number) => {
  validateId(documentId, 'Valid document ID is required.');

  const document = await prisma.document.findUnique({
    where: {
      id: documentId,
    },
  });

  if (!document) {
    throw new ApiError(404, 'Document not found.');
  }

  const shares = await prisma.documentShare.findMany({
    where: {
      document_id: documentId,
      isRevoked: false,
    },
    include: {
      sharedWithUser: {
        select: {
          id: true,
          name: true,
          email: true,
          dept_id: true,
          isActive: true,
        },
      },
      sharedByUser: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return shares;
};

export const removeShareService = async (
  documentId: number,
  shareId: number,
  revokedByUserId: number,
) => {
  validateId(documentId, 'Valid document ID is required.');
  validateId(shareId, 'Valid share ID is required.');
  validateId(revokedByUserId, 'Valid user ID is required.');

  const share = await prisma.documentShare.findFirst({
    where: {
      id: shareId,
      document_id: documentId,
    },
  });

  if (!share) {
    throw new ApiError(404, 'Document share not found.');
  }

  if (share.isRevoked) {
    throw new ApiError(400, 'Document share is already revoked.');
  }

  const revokedShare = await prisma.documentShare.update({
    where: {
      id: shareId,
    },
    data: {
      isRevoked: true,
      revokedAt: new Date(),
      revokedBy: revokedByUserId,
    },
    include: {
      document: true,
      sharedWithUser: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      sharedByUser: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return revokedShare;
};

