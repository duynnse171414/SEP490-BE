export interface CreateClaimRequest {
    date: string;          
    workingHours: number;   
}

export interface ClaimRequestRequireDTO {
    projectId: number;                     
    approverId: string;                    
    listRequest: CreateClaimRequest[];    
    inforStaffs?: string[];                
    expectedDate?: string;                
}