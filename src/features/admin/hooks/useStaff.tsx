import useSWR from "swr";
import { fetcherWithParams } from "@/api/fetchers";
import { Staff } from "../types";
// import { useState } from "react";
// import { getStaffs } from "@/api/staffs";

const BASE_URL = "https://localhost:7100/api";

export const useStaff = (page: number) => {
  const { data, error, mutate } = useSWR<Staff[]>(
    BASE_URL + `/Staff/GetStaffs?page=${page}`, // Thay api/staffs bằng endpoint của bạn
    (url) => fetcherWithParams(url, {}),
    {
      dedupingInterval: 60000,
      refreshInterval: 0,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      fallbackData: [], // khởi tạo data rỗng
    }
  );
  return { data, error, isLoading: !data && !error, mutate };
};

export const useStaffs = (pageNumber: number = 1) => {
  const params = { pageNumber };
  const { data, error, mutate } = useSWR<Staff[]>(
    BASE_URL + `/Staff/GetStaffs`,
    (url) => fetcherWithParams(url, { params }),
    {
      dedupingInterval: 60000,
      refreshInterval: 0,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  return { data, error, isLoading: !data && !error, mutate };
};
