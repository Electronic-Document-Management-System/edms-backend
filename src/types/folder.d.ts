export type FolderData = {
    name: string;
    description?: string;
    dept_id: number;
    parent_id?: number | null;
    createdById: number;
};

export type GetFoldersFilter = {
    departmentId?: number;
    parentId?: number | null;
};
