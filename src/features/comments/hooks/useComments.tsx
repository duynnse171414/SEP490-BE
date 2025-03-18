import useSWR from "swr";
import { fetcher } from "@/api/fetchers";
import { Comment } from "../types";

export const useComments = ({ page, limit }: { page: number; limit: number }) => {
  const { data, error, mutate } = useSWR<Comment[]>(
    `/comments?_page=${page}&_limit=${limit}`,
    fetcher
  );

  return { data, error, isLoading: !data && !error, mutate };
};
