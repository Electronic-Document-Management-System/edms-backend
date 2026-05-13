import { Role, User, UserRole } from "@prisma/client";

export type UserWithRoles = User & {
    roles?: (UserRole & {
        role: Role;
    })[];
};

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};