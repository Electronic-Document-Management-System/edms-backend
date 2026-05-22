import { Prisma } from "@prisma/client";

import { ACTIONS, RESOURCES, SCOPES } from '../constants';

export type Resource = (typeof RESOURCES)[keyof typeof RESOURCES];
export type Action = (typeof ACTIONS)[keyof typeof ACTIONS];
export type Scope = (typeof SCOPES)[keyof typeof SCOPES];

export type PermissionInput = {
  resource: Resource;
  action: Action;
  scope: Scope;
};

export type UserWithPermissions = Prisma.UserGetPayload<{
  include: {
    roles: {
      include: {
        role: {
          include: {
            rolePermissions: {
              include: {
                permission: true;
              };
            };
          };
        };
      };
    };
  };
}>;

export type RoleData = {
  name: string;
  description?: string;
};

export type PermissionData = {
  resource: Resource;
  action: Action;
  scope: Scope;
};
