import { fetcher } from "@/api/fetchers";
import { ApiResponse } from "@/types/ApiResponse";
import useSWR from "swr";
import { GetAllPmOfProjectItem } from "../types";

export const usePmStaff = (projectId?: number) => {
  const shouldFetch = typeof projectId === 'number' && !isNaN(projectId);

  const { data, error, isLoading } = useSWR<ApiResponse<GetAllPmOfProjectItem>>(
    shouldFetch ? `/Staffs/product-manager/${projectId}` : null,
    fetcher,
  );

  return { data: (data?.data as GetAllPmOfProjectItem) || [], error, isLoading };
};