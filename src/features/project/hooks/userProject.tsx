import useSWR from "swr";
import { Project, ProjectReponse } from "../types";
import { fetcherWithParams } from "@/api/fetchers";

// import { useState } from "react";
// import { getStaffs } from "@/api/staffs";

const BASE_URL = "https://localhost:7100/api";

export const useProjects = (page: number) => {
  const { data, error, mutate } = useSWR<ProjectReponse>(
    BASE_URL + `/Project/GetProjects?page=${page}`, // Thay api/staffs bằng endpoint
    (url) => fetcherWithParams(url, {}),
    {
      dedupingInterval: 60000,
      refreshInterval: 0,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );
  return { data, error, isLoading: !data && !error, mutate };
};

// export const useProject = (id: number) => {
//   const { data, error, mutate } = useSWR<{ data: Project }>(
//     BASE_URL + `/Project/${id}`,
//     (url) => fetcherWithParams(url, {}),
//     {
//       dedupingInterval: 60000,
//       refreshInterval: 0,
//       revalidateOnFocus: false,
//       revalidateOnReconnect: true,
//     }
//   );

//   return {
//     data: data?.data, // Lấy đúng dữ liệu trong "data"
//     error,
//     isLoading: !data && !error,
//     mutate,
//   };
// };
