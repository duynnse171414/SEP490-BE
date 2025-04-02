import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  useRoleInProject,
  useUpdateStaffInProject,
} from "@/features/project/hooks/useProject";
import { useProjects } from "@/features/project/hooks/userProject";

export function UpdateStaffToProjectDialog({
  projectId,
  staff,
  onUpdate,
}: {
  projectId: string;
  staff: { staffId: string; staffName: string; roleInProjectId: number };
  onUpdate: () => void;
}) {
  const [selectedRole, setSelectedRole] = useState<string>(
    staff.roleInProjectId?.toString() || ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const { data: roles, isLoading: isLoadingRoles } = useRoleInProject();
  const { mutate } = useProjects();

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleUpdateStaff = async () => {
    if (!selectedRole) {
      toast.error("Please select a role.");
      return;
    }

    const staffUpdatePayload = [
      {
        staffId: staff.staffId,
        roleInProjectId: Number(selectedRole),
      },
    ];

    try {
      setIsSubmitting(true);

      // Call the API using the hook
      await useUpdateStaffInProject(
        staffUpdatePayload,
        Number(projectId),
        mutate
      );

      toast.success("Staff updated successfully!");
      onUpdate(); // Trigger parent component's update logic
      closeModal();
    } catch (error) {
      console.error("Error updating staff:", error);
      toast.error("Failed to update staff. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 text-blue-500 hover:bg-blue-100"
        >
          Update
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Update Staff Role</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Staff Name:
            </label>
            <p>{staff.staffName}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Role:
            </label>
            <Select
              value={selectedRole}
              onValueChange={(value) => setSelectedRole(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {isLoadingRoles ? (
                  <SelectItem value="" disabled>
                    Loading roles...
                  </SelectItem>
                ) : (
                  roles?.map((role) => (
                    <SelectItem
                      key={role.roleProjectId}
                      value={role.roleProjectId.toString()}
                    >
                      {role.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end">
            <Button
              onClick={handleUpdateStaff}
              disabled={isSubmitting}
              className="bg-blue-500 text-white hover:bg-blue-600"
            >
              {isSubmitting ? "Updating..." : "Update Staff"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
