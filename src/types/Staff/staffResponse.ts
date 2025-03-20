import { ApiResponse } from "./../ApiResponse";

export interface Staff {
  StaffId: string;
  Email: string;
  StaffName: string;
  JobRank: string;
  Salary: number;
  DepartmentName: string;
  IsActive: boolean;
  CreateAt: Date;
}

export type listStaffs = ApiResponse<Staff[]>;
