import { prisma } from '../../config/db.config';

export const getAllRoleSServices = async () => {
  const roles = await prisma.role.findMany({
    orderBy: {
      id: 'asc',
    },
  });
};

export const getRoleByIdService = async (roleId: number) => {
  const role = await prisma.role.findUnique({
    where: {
      id: roleId,
    },
  });

  return role;
};

export const getRolePermissionsService = async (roleId: number) => {
  const rolePermissions = await prisma.role.findUnique({
    where: {
      id: roleId,
    },
    include: {
      rolePermissions: {
        include: {
          permission: true,
        },
      },
    },
  });

  return rolePermissions;
};

export const getAllPermissionsService = async () => {
  const permissions = await prisma.permission.findMany({
    orderBy: {
      id: 'asc',
    },
  });

  return permissions;
};

export const getUserRolesService = async (userId: number) => {
  const userRoles = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      roles: {
        include: {
          role: true,
        },
      },
    },
  });

  return userRoles;
};
