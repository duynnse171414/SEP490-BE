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
  projectId: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
