export interface newUserDataType {
    name: string;
    email: string;
    password_hash: string;
    dept_id: number;
}

export interface updateUserDataType {
    name?: string;
    email?: string;
    dept_id?: number;
}

export const safeUserSelect = {
  id: true,
  name: true,
  email: true,
  dept_id: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
};
