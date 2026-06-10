import { prisma } from "../../config/db.config";
import { FolderData, GetFoldersFilter } from "../../types/folder";
import ApiError from "../../utils/ApiError";

export const getFoldersService = async (
    { departmentId, parentId }: GetFoldersFilter = {},
) => {
    const where: any = {
        isDeleted: false,
    };

    if (departmentId !== undefined) {
        where.dept_id = departmentId;
    }

    if (parentId !== undefined) {
        where.parent_id = parentId;
    }

    const folders = await prisma.folder.findMany({
        where,
        orderBy: {
            name: 'asc',
        },
    });

    return folders;
};

export const getFolderByIdService = async (folderId: number) => {
    if (!folderId || Number.isNaN(folderId)) {
        throw new ApiError(400, "Valid folder ID is required");
    }

    const folder = await prisma.folder.findUnique({
        where: {
            id: folderId,
        },
        include: {
            children: true,
        },
    });

    if (!folder) {
        throw new ApiError(404, "Folder not found");
    }

    return folder;
};

export const createFolderService = async (folder: FolderData, userId?: number) => {
    if (!folder?.name) {
        throw new ApiError(400, "Folder name is required");
    }

    const existingFolder = await prisma.folder.findFirst({
        where: {
            name: folder.name,
            parent_id: folder.parent_id ?? null,
            isDeleted: false,
        },
    });

    if (existingFolder) {
        throw new ApiError(409, "Folder with this name already exists in this location");
    }

    if (folder.parent_id) {
        const parentFolder = await prisma.folder.findUnique({
            where: {
                id: folder.parent_id,
            },
        });

        if (!parentFolder) {
            throw new ApiError(404, "Parent folder not found");
        }
    }

    return await prisma.folder.create({
        data: {
            name: folder.name,
            description: folder.description,
            parent_id: folder.parent_id,
            createdById: userId,
            dept_id: folder.dept_id,
        }
    });
};

export const updateFolderService = async (
    folderId: number,
    folder: Partial<FolderData>,
) => {
    if (!folderId || Number.isNaN(folderId)) {
        throw new ApiError(400, "Valid folder ID is required");
    }

    const existingFolder = await prisma.folder.findUnique({
        where: {
            id: folderId,
        },
    });

    if (!existingFolder) {
        throw new ApiError(404, "Folder not found");
    }

    if (folder.name) {
        const duplicateFolder = await prisma.folder.findFirst({
            where: {
                name: folder.name,
                parent_id: existingFolder.parent_id,
                isDeleted: false,
                NOT: {
                    id: folderId,
                },
            },
        });

        if (duplicateFolder) {
            throw new ApiError(409, "Folder with this name already exists in this location");
        }
    }

    return await prisma.folder.update({
        where: {
            id: folderId,
        },
        data: folder,
    });
};

export const deleteFolderService = async (folderId: number, userId: number) => {
  if (!folderId || Number.isNaN(folderId)) {
    throw new ApiError(400, 'Valid folder ID is required.');
  }

  const folder = await prisma.folder.findUnique({
    where: { id: folderId },
  });

  if (!folder) {
    throw new ApiError(404, 'Folder not found.');
  }

  const childFolderCount = await prisma.folder.count({
    where: {
      parent_id: folderId,
      isDeleted: false,
    },
  });

  if (childFolderCount > 0) {
    throw new ApiError(
      409,
      'Folder cannot be deleted because it contains active subfolders.',
    );
  }

  const activeDocumentCount = await prisma.document.count({
    where: {
      folder_id: folderId,
      isDeleted: false,
    },
  });

  if (activeDocumentCount > 0) {
    throw new ApiError(
      409,
      'Folder cannot be deleted because it contains active documents.',
    );
  }

  const deletedFolder = await prisma.folder.update({
    where: { id: folderId },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
      deletedBy: userId,
    },
  });

  return deletedFolder;
};

export const moveFolderService = async (
    folderId: number,
    parentId: number | null,
) => {
    if (!folderId || Number.isNaN(folderId)) {
        throw new ApiError(400, "Valid folder ID is required");
    }

    const folder = await prisma.folder.findUnique({
        where: {
            id: folderId,
        },
    });

    if (!folder) {
        throw new ApiError(404, "Folder not found");
    }

    if (folderId === parentId) {
        throw new ApiError(400, "Folder cannot be moved inside itself");
    }

    if (folder.parent_id === parentId) {
        throw new ApiError(400, "Folder is already in the selected location");
    }

    if (parentId !== null) {
        const parentFolder = await prisma.folder.findUnique({
            where: {
                id: parentId,
            },
        });

        if (!parentFolder) {
            throw new ApiError(404, "Target parent folder not found");
        }
    }

    return await prisma.folder.update({
        where: {
            id: folderId,
        },
        data: {
            parent_id: parentId,
        },
    });
};