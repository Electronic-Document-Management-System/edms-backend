import { MetadataFieldType } from "@prisma/client";

export type MetadataFieldData = {
  name: string;
  key: string;
  type: MetadataFieldType;
  isRequired?: boolean;
  isActive?: boolean;
  options?: unknown;
};

export type UpdateMetadataFieldData = Partial<MetadataFieldData>;

export type DocumentMetadataInput = {
    metadata_field_id: number;
    value: string;
};

