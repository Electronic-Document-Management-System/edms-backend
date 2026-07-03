import { prisma } from "@/config/db.config"
import { newUserDataType, safeUserSelect, updateUserDataType } from "@/types/users";
import ApiError from "@/utils/ApiError"
import { hashPassword } from "@/modules/auth/auth.utils";

export const getAllUsersService = async ({ permission }: { permission?: string } = {}) => {

    const [resource, action, scope] = permission?.split(":") || ["", "", ""];

    const permissionExists = await prisma.permission.findUnique({
        where: {
            resource_action_scope: { resource, action, scope }
        }
    });

    console.log(permission);

    if (!permissionExists) {
        throw new ApiError(404, `Permission '${permission}' does not exist in the system`);
    };

    let permissionFilter = {};

    if (permission) {
        permissionFilter = {
            roles: {
                some: {
                    role: {
                        rolePermissions: {
                            some: {
                                permission: { resource, action, scope }
                            }
                        }
                    }
                }
            }
        }
    }

    const users = await prisma.user.findMany(
        {
            where: permissionFilter,
            select: safeUserSelect,
            orderBy: {
                createdAt: "desc"
            }
        }
    );
    if (!users) {
        throw new ApiError(404, "No users found");
    }
    return users;

};

export const getUserByIdService = async (userId: number) => {

    if (!userId || Number.isNaN(userId)) {
        throw new ApiError(400, 'Valid user ID is required.');
    };
    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: safeUserSelect,
    });

    if (!user) {
        throw new ApiError(404, "User not found");
    };
    return user;
};

export const createNewUserService = async (userData: newUserDataType) => {

    const { name, email, password_hash, dept_id } = userData;
    if ([name, email, password_hash, dept_id].some(value => !value)) {
        throw new ApiError(400, "all fields are required");
    };

    const existingUser = await prisma.user.findUnique({
        where: {
            email,
        },
    });
    if (existingUser) {
        throw new ApiError(409, 'User with this email already exists.');
    };
    const department = await prisma.department.findUnique({
        where: {
            id: dept_id,
        },
    });
    if (!department) {
        throw new ApiError(404, "Department not found");
    };

    const hashedPassword = await hashPassword(password_hash)

    const newUser = await prisma.user.create({
        data: { name, email, password_hash: hashedPassword, dept_id },
        select: safeUserSelect
    });
    if (!newUser) {
        throw new ApiError(500, "Failed to create user")
    };
    return newUser;

};

export const updateUserByIdService = async (
    userId: number,
    userData: updateUserDataType,
) => {
    if (!userId || Number.isNaN(userId)) {
        throw new ApiError(400, 'Valid user ID is required.');
    }

    const existingUser = await prisma.user.findUnique({
        where: {
            id: userId,
        },
    });

    if (!existingUser) {
        throw new ApiError(404, 'User not found.');
    }

    if (userData.email) {
        const emailAlreadyExists = await prisma.user.findUnique({
            where: {
                email: userData.email,
            },
        });

        if (emailAlreadyExists && emailAlreadyExists.id !== userId) {
            throw new ApiError(409, 'Email is already used by another user.');
        }
    }

    if (userData.dept_id) {
        const department = await prisma.department.findUnique({
            where: {
                id: userData.dept_id,
            },
        });

        if (!department) {
            throw new ApiError(404, 'Department not found.');
        }
    }

    const updatedUser = await prisma.user.update({
        where: {
            id: userId,
        },
        data: userData,
        select: {
            ...safeUserSelect,
            roles: {
                select: {
                    user_id: true,
                    role_id: true,
                    assigned_by: true,
                    assigned_at: true,
                    role: true,
                },
            },
        },
    });

    return updatedUser;
};

export const disableUserService = async (userId: number) => {

    if (!userId || Number.isNaN(userId)) {
        throw new ApiError(400, 'Valid user ID is required.');
    }

    const existingUser = await prisma.user.findUnique({
        where: {
            id: userId,
        },
    });

    if (!existingUser) {
        throw new ApiError(404, 'User not found.');
    }

    if (!existingUser.isActive) {
        throw new ApiError(400, 'User is already disabled.');
    }

    const disabledUser = await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            isActive: false,
        },
        select: safeUserSelect,
    });

    return disabledUser;
};


export const activateUserService = async (userId: number) => {
    if (!userId || Number.isNaN(userId)) {
        throw new ApiError(400, 'Valid user ID is required.');
    }

    const existingUser = await prisma.user.findUnique({
        where: {
            id: userId,
        },
    });

    if (!existingUser) {
        throw new ApiError(404, 'User not found.');
    }

    if (existingUser.isActive) {
        throw new ApiError(400, 'User is already active.');
    }

    const activatedUser = await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            isActive: true,
        },
        select: safeUserSelect,
    });

    return activatedUser;
};

export const assignRoleToUserService = async (
    userId: number,
    roleId: number,
) => {
    if (!userId || !roleId || Number.isNaN(userId) || Number.isNaN(roleId)) {
        throw new ApiError(400, 'Valid user ID and role ID are required.');
    }

    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
    });

    if (!user) {
        throw new ApiError(404, 'User not found.');
    }

    const role = await prisma.role.findUnique({
        where: {
            id: roleId,
        },
    });

    if (!role) {
        throw new ApiError(404, 'Role not found.');
    }

    const existingAssignment = await prisma.userRole.findUnique({
        where: {
            user_id_role_id: {
                user_id: userId,
                role_id: roleId,
            },
        },
    });

    if (existingAssignment) {
        throw new ApiError(409, 'Role is already assigned to this user.');
    }

    const userRole = await prisma.userRole.create({
        data: {
            user_id: userId,
            role_id: roleId,
        },
        include: {
            role: true,
        },
    });

    return userRole;
};

export const removeRoleFromUserService = async (userId: number, roleId: number) => {
    if (!userId || !roleId || Number.isNaN(userId) || Number.isNaN(roleId)) {
        throw new ApiError(400, 'Valid user ID and role ID are required.');
    }

    const existingAssignment = await prisma.userRole.findUnique({
        where: {
            user_id_role_id: {
                user_id: userId,
                role_id: roleId,
            },
        },
    });

    if (!existingAssignment) {
        throw new ApiError(404, 'Role assignment not found.');
    }

    await prisma.userRole.delete({
        where: {
            user_id_role_id: {
                user_id: userId,
                role_id: roleId,
            },
        },
    });

    return {
        userId,
        roleId,
        removed: true,
    };
};