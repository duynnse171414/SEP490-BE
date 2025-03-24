export enum ClaimStatus {
    Draft = 0,
    PendingApproval = 1,
    Approved = 2,
    Paid = 3,
    Rejected = 4,
    Cancelled = 5
}

export interface ClaimRequestDTO {
    projectId: number;
    staffId: string;
    approvedBy?: string | null;
    rejectBy?: string | null;
    workingHours: number;
    claimStatus: ClaimStatus;
    claimAmount: number;
    claimDate: Date;
    createAt: Date;
    updateAt?: Date | null;
    approvedAt?: Date | null;
    rejectAt?: Date | null;
    rejectionReason?: string | null;
    deleteAt?: Date | null;
    isDelete: boolean;

    // The following fields are kept for UI display purposes
    staffName: string;
    projectName: string;
}
