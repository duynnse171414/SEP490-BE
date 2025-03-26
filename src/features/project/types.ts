import { Staff } from "@/features/admin/types";
export interface Project {
  projectId: number;
  projectName: string;
  projectCode: string;
  startDate: string;
  endDate: string;
  isDeleted: boolean;
  staffs: Staff[];
}

export interface ProjectReponse {
  items: Project[];
  totalPages: number;
}
