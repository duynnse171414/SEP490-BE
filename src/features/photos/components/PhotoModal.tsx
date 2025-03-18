import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Photo } from "@/features/photos/types";

interface PhotoModalProps {
  selectedPhoto: Photo | null;
  onClose: () => void;
}

const PhotoModal: React.FC<PhotoModalProps> = ({ selectedPhoto, onClose }) => {
  return (
    <Dialog open={!!selectedPhoto} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-2xl">
        {selectedPhoto && (
          <div className="flex flex-col items-center">
            <img
              src={selectedPhoto.url}
              alt={selectedPhoto.title}
              className="max-h-96 object-contain mb-4"
            />
            <h3 className="text-xl font-medium text-center">
              {selectedPhoto.title}
            </h3>
            <p className="text-sm text-gray-500 mt-2">
              Photo ID: {selectedPhoto.id} | Album ID: {selectedPhoto.albumId}
            </p>
            <Button onClick={onClose}>Close</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PhotoModal;
