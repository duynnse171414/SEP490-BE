export interface Staff {
  staffId: string;
  email: string;
  username: string;
  staffName: string;
  jobRank: string;
  salary: number;
  departmentName: string;
  roleInProject: string;
  isActive: boolean;
  createAt: string;
}

export interface StaffResponse {
  items: Staff[];
  totalPages: number;
}
