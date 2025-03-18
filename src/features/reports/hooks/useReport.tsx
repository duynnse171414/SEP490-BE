import { fetcher } from "@/api/fetchers";
import useSWR from "swr";

export const useReport = () => {
    const { data, error, isLoading } = useSWR<Report[]>(
      `posts}`,
      fetcher,
      {
        dedupingInterval: 60000,
        refreshInterval: 0,
        revalidateOnFocus: false,
        revalidateOnReconnect: true,
      }
    );
  
    return { data, error, isLoading };
  };
  