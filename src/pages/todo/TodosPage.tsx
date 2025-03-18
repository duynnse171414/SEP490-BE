import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTodos } from "@/features/todos/hooks/useTodos";
import { Todo } from "@/features/todos/types";
import { useUsers } from "@/features/users/hooks/useUsers";
import { User } from "@/features/users/types";
import { Button } from "@/components/ui/button";
import SplashScreen from "@/sections/SplashScreen";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";

export const TodosPage = () => {
  const [page, setPage] = useState<number>(1);
  const [userId, setUserId] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const limit = 20;
  const {
    data: todos,
    error,
    isLoading,
    mutate,
  } = useTodos({
    page,
    limit,
    userId: userId === "all" ? "" : userId,
  });
  const { data: users } = useUsers();
  const filteredTodos = todos?.filter((todo: Todo) => {
    if (status === "all") return true;
    if (status === "completed") return todo.completed;
    if (status === "pending") return !todo.completed;
    return true;
  });
  const hasNextPage = todos?.length === limit;

  useEffect(() => {
    setPage(1);
  }, [userId]);

  const handlePageChange = (newPage: number) => {
    if (newPage > page && !hasNextPage) return;
    setPage(newPage);
  };

  const handleCheckboxChange = (todo: Todo) => {
    mutate(
      todos?.map((t) =>
        t.id === todo.id ? { ...t, completed: !todo.completed } : t
      ),
      false
    );
  };

  return (
    <div className="p-6 mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-center">Todo List</h1>
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6 justify-center">
        <Select value={userId} onValueChange={setUserId}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by user" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Users</SelectItem>
            {users?.map((user: User) => (
              <SelectItem key={user.id} value={user.id.toString()}>
                {user.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Tabs defaultValue="all" value={status} onValueChange={setStatus}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      {isLoading ? (
        <SplashScreen />
      ) : error ? (
        <div className="text-center my-8 text-red-500">
          Error: {error.message}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredTodos?.map((todo: Todo) => (
              <ContextMenu>
                <ContextMenuTrigger>
                  <Card
                    key={todo.id}
                    className="rounded-xl transition h-full"
                  >
                    <CardContent className="p-4 flex items-center h-full">
                      <label
                        htmlFor={`todo-${todo.id}`}
                        className="flex items-center gap-3 w-full"
                      >
                        <Checkbox
                          id={`todo-${todo.id}`}
                          checked={todo.completed}
                          onCheckedChange={() => handleCheckboxChange(todo)}
                          className="h-5 w-5 shrink-0"
                        />
                        <div className="flex-1">
                          <span
                            className={`text-sm font-medium transition ${
                              todo.completed
                                ? "line-through text-gray-500"
                                : "text-gray-900"
                            }`}
                          >
                            {todo.title}
                          </span>
                          {users && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Assigned to:{" "}
                              {users.find((u: User) => u.id === todo.userId)
                                ?.name || `User ${todo.userId}`}
                            </p>
                          )}
                        </div>
                      </label>
                    </CardContent>
                  </Card>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem onClick={() => handleCheckboxChange(todo)}>
                    Mark as {todo.completed ? "Pending" : "Completed"}
                  </ContextMenuItem>
                  <ContextMenuItem onClick={() => console.log("Delete", todo.id)}>
                    Delete
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(page - 1)}
                    aria-disabled={page === 1}
                  />
                </PaginationItem>
                {page > 2 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
                {page > 1 && (
                  <PaginationItem>
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(page - 1)}
                    >
                      {page - 1}
                    </Button>
                  </PaginationItem>
                )}
                <PaginationItem>
                  <Button variant="default">{page}</Button>
                </PaginationItem>
                {hasNextPage && (
                  <PaginationItem>
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(page + 1)}
                    >
                      {page + 1}
                    </Button>
                  </PaginationItem>
                )}
                {hasNextPage && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => {
                      if (hasNextPage) {
                        handlePageChange(page + 1);
                      }
                    }}
                    aria-disabled={!hasNextPage}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </>
      )}
    </div>
  );
};

export default TodosPage;