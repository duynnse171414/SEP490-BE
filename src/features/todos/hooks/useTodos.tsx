import useSWR from "swr";
import { fetcher } from "@/api/fetchers";
import { Todo } from "../types";

interface UseTodosProps {
  page: number;
  limit: number;
  userId?: string;
}

export const useTodos = ({ page, limit, userId }: UseTodosProps) => {
  const endpoint = userId
    ? `/todos?userId=${userId}&_page=${page}&_limit=${limit}`
    : `/todos?_page=${page}&_limit=${limit}`;

  const { data, error, mutate } = useSWR<Todo[]>(endpoint, fetcher, {
    dedupingInterval: 60000,
    refreshInterval: 0,
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
  });

  return { data, error, isLoading: !data && !error, mutate };
};

export const useTodosByUserId = ({ userId }: { userId?: string }) => {
  const endpoint = userId ? `/todos?userId=${userId}` : "/todos";

  const { data, error, mutate } = useSWR<Todo[]>(endpoint, fetcher, {
    dedupingInterval: 60000,
    refreshInterval: 0,
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
  });

  return { data, error, isLoading: !data && !error, mutate };
};
