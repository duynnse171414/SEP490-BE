export interface ClaimRequest {
  claimId: string;
  projectId: number;
  staffId: string;
  approvedBy: string | null;
  rejectBy: string | null;
  workingHours: number;
  claimStatus: number;
  claimAmount: number;
  claimDate: string;
  createAt: string;
  updateAt: string | null;
  approvedAt: string | null;
  rejectAt: string | null;
  rejectionReason: string | null;
  deleteAt: string | null;
  isDelete: boolean;
  approver: string | null;
  rejecter: string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
