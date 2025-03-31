import useSWR from "swr";
import { fetcher, fetcherWithParams, postData } from "@/api/fetchers";
import { Project, RoleInProject, ApiResponse } from "../types";
import { Staff, StaffNotInProject } from "@/features/staff/types";

const BASE_URL = "https://localhost:7100/api";

export const useProjects = () => {
  const { data, error, isLoading, mutate } = useSWR<Project[]>(
    `${BASE_URL}/Project`,
    fetcher,
    {
      dedupingInterval: 60000,
      refreshInterval: 0,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  return { data, error, isLoading, mutate };
};

export const useStaffNotInProject = (projectId: string) => {
  const { data, error, isLoading, mutate } = useSWR<Staff[]>(
    `${BASE_URL}/Staffs/get-staff-not-in-projects?projectId=${projectId}`,
    fetcher,
    {
      dedupingInterval: 60000,
      refreshInterval: 0,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  return { data, error, isLoading, mutate };
};

export const useRoleInProject = () => {
  const {
    data: apiResponse,
    error,
    isLoading,
    mutate,
  } = useSWR<ApiResponse<RoleInProject[]>>(
    `${BASE_URL}/Project/role-in-project`,
    fetcher,
    {
      dedupingInterval: 60000,
      refreshInterval: 0,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  const data = apiResponse?.data || [];

  return { data, error, isLoading, mutate };
};

export const useAddStaffToProject = async (
  data: StaffNotInProject[],
  projectId: number
) => {
  try {
    return await postData(
      `${BASE_URL}/Project/AddStaffInProject?projectId=${projectId}`,
      data
    );
  } catch (error) {
    console.error("Error adding staff to project:", error);
    throw error;
  }
};

export const useProject = (id: number) => {
  const { data, error, mutate } = useSWR<{ data: Project }>(
    BASE_URL + `/Project/${id}`,
    (url) => fetcherWithParams(url, {}),
    {
      dedupingInterval: 60000,
      refreshInterval: 0,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  return {
    data: data?.data, // Lấy đúng dữ liệu trong "data"
    error,
    isLoading: !data && !error,
    mutate,
  };
};
