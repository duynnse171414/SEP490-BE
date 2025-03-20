import axiosInstance from "./axiosInstance";

export const fetcher = (url: string) =>
  axiosInstance.get(url).then((res) => res.data);

export const fetcherWithParams = (url: string, params: Record<string, any>) =>
  axiosInstance.get(url, { params }).then((res) => res.data);

export const postData = (url: string, data: any) =>
  axiosInstance.post(url, data).then((res) => res.data);

export const putData = (url: string, data: any) =>
  axiosInstance.put(url, data).then((res) => res.data);

export const deleteData = (url: string) =>
  axiosInstance.delete(url).then((res) => res.data);
