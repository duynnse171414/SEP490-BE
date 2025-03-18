import { useState, useEffect } from "react";
import { useComments } from "@/features/comments/hooks/useComments";
import SplashScreen from "@/sections/SplashScreen";
import CommentsSearch from "@/features/comments/components/CommentsSearch";
import CommentsList from "@/features/comments/components/CommentsList";
import CustomPagination from "@/components/common/CustomPagination";

const CommentsPage: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const limit: number = 5;

  const { data: comments, error, isLoading } = useComments({ page, limit });
  const hasNextPage = comments?.length === limit;

  // Reset page when search term changes
  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  // Filter comments based on the search term
  const filteredComments = comments?.filter((comment) =>
    comment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    comment.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    comment.body.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-center">Comments</h1>

      <CommentsSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      {isLoading ? (
        <SplashScreen />
      ) : error ? (
        <div className="text-center my-8 text-red-500">Error: {error.message}</div>
      ) : (
        <>
          <CommentsList comments={filteredComments} />

          {/* Only show pagination when no search term is provided */}
          {!searchTerm && (
            <CustomPagination page={page} hasNextPage={hasNextPage} onPageChange={setPage} />
          )}
        </>
      )}
    </div>
  );
};

export default CommentsPage;
