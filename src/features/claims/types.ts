export enum ClaimStatus {
    Draft = 0,
    PendingApproval = 1,
    Approved = 2,
    Paid = 3,
    Rejected = 4,
    Cancelled = 5
}
export interface ClaimRequestDTO {
    claimId: string;
    projectId: number;
    staff: {
        staffId: string;
        staffName: string;
    };
    workingHours: number;
    claimStatus: ClaimStatus;
    claimAmount: number;
    claimDate: Date;
    createAt: Date;
    updateAt?: Date | null;
    approvedByUser?: {
        staffId: string;
        staffName: string;
    } | null;
    approvedAt?: Date | null;
    rejectedByUser?: {
        staffId: string;
        staffName: string;
    } | null;
    rejectAt?: Date | null;
    rejectionReason?: string | null;
    isDeleted: boolean;

    // The following fields are kept for UI display purposes
    project: {
        projectId: number;
        projectName: string;
        projectCode?: string | null;
        startDate?: Date | null;
        endDate?: Date | null;
        budget: number;
        projectDetail?: string | null;
        createdDate: Date;
        createdBy?: string | null;
        staffs?: any[] | null;
    };
    logs: any[];
}
