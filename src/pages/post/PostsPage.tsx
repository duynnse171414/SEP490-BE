import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { usePostsRange } from "@/features/posts/hooks/usePosts";
import { PostCard } from "@/features/posts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUsers } from "@/features/users/hooks/useUsers";
import { User } from "@/features/users/types";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import SplashScreen from "@/sections/SplashScreen";

export const PostsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = Number(searchParams.get("page"));
  const currentPage = Number(pageParam) || 1;

  const [userId, setUserId] = useState<string>("all");
  const limit = 9;

  const { data: users } = useUsers();
  const {
    data: posts,
    error,
    isLoading,
  } = usePostsRange(
    currentPage,
    limit,
    userId && userId !== "all" ? userId : ""
  );

  const hasNextPage = posts?.length === limit;

  useEffect(() => {
    setSearchParams({ page: "1" });
  }, [userId]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || (newPage > currentPage && !hasNextPage)) return;
    setSearchParams({ page: String(newPage) });
  };

  return (
    <div className="p-6 mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-center">Posts</h1>

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
      </div>

      {/* Posts List */}
      {isLoading ? (
        <SplashScreen />
      ) : error ? (
        <div className="flex justify-center my-8">
          <p className="text-red-500">Error: {error.message}</p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {posts?.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-8 flex justify-center">
            <Pagination>
              <PaginationContent>
                {/* Previous Button */}
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(currentPage - 1)}
                    aria-disabled={currentPage === 1}
                  />
                </PaginationItem>

                {/* Ellipsis before previous page */}
                {currentPage > 2 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}

                {/* Previous Page Number */}
                {currentPage > 1 && (
                  <PaginationItem>
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      {currentPage - 1}
                    </Button>
                  </PaginationItem>
                )}

                {/* Current Page */}
                <PaginationItem>
                  <Button variant="default">{currentPage}</Button>
                </PaginationItem>

                {/* Next Page Number */}
                {hasNextPage && (
                  <PaginationItem>
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      {currentPage + 1}
                    </Button>
                  </PaginationItem>
                )}

                {/* Ellipsis after next page */}
                {hasNextPage && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}

                {/* Next Button */}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => {
                      if (hasNextPage) {
                        handlePageChange(currentPage + 1);
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

export default PostsPage;
