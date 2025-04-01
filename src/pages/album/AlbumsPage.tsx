import { useState } from "react";
import { useAlbums } from "@/features/albums/hooks/useAlbums";
import { useUsers } from "@/features/users/hooks/useUsers";
import SplashScreen from "@/sections/SplashScreen";
import AlbumsFilter from "@/features/albums/components/AlbumsFilter";
import AlbumsGrid from "@/features/albums/components/AlbumsGrid";

const AlbumsPage: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [userId, setUserId] = useState<string>("all");
  const limit: number = 12;

  const { data: albums, error, isLoading } = useAlbums({
    page,
    limit,
    userId: userId === "all" ? "" : userId,
  });
  const { data: users } = useUsers();

  const handleUserChange = (value: string) => {
    setUserId(value);
    setPage(1);
  };

  return (
    <div className="p-6 mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-center">Albums</h1>
      <AlbumsFilter userId={userId} onUserChange={handleUserChange} users={users} />

      {isLoading ? (
        <SplashScreen />
      ) : error ? (
        <div className="text-center my-8 text-red-500">
          Error: {error.message}
        </div>
      ) : (
        <AlbumsGrid albums={albums} users={users} />
      )}
    </div>
  );
};

export default AlbumsPage;
