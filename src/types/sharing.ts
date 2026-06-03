import { SharePermission } from "@prisma/client";

export type ShareDocumentInput = {
  sharedWithUserId: number;
  permission?: SharePermission;
  message?: string;
  expiresAt?: string | Date | null;
};