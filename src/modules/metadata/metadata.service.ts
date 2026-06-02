import { prisma } from '@/config/db.config';
import { DocumentMetadataInput, MetadataFieldData, UpdateMetadataFieldData } from '@/types/metadata';
import ApiError from '@/utils/ApiError';
import { MetadataFieldType } from '@prisma/client';

// Helpers or validators functions
const normalizeMetadataKey = (key: string) => {
    return key.trim().toLowerCase().replace(/\s+/g, '_');
};

const validateSelectOptions = (type: MetadataFieldType, options?: unknown) => {
    if (type !== MetadataFieldType.SELECT) return;

    if (!Array.isArray(options) || options.length === 0) {
        throw new ApiError(
            400,
            'Options are required for SELECT metadata field.',
        );
    };

    const hasInvalidOption = options.some(
        (option) => typeof option !== 'string' || option.trim() === '',
    );

    if (hasInvalidOption) {
        throw new ApiError(400, 'SELECT options must be non-empty strings.');
    }
};

const validateMetadataValue = (
    fieldType: MetadataFieldType,
    value: string,
    options?: unknown,
) => {
    if (value === undefined || value === null || String(value).trim() === '') {
        throw new ApiError(400, 'Metadata value is required.');
    }

    switch (fieldType) {
        case MetadataFieldType.TEXT:
            return String(value);

        case MetadataFieldType.NUMBER: {
            const numberValue = Number(value);

            if (Number.isNaN(numberValue)) {
                throw new ApiError(400, 'Metadata value must be a valid number.');
            }

            return String(numberValue);
        }

        case MetadataFieldType.DATE: {
            const dateValue = new Date(value);

            if (Number.isNaN(dateValue.getTime())) {
                throw new ApiError(400, 'Metadata value must be a valid date.');
            }

            return value;
        }

        case MetadataFieldType.BOOLEAN: {
            const allowedValues = ['true', 'false'];

            if (!allowedValues.includes(String(value).toLowerCase())) {
                throw new ApiError(400, 'Metadata value must be true or false.');
            }

            return String(value).toLowerCase();
        }

        case MetadataFieldType.SELECT: {
            if (!Array.isArray(options)) {
                throw new ApiError(400, 'SELECT metadata field options are invalid.');
            }

            if (!options.includes(value)) {
                throw new ApiError(
                    400,
                    'Metadata value must be one of the allowed options.',
                );
            }

            return value;
        }

        default:
            throw new ApiError(400, 'Invalid metadata field type.');
    }
};

// Metadata Field Operations
export const getAllMetadataFieldsService = async () => {
    const metadataFields = await prisma.metadataField.findMany({
        orderBy: {
            createdAt: 'desc',
        },
    });

    return metadataFields;
};

export const createMetadataFieldService = async (metadataFieldData: MetadataFieldData) => {
    const { name, key, type, isRequired, isActive, options } = metadataFieldData;

    if (!name?.trim()) {
        throw new ApiError(400, 'Metadata field name is required.');
    }

    if (!key?.trim()) {
        throw new ApiError(400, 'Metadata field key is required.');
    }

    const normalizedKey = normalizeMetadataKey(key);

    validateSelectOptions(type, options);

    const existingField = await prisma.metadataField.findUnique({
        where: {
            key: normalizedKey,
        },
    });

    if (existingField) {
        throw new ApiError(409, 'Metadata field with this key already exists.');
    }

    const metadataField = await prisma.metadataField.create({
        data: {
            name: name.trim(),
            key: normalizedKey,
            type,
            isRequired: isRequired ?? false,
            isActive: isActive ?? true,
            options: options ?? undefined,
        },
    });

    return metadataField;
};

export const updateMetadataFieldService = async (
    metadataFieldId: number,
    metadataFieldData: UpdateMetadataFieldData,
) => {
    if (!metadataFieldId || Number.isNaN(metadataFieldId)) {
        throw new ApiError(400, 'Valid metadata field ID is required.');
    }

    const existingField = await prisma.metadataField.findUnique({
        where: {
            id: metadataFieldId,
        },
    });

    if (!existingField) {
        throw new ApiError(404, 'Metadata field not found.');
    }

    const finalType = metadataFieldData.type ?? existingField.type;
    const finalOptions = metadataFieldData.options ?? existingField.options;

    validateSelectOptions(finalType, finalOptions);

    const normalizedKey = metadataFieldData.key
        ? normalizeMetadataKey(metadataFieldData.key)
        : undefined;

    if (normalizedKey && normalizedKey !== existingField.key) {
        const duplicateField = await prisma.metadataField.findUnique({
            where: {
                key: normalizedKey,
            },
        });

        if (duplicateField) {
            throw new ApiError(409, 'Metadata field with this key already exists.');
        }
    }

    const updatedMetadataField = await prisma.metadataField.update({
        where: {
            id: metadataFieldId,
        },
        data: {
            name: metadataFieldData.name?.trim(),
            key: normalizedKey,
            type: metadataFieldData.type,
            isRequired: metadataFieldData.isRequired,
            isActive: metadataFieldData.isActive,
            options: metadataFieldData.options! as unknown as string,
        },
    });

    return updatedMetadataField;
};

