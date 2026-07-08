import { prisma } from '@/config/db.config';
import ApiError from '@/utils/ApiError';

export const addDocumentCommentService = async ({
    documentId,
    userId,
    content,
}: {
    documentId: number;
    userId: number;
    content: string;
}) => {
    const document = await prisma.document.findUnique({ where: { id: documentId } });
    if (!document || document.isDeleted) {
        throw new ApiError(404, 'Document not found');
    }

    const comment = await prisma.comment.create({
        data: {
            document_id: documentId,
            userId,
            content,
        },
        include: {
            user: { select: { id: true, name: true, email: true } },
        },
    });

    return comment;
};

export const getDocumentCommentsService = async (documentId: number) => {
    const comments = await prisma.comment.findMany({
        where: {
            document_id: documentId,
            isDeleted: false,
        },
        include: {
            user: { select: { id: true, name: true, email: true } },
        },
        orderBy: { createdAt: 'asc' },
    });

    return comments;
};

export const updateCommentService = async ({
    commentId,
    userId,
    content,
}: {
    commentId: number;
    userId: number;
    content: string;
}) => {
    const existing = await prisma.comment.findUnique({ where: { id: commentId } });

    if (!existing || existing.isDeleted) {
        throw new ApiError(404, 'Comment not found');
    }

    if (existing.userId !== userId) {
        throw new ApiError(403, 'You can only edit your own comments');
    }

    const comment = await prisma.comment.update({
        where: { id: commentId },
        data: {
            content,
            isEdited: true,
        },
        include: {
            user: { select: { id: true, name: true, email: true } },
        },
    });

    return comment;
};

export const deleteCommentService = async ({
    commentId,
    userId,
}: {
    commentId: number;
    userId: number;
}) => {
    const existing = await prisma.comment.findUnique({ where: { id: commentId } });

    if (!existing || existing.isDeleted) {
        throw new ApiError(404, 'Comment not found');
    }

    if (existing.userId !== userId) {
        throw new ApiError(403, 'You can only delete your own comments');
    }

    const comment = await prisma.comment.update({
        where: { id: commentId },
        data: {
            isDeleted: true,
            deletedAt: new Date(),
            deletedBy: userId,
        },
    });

    return comment;
};