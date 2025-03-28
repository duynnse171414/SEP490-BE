import { Project } from "../project/types";

export interface Staff {
  staffId: string;
  email: string;
  staffName: string;
  jobRank: string;
  salary: number;
  departmentName: string;
  isActive: boolean;
  createAt: string;
  countProject: number;
}

export interface StaffResponse {
  items: Staff[];
  totalPages: number;
}

export interface StaffProject {
  projectId: number;
  staffId: string;
  roleInProjectId: number;
  startDate: string; // DateTime sẽ được nhận dưới dạng string (ISO 8601)
  endDate: string;
  project: Project;
  staff: Staff;
  roleInProject: string;
  createAt?: string | null;
  createBy?: string | null;
  updateAt?: string | null;
  updateBy?: string | null;
  deleteAt?: string | null;
  deleteBy?: string | null;
}

export interface StaffNotInProject {
  staffId: string;
  roleInProjectId: number;
  startDate: string; // DateTime trong C# thường được trả về dưới dạng string ISO 8601
  endDate: string;
  createAt?: string;
  createBy?: string;
}
