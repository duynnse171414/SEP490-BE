import useSWR from "swr";
import { fetcher } from "@/api/fetchers";
import { ClaimRequestDTO } from "../types";
import { ApiResponse } from "@/types/ApiResponse";

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
