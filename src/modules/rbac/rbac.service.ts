import { prisma } from '../../config/db.config';
import { PermissionData, RoleData } from '../../types/rbac.d';
import ApiError from '../../utils/ApiError';

export const getAllRolesService = async () => {
  return await prisma.role.findMany({
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

  if (!role) {
    throw new ApiError(404, 'Role not found.');
  }

  return role;
};

export const getRolePermissionsService = async (roleId: number) => {
  const role = await prisma.role.findUnique({
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

  if (!role) {
    throw new ApiError(404, 'Role not found.');
  }

  return role;
};

export const getAllPermissionsService = async () => {
  return await prisma.permission.findMany({
    orderBy: {
      id: 'asc',
    },
  });
};

export const getUserRolesService = async (userId: number) => {
  const user = await prisma.user.findUnique({
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

  if (!user) {
    throw new ApiError(404, 'User not found.');
  }

  return user;
};

export const createRoleService = async (roleData: RoleData) => {
  const existingRole = await prisma.role.findFirst({
    where: {
      name: roleData.name,
    },
  });

  if (existingRole) {
    throw new ApiError(409, 'Role already exists.');
  }

  return await prisma.role.create({
    data: roleData,
  });
};

export const updateRoleService = async (
  roleId: number,
  roleData: Partial<RoleData>,
) => {
  const existingRole = await prisma.role.findUnique({
    where: {
      id: roleId,
    },
  });

  if (!existingRole) {
    throw new ApiError(404, 'Role not found.');
  }

  if (roleData.name) {
    const roleWithSameName = await prisma.role.findFirst({
      where: {
        name: roleData.name,
        NOT: {
          id: roleId,
        },
      },
    });

    if (roleWithSameName) {
      throw new ApiError(409, 'Role name already exists.');
    }
  }

  return await prisma.role.update({
    where: {
      id: roleId,
    },
    data: roleData,
  });
};

export const deleteRoleService = async (roleId: number) => {
  const existingRole = await prisma.role.findUnique({
    where: {
      id: roleId,
    },
  });

  if (!existingRole) {
    throw new ApiError(404, 'Role not found.');
  }

  return await prisma.role.delete({
    where: {
      id: roleId,
    },
  });
};

export const createPermissionService = async (
  permissionData: PermissionData,
) => {
  const existingPermission = await prisma.permission.findFirst({
    where: {
      resource: permissionData.resource,
      action: permissionData.action,
      scope: permissionData.scope,
    },
  });

  if (existingPermission) {
    throw new ApiError(409, 'Permission already exists.');
  }

  return await prisma.permission.create({
    data: permissionData,
  });
};

export const updatePermissionService = async (
  permissionId: number,
  permissionData: Partial<PermissionData>,
) => {
  const existingPermission = await prisma.permission.findUnique({
    where: {
      id: permissionId,
    },
  });

  if (!existingPermission) {
    throw new ApiError(404, 'Permission not found.');
  }

  return await prisma.permission.update({
    where: {
      id: permissionId,
    },
    data: permissionData,
  });
};

export const deletePermissionService = async (permissionId: number) => {
  const existingPermission = await prisma.permission.findUnique({
    where: {
      id: permissionId,
    },
  });

  if (!existingPermission) {
    throw new ApiError(404, 'Permission not found.');
  }

  return await prisma.permission.delete({
    where: {
      id: permissionId,
    },
  });
};

export const addPermissionToRoleService = async (
  roleId: number,
  permissionId: number,
) => {
  const role = await prisma.role.findUnique({
    where: {
      id: roleId,
    },
  });

  if (!role) {
    throw new ApiError(404, 'Role not found.');
  }

  const permission = await prisma.permission.findUnique({
    where: {
      id: permissionId,
    },
  });

  if (!permission) {
    throw new ApiError(404, 'Permission not found.');
  }

  const existingAssignment = await prisma.rolePermission.findUnique({
    where: {
      role_id_permission_id: {
        role_id: roleId,
        permission_id: permissionId,
      },
    },
  });

  if (existingAssignment) {
    throw new ApiError(409, 'Permission is already assigned to this role.');
  }

  return await prisma.rolePermission.create({
    data: {
      role_id: roleId,
      permission_id: permissionId,
    },
  });
};

export const removePermissionFromRoleService = async (
  roleId: number,
  permissionId: number,
) => {
  const existingAssignment = await prisma.rolePermission.findUnique({
    where: {
      role_id_permission_id: {
        role_id: roleId,
        permission_id: permissionId,
      },
    },
  });

  if (!existingAssignment) {
    throw new ApiError(404, 'Permission assignment not found.');
  }

  return await prisma.rolePermission.delete({
    where: {
      role_id_permission_id: {
        role_id: roleId,
        permission_id: permissionId,
      },
    },
  });
};
