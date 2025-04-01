import useSWR from "swr";
import { fetcher, putData } from "@/api/fetchers";
import { ClaimRequestDTO } from "../types";
import { ApiResponse } from "@/types/ApiResponse";
import { useState } from "react";

interface UseClaimsByPMProps {
    status?: number;
}

export const useClaimsByPM = ({ status }: UseClaimsByPMProps = {}) => {
    const endpoint = status !== undefined
        ? `/ClaimRequests/get-claim-by-status-PM?status=${status}`
        : '/ClaimRequests/get-claim-by-status-PM';

    const { data, error, mutate } = useSWR<ApiResponse<ClaimRequestDTO[]>>(endpoint, fetcher);

    return {
        data,
        error,
        isLoading: !data && !error,
        mutate
    };
};

export const useApproveClaims = () => {
    const { mutate } = useClaimsByPM({ status: 2 });
    const [isApproving, setIsApproving] = useState(false);
  
    const approveSelectedClaims = async (selectedClaims: string[]) => {
      if (selectedClaims.length === 0) return;
      setIsApproving(true);
  
      console.log("Approving claims:", selectedClaims);
  
      try {
        const response = await putData("/ClaimRequests/approve", selectedClaims);
        console.log("API response:", response);
      } catch (error: any) {
        console.error("Error approving claims:", error.response?.data || error.message);
      } finally {
        setIsApproving(false);
        await mutate();
      }
    };
  
    return {
      approveSelectedClaims,
      isApproving,
    };
  };

  
export const useRejectClaims = () => {
  const { mutate } = useClaimsByPM({ status: 2 });
  const [isRejecting, setIsRejecting] = useState(false);

  const rejectSelectedClaims = async (selectedClaims: string[], rejectionReason: string) => {
    if (selectedClaims.length === 0) return;
    setIsRejecting(true);

    console.log("Rejecting claims:", selectedClaims, "Reason:", rejectionReason);

    try {
      const response = await putData("/ClaimRequests/reject", {
        claimIds: selectedClaims,
        rejectionReason,
      });
      console.log("API response:", response);
    } catch (error: any) {
      console.error("Error rejecting claims:", error.response?.data || error.message);
    } finally {
      setIsRejecting(false);
      await mutate();
    }
  };

  return {
    rejectSelectedClaims,
    isRejecting,
  };
};
