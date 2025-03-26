import {  fetcher } from "@/api/fetchers";
import { ApiResponse } from "@/types/ApiResponse";
import useSWR from "swr";
import { GetAllProject } from "../types";

export const useProject = () => {
    const { data, error, isLoading } = useSWR<ApiResponse<GetAllProject>>(
      `/Project/owned`,
      fetcher,
    );
  
    return { data: data?.data || [], error, isLoading };
  };