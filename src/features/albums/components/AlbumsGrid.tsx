import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Album } from "@/features/albums/types";
import { User } from "@/features/users/types";

interface AlbumsGridProps {
  albums?: Album[];
  users?: User[];
}

const AlbumsGrid: React.FC<AlbumsGridProps> = ({ albums, users }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {albums?.map((album) => (
        <Card key={album.id} className="flex flex-col p-4 rounded-lg">
          <CardHeader>
            <CardTitle className="line-clamp-2 h-12">{album.title}</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-sm text-gray-500">Album ID: {album.id}</p>
            {users && (
              <p className="text-sm text-gray-500">
                By: {users.find((u) => u.id === album.userId)?.name || `User ${album.userId}`}
              </p>
            )}
          </CardContent>
          <CardFooter>
            <Link to={`/photos?albumId=${album.id}`} className="w-full">
              <Button variant="outline" className="w-full">
                View Photos
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default AlbumsGrid;
