import useSWR from "swr";
import { fetcher } from "../../../api/fetchers";
import { Post } from "../types";

export const usePosts = (postId: string) => {
  const { data, error, isLoading, mutate } = useSWR<Post>(
    postId ? `/posts/${postId}` : null,
    fetcher,
    {
      dedupingInterval: 60000,
      refreshInterval: 0,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  return { data, error, isLoading, mutate };
};

export const usePostsByUserId = ({ userId }: { userId?: string }) => {
  const endpoint = userId ? `/posts?userId=${userId}` : "/posts";

  const { data, error, mutate } = useSWR<Post[]>(endpoint, fetcher, {
    dedupingInterval: 60000,
    refreshInterval: 0,
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
  });

  return { data, error, isLoading: !data && !error, mutate };
};

export const usePostsRange = (page: number, limit: number, userId?: string) => {
  const queryParams = new URLSearchParams({
    _page: page.toString(),
    _limit: limit.toString(),
  });
  
  if (userId) {
    queryParams.append("userId", userId);
  }
  
  const { data, error, isLoading } = useSWR<Post[]>(
    `posts?${queryParams.toString()}`,
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
