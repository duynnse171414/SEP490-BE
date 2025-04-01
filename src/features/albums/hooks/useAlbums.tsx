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
  const { data, error, mutate } = useSWR<Album[]>(
    userId ? `/albums?userId=${userId}` : null,
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

export const useAlbums = ({
  page,
  limit,
  userId,
  searchTerm,
}: {
  page: number;
  limit: number;
  userId?: string;
  searchTerm?: string;
}) => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (userId) {
    queryParams.append("userId", userId);
  }

  if (searchTerm) {
    queryParams.append("searchTerm", searchTerm);
  }

  const { data, error, mutate } = useSWR<Album[]>(
    `/albums?${queryParams.toString()}`,
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
