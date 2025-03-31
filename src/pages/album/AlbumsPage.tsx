import { useState } from "react";
import { useAlbums } from "@/features/albums/hooks/useAlbums";
import { useUsers } from "@/features/users/hooks/useUsers";
import AlbumsFilter from "@/features/albums/components/AlbumsFilter";
import AlbumsGrid from "@/features/albums/components/AlbumsGrid";
import CustomPagination from "@/components/common/CustomPagination";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const AlbumsPage = () => {
  const [page, setPage] = useState<number>(1);
  const [userId, setUserId] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const limit: number = 12;

  const { data: albums, error, isLoading } = useAlbums({
    page,
    limit,
    userId: userId === "all" ? "" : userId,
    searchTerm: searchTerm || undefined
  });
  const { data: users } = useUsers();

  const handleUserChange = (value: string) => {
    setUserId(value);
    setPage(1);
  };

  const handleSearch = () => {
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const hasNextPage = albums?.length === limit;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Albums</h1>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Input
              type="text"
              placeholder="Tìm kiếm album..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          </div>
        </div>
        <AlbumsFilter userId={userId} onUserChange={handleUserChange} users={users} />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="text-center my-8 text-red-500">
          Error: {error.message}
        </div>
      ) : (
        <>
          <AlbumsGrid albums={albums} users={users} />
          {albums && albums.length > 0 && (
            <div className="mt-8">
              <CustomPagination
                page={page}
                hasNextPage={hasNextPage}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AlbumsPage;
