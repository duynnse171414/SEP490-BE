import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { usePhotos } from "@/features/photos/hooks/usePhotos";
import { useAlbum } from "@/features/albums/hooks/useAlbums";
import SplashScreen from "@/sections/SplashScreen";
import { Photo } from "@/features/photos/types";
import PhotoGrid from "@/features/photos/components/PhotoGrid";
import PhotoModal from "@/features/photos/components/PhotoModal";
import PhotosHeader from "@/features/photos/components/PhotosHeader";
import CustomPagination from "@/components/common/CustomPagination";

const PhotosPage: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const limit: number = 24;

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const albumId = queryParams.get("albumId") || "";

  const {
    data: photos,
    error,
    isLoading,
  } = usePhotos({ page, limit, albumId });
  const { data: album } = useAlbum(albumId);

  // Reset page when albumId changes
  useEffect(() => {
    setPage(1);
  }, [albumId]);

  return (
    <div className="p-6 mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-center">Photos</h1>

      <PhotosHeader album={album} albumId={albumId} />

      {isLoading ? (
        <SplashScreen />
      ) : error ? (
        <div className="text-center my-8 text-red-500">
          Error: {error.message}
        </div>
      ) : (
        <>
          <PhotoGrid photos={photos} onPhotoSelect={setSelectedPhoto} />
          <CustomPagination
            page={page}
            hasNextPage={photos?.length === limit}
            onPageChange={setPage}
          />
        </>
      )}

      <PhotoModal
        selectedPhoto={selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
      />
    </div>
  );
};

export default PhotosPage;
