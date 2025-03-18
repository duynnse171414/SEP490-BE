import useSWR from "swr";
import { fetcher } from "@/api/fetchers";
import { Photo } from "../types";

interface UsePhotosParams {
  page: number;
  limit: number;
  albumId?: string;
}

export const usePhotos = ({ page, limit, albumId }: UsePhotosParams) => {
  const query = albumId
    ? `/photos?albumId=${albumId}&_page=${page}&_limit=${limit}`
    : `/photos?_page=${page}&_limit=${limit}`;

  const { data, error, mutate } = useSWR<Photo[]>(query, fetcher, {
    dedupingInterval: 60000,
    refreshInterval: 0,
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
  });

  return { data, error, isLoading: !data && !error, mutate };
};
