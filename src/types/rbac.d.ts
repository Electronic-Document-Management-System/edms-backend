import { Prisma } from "@prisma/client";

export type PermissionInput = {
    resource: string;
    action: string;
    scope: string;
}


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