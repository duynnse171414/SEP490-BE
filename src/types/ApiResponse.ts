export interface ClaimRequest {
  claimId: string;
  staffId: string;
  staffName: string;
  projectName: string | null;
  workingHours: number;
  claimAmount: number;
  claimStatus: number;
  claimDate: string;
  createAt: string;
  updateAt: string | null;
  approvedAt: string | null;
  approvedBy: string | null;
  pprojectId: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: String;
  data?: T;
  error?: string[];
}
