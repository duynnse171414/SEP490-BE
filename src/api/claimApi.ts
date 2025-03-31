import { fetcher, postData } from "./fetchers";
import { ClaimRequest } from "@/types/claims";

// Thêm interface cho request body filter
export interface FilterRequest {
  ClaimStatus?: string;
  ProjectId?: number | null;
  StaffId?: string | null;
  ApprovedBy?: string | null;
  FromDate?: string | null;
  ToDate?: string | null;
  SearchTerm?: string | null;
}

export interface ClaimStats {
  totalClaims: number;
  draftClaims: number;
  pendingClaims: number;
  rejectReturnClaims: number;
  approvedClaims: number;
  paidClaims: number;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const claimApi = {
  filterClaims: async (
    claimStatus: string,
    sortBy: string = "createAt",
    sortOrder: "asc" | "desc" = "desc",
    pageIndex: number = 1,
    pageSize: number = 10
  ): Promise<ApiResponse<ClaimRequest[]>> => {
    try {
      const url = `ClaimRequests/filter?sortBy=${sortBy}&sortOrder=${sortOrder}&pageIndex=${pageIndex}&pageSize=${pageSize}`;
      const response = await postData(
        url,
        JSON.stringify({
          ClaimStatus: claimStatus,
        })
      );
      return response;
    } catch (error: any) {
      if (error.response?.status === 404) {
        // Nếu không có data, trả về response thành công với mảng rỗng
        return {
          success: true,
          data: [],
          message: "No data found",
        };
      }
      throw error; // Ném lại lỗi nếu không phải 404
    }
  },

  getNumberAllClaims: async () => {
    try {
      const url = `ClaimRequests/get-number-all-claims`;
      const response = await fetcher(url);
      return response;
    } catch (error) {
      console.error("Error fetching total claims:", error);
      return {
        success: false,
        data: { totalClaims: 0 },
        message: "Error fetching total claims",
      };
    }
  },
};
