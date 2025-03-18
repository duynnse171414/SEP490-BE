import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";

interface PaginationProps {
  page: number;
  hasNextPage?: boolean;
  onPageChange: (newPage: number) => void;
}

const CustomPagination: React.FC<PaginationProps> = ({ page, hasNextPage, onPageChange }) => {
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || (newPage > page && !hasNextPage)) return;
    onPageChange(newPage);
  };

  return (
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
              <Button variant="outline" onClick={() => handlePageChange(page - 1)}>
                {page - 1}
              </Button>
            </PaginationItem>
          )}

          <PaginationItem>
            <Button variant="default">{page}</Button>
          </PaginationItem>

          {hasNextPage && (
            <PaginationItem>
              <Button variant="outline" onClick={() => handlePageChange(page + 1)}>
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
              onClick={() => handlePageChange(page + 1)}
              aria-disabled={!hasNextPage}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default CustomPagination;
