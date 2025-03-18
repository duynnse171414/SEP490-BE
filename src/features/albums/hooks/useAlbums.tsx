import useSWR from "swr";
import { Album } from "../types";
import { fetcher } from "@/api/fetchers";

export const useAlbum = (albumId?: string) => {
  const { data, error, mutate } = useSWR<Album>(
    albumId ? `/albums/${albumId}` : null,
    fetcher,
    {
      dedupingInterval: 60000,
      refreshInterval: 0,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  return { data, error, isLoading: !data && !error, mutate };
};

export const useAlbumsByUserId = ({ userId }: { userId?: string }) => {
  const endpoint = userId ? `/albums?userId=${userId}` : "/albums";

  const { data, error, mutate } = useSWR<Album[]>(endpoint, fetcher, {
    dedupingInterval: 60000,
    refreshInterval: 0,
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
  });

  return { data, error, isLoading: !data && !error, mutate };
};

export const useAlbums = ({
  page,
  limit,
  userId,
}: {
  page: number;
  limit: number;
  userId?: string;
}) => {
  const endpoint = userId
    ? `/albums?userId=${userId}&_page=${page}&_limit=${limit}`
    : `/albums?_page=${page}&_limit=${limit}`;

  const { data, error, mutate } = useSWR<Album[]>(endpoint, fetcher, {
    dedupingInterval: 60000,
    refreshInterval: 0,
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
  });

  return { data, error, isLoading: !data && !error, mutate };
};
