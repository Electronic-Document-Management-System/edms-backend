import { prisma } from '../../config/db.config';
import { DepartmentData } from '../../types/dept';
import ApiError from '../../utils/ApiError';

export const getAllDepartmentsService = async () => {
    const departments = await prisma.department.findMany({
        orderBy: {
            name: 'asc',
        },
    });

    return departments;
};

export const getDepartmentByIdService = async (departmentId: number) => {
    if (!departmentId || Number.isNaN(departmentId)) {
        throw new ApiError(400, 'Valid department ID is required.');
    }

    const department = await prisma.department.findUnique({
        where: {
            id: departmentId,
        },
    });

    if (!department) {
        throw new ApiError(404, 'Department not found.');
    }

    return department;
};

export const createNewDepartmentService = async (
    departmentData: DepartmentData,
) => {
    if (!departmentData?.name) {
        throw new ApiError(400, 'Department name is required.');
    }

    const existedDept = await prisma.department.findFirst({
        where: {
            name: departmentData.name,
        },
    });

    if (existedDept) {
        throw new ApiError(409, 'Department already exists.');
    }

    const newDepartment = await prisma.department.create({
        data: departmentData,
    });

    return newDepartment;
};

export const updateDepartmentService = async (
    departmentId: number,
    departmentData: Partial<DepartmentData>,
) => {
    if (!departmentId || Number.isNaN(departmentId)) {
        throw new ApiError(400, 'Valid department ID is required.');
    }

    const existingDepartment = await prisma.department.findUnique({
        where: {
            id: departmentId,
        },
    });

    if (!existingDepartment) {
        throw new ApiError(404, 'Department not found.');
    }

    if (departmentData.name) {
        const departmentWithSameName = await prisma.department.findFirst({
            where: {
                name: departmentData.name,
                NOT: {
                    id: departmentId,
                },
            },
        });

        if (departmentWithSameName) {
            throw new ApiError(409, 'Department name already exists.');
        }
    }

    const updatedDept = await prisma.department.update({
        where: {
            id: departmentId,
        },
        data: departmentData,
    });

    return updatedDept;
};

export const deleteDepartmentService = async (departmentId: number) => {
  if (!departmentId || Number.isNaN(departmentId)) {
    throw new ApiError(400, 'Valid department ID is required.');
  }

  const department = await prisma.department.findUnique({
    where: {
      id: departmentId,
    },
  });

  if (!department) {
    throw new ApiError(404, 'Department not found.');
  }

  const userCount = await prisma.user.count({
    where: {
      dept_id: departmentId,
    },
  });

  if (userCount > 0) {
    throw new ApiError(
      409,
      'Department cannot be deleted because it has assigned users.',
    );
  }

  const folderCount = await prisma.folder.count({
    where: {
      dept_id: departmentId,
    },
  });

  if (folderCount > 0) {
    throw new ApiError(
      409,
      'Department cannot be deleted because it contains folders.',
    );
  }

  const documentCount = await prisma.document.count({
    where: {
      dept_id: departmentId,
    },
  });

  if (documentCount > 0) {
    throw new ApiError(
      409,
      'Department cannot be deleted because it contains documents.',
    );
  }

  const deletedDepartment = await prisma.department.delete({
    where: {
      id: departmentId,
    },
  });

  return deletedDepartment;
};