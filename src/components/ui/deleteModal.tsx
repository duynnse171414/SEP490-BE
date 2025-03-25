import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/TextareaProps";
import { useState } from "react";

type DeleteModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void; // Nhận lý do từ modal
  staffName?: string;
};

const DeleteModal = ({ isOpen, onClose, onConfirm, staffName }: DeleteModalProps) => {
  const [reason, setReason] = useState(""); // Lưu trữ lý do xóa

  const handleConfirm = () => {
    onConfirm(reason); // Truyền lý do xóa về StaffPage
    setReason(""); // Reset lý do sau khi xác nhận
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-primary">{staffName}</span>? This action cannot be undone.
        </p>
        <Textarea
          placeholder="Enter the reason for deletion..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="mt-4"
        />
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={!reason.trim()}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteModal;
