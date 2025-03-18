import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Photo } from "@/features/photos/types";

interface PhotoGridProps {
  photos?: Photo[];
  onPhotoSelect: (photo: Photo) => void;
}

const PhotoGrid: React.FC<PhotoGridProps> = ({ photos, onPhotoSelect }) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
      {photos?.map((photo) => (
        <Card
          key={photo.id}
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onPhotoSelect(photo)}
        >
          <CardContent className="p-0">
            <img
              src={photo.thumbnailUrl}
              alt={photo.title}
              className="w-full h-40 object-cover"
            />
          </CardContent>
          <CardFooter className="p-2">
            <p className="text-xs text-gray-700 line-clamp-2">
              {photo.title}
            </p>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default PhotoGrid;
