import { StaffNotInProject, StaffProject } from "../staff/types";

export interface Project {
  projectId: number;
  projectName: string;
  projectCode: string;
  startDate?: string;
  endDate?: string;
  budget: number;
  isDeleted: boolean;
  projectDetail?: string;
  staffProjects: StaffProject[];
  createAt?: string;
  createBy?: string;
  updateAt?: string;
  updateBy?: string;
  deleteAt?: string;
  deleteBy?: string;
}

export interface RoleInProject {
  roleProjectId: number;
  name: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error: string | null;
}
