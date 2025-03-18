import useSWR from "swr";
import { fetcher } from "@/api/fetchers";
import { User } from "../types";

export const useUser = (userId: string) => {
  const { data, error, mutate } = useSWR<User>(
    userId ? `/users/${userId}` : null,
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

export const useUsers = () => {
  const { data, error, mutate } = useSWR<User[]>("/users", fetcher, {
    dedupingInterval: 60000,
    refreshInterval: 0,
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
  });

  return { data, error, isLoading: !data && !error, mutate };
};