export const deleteMetadataFieldService = async (metadataFieldId: number) => {
    if (!metadataFieldId || Number.isNaN(metadataFieldId)) {
        throw new ApiError(400, 'Valid metadata field ID is required.');
    }

    const metadataField = await prisma.metadataField.findUnique({
        where: {
            id: metadataFieldId,
        },
    });

    if (!metadataField) {
        throw new ApiError(404, 'Metadata field not found.');
    }

    const documentMetadataCount = await prisma.documentMetadata.count({
        where: {
            metadataField_id: metadataFieldId,
        },
    });

    if (documentMetadataCount > 0) {
        throw new ApiError(
            409,
            'Metadata field cannot be deleted because it is used by documents.',
        );
    }

    const deletedMetadataField = await prisma.metadataField.delete({
        where: {
            id: metadataFieldId,
        },
    });

    return deletedMetadataField;
};

export const getMetadataFieldByIdService = async (metadataFieldId: number) => {
    if (!metadataFieldId || Number.isNaN(metadataFieldId)) {
        throw new ApiError(400, 'Valid metadata field ID is required.');
    }

    const metadataField = await prisma.metadataField.findUnique({
        where: {
            id: metadataFieldId,
        },
    });

    if (!metadataField) {
        throw new ApiError(404, 'Metadata field not found.');
    }

    return metadataField;
};

// Document Metadata Operations
export const getDocumentMetadataService = async (documentId: number) => {

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

    const metadata = await prisma.documentMetadata.findMany({
        where: {
            document_id: documentId,
        },
        include: {
            metadataField: true,
        },
        orderBy: {
            createdAt: 'asc',
        },
    });

    return metadata;
};

export const addDocumentMetadataService = async (
    documentId: number,
    metadataInput: DocumentMetadataInput,
) => {

    if (!documentId || Number.isNaN(documentId)) {
        throw new ApiError(400, 'Valid document ID is required.');
    }

    const { metadata_field_id, value } = metadataInput;

    if (!metadata_field_id || Number.isNaN(metadata_field_id)) {
        throw new ApiError(400, 'Valid metadata field ID is required.');
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
        throw new ApiError(400, 'Cannot add metadata to deleted document.');
    }

    const metadataField = await prisma.metadataField.findUnique({
        where: {
            id: metadata_field_id,
        },
    });

    if (!metadataField) {
        throw new ApiError(404, 'Metadata field not found.');
    }

    if (!metadataField.isActive) {
        throw new ApiError(400, 'Metadata field is not active.');
    }

    const validatedValue = validateMetadataValue(
        metadataField.type,
        value,
        metadataField.options,
    );

    const existingDocumentMetadata = await prisma.documentMetadata.findUnique({
        where: {
            document_id_metadataField_id: {
                document_id: documentId,
                metadataField_id: metadata_field_id,
            },
        },
    });

    if (existingDocumentMetadata) {
        throw new ApiError(
            409,
            'Metadata value already exists for this document and field.',
        );
    }

    const documentMetadata = await prisma.documentMetadata.create({
        data: {
            document_id: documentId,
            metadataField_id: metadata_field_id,
            value: validatedValue,
        },
        include: {
            metadataField: true,
        },
    });

    return documentMetadata;
};

export const updateDocumentMetadataService = async (
    documentId: number,
    metadataFieldId: number,
    value: string,
) => {
    if (!documentId || Number.isNaN(documentId)) {
        throw new ApiError(400, 'Valid document ID is required.');
    }

    if (!metadataFieldId || Number.isNaN(metadataFieldId)) {
        throw new ApiError(400, 'Valid metadata field ID is required.');
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
        throw new ApiError(400, 'Cannot update metadata of deleted document.');
    }

    const metadataField = await prisma.metadataField.findUnique({
        where: {
            id: metadataFieldId,
        },
    });

    if (!metadataField) {
        throw new ApiError(404, 'Metadata field not found.');
    }

    if (!metadataField.isActive) {
        throw new ApiError(400, 'Metadata field is not active.');
    }

    const existingDocumentMetadata = await prisma.documentMetadata.findUnique({
        where: {
            document_id_metadataField_id: {
                document_id: documentId,
                metadataField_id: metadataFieldId,
            },
        },
    });

    if (!existingDocumentMetadata) {
        throw new ApiError(404, 'Document metadata not found.');
    }

    const validatedValue = validateMetadataValue(
        metadataField.type,
        value,
        metadataField.options,
    );

    const updatedDocumentMetadata = await prisma.documentMetadata.update({
        where: {
            document_id_metadataField_id: {
                document_id: documentId,
                metadataField_id: metadataFieldId,
            },
        },
        data: {
            value: validatedValue,
        },
        include: {
            metadataField: true,
        },
    });

    return updatedDocumentMetadata;
};

export const removeDocumentMetadataService = async (
    documentId: number,
    metadataFieldId: number,
) => {
    if (!documentId || Number.isNaN(documentId)) {
        throw new ApiError(400, 'Valid document ID is required.');
    }

    if (!metadataFieldId || Number.isNaN(metadataFieldId)) {
        throw new ApiError(400, 'Valid metadata field ID is required.');
    }

    const existingDocumentMetadata = await prisma.documentMetadata.findUnique({
        where: {
            document_id_metadataField_id: {
                document_id: documentId,
                metadataField_id: metadataFieldId,
            },
        },
    });

    if (!existingDocumentMetadata) {
        throw new ApiError(404, 'Document metadata not found.');
    }

    const deletedDocumentMetadata = await prisma.documentMetadata.delete({
        where: {
            document_id_metadataField_id: {
                document_id: documentId,
                metadataField_id: metadataFieldId,
            },
        },
    });

    return deletedDocumentMetadata;
};