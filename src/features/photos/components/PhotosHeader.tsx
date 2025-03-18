import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Album } from "@/features/albums/types";

interface PhotosHeaderProps {
  album?: Album;
  albumId: string;
}

const PhotosHeader: React.FC<PhotosHeaderProps> = ({ album, albumId }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
      <div>
        {album && (
          <p className="text-gray-500 mt-1">Album: {album.title}</p>
        )}
      </div>
      {albumId && (
        <Link to="/albums" className="mt-4 md:mt-0">
          <Button variant="outline">Back to Albums</Button>
        </Link>
      )}
    </div>
  );
};

export default PhotosHeader;
