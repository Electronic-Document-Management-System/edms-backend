import { Role, User, UserRole, RolePermission, Permission } from '@prisma/client';

export type UserWithRolesAndPermissions = User & {
  roles: (UserRole & {
    role: Role & {
      rolePermissions: (RolePermission & {
        permission: Permission;
      })[];
    };
  })[];
};

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  
  dept_id: number;
  isActive: boolean;
  
  roles: {
    id: number;
    name: string;
  }[];
  
  permissions: string[];
}

export type AuthTokenPayload = {
  id: number;
  email: string;
  dept_id: number;
};

export type AuthUserPayload = {
  id: number;
  name: string;
  email: string;
  dept_id: number;
  isActive: boolean;
  roles: AuthRole[];
  permissions: string[];
};

export type RequestUser = {
  id: number;
  name: string;
  email: string;
  dept_id: number;
  isActive: boolean;
};