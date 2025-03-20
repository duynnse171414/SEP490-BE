// import { listStaffs } from "@/types/Staff/staffResponse";
// import axiosInstance from "./axiosInstance";
import { listStaffs } from "@/types/Staff/staffResponse";
import axiosInstance from "./axiosInstance";
import { fetcherWithParams } from "./fetchers";

export const getStaffs = (page?: number) => {
  const params = page ? { page } : undefined; // Tạo object params
  return axiosInstance.get<listStaffs>(`/Staffs/GetStaffs?page=${page}`);
};
