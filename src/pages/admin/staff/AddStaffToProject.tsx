import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Combobox } from "@/components/ui/combobox";

import {
  useProjects,
  useStaffNotInProject,
  useRoleInProject,
  useAddStaffToProject,
} from "@/features/project/hooks/useProject";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StaffNotInProject } from "@/features/staff/types";

export function AddStaffToProjectDialog() {
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [selectedStaffs, setSelectedStaffs] = useState<string[]>([]);
  const [staffRoles, setStaffRoles] = useState<Record<string, string>>({});

  const { data: projects, isLoading: isLoadingProjects } = useProjects();
  const { data: availableStaffs, isLoading: isLoadingStaffs } =
    useStaffNotInProject(selectedProject);
  const { data: roles, isLoading: isLoadingRoles } = useRoleInProject();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleProjectChange = (projectId: string) => {
    setSelectedProject(projectId);
    setSelectedStaffs([]);
    setStaffRoles({});
  };

  const handleStaffSelection = (staffId: string) => {
    setSelectedStaffs((prev) =>
      prev.includes(staffId)
        ? prev.filter((id) => id !== staffId)
        : [...prev, staffId]
    );
  };

  const handleRoleChange = (staffId: string, roleId: string) => {
    setStaffRoles((prev) => ({
      ...prev,
      [staffId]: roleId,
    }));
  };

  const handleAddStaffs = async () => {
    if (selectedStaffs.length === 0) return;

    setIsSubmitting(true);

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 1); // Thêm 1 ngày
    const formattedEndDate = endDate.toISOString();

    // Chuẩn bị dữ liệu cho API
    const staffsWithRoles: StaffNotInProject[] = selectedStaffs.map(
      (staffId) => ({
        staffId,
        roleInProjectId: Number(staffRoles[staffId]),
        startDate: new Date().toISOString(),
        endDate: formattedEndDate,
        createAt: new Date().toISOString(),
        createBy: "admin",
      })
    );

    console.log(staffsWithRoles, selectedProject);

    try {
      // Gọi API để thêm staffs vào project
      await useAddStaffToProject(staffsWithRoles, Number(selectedProject));

      // Reset form và hiển thị thông báo thành công
      setSelectedStaffs([]);
      setStaffRoles({});
      alert("Staff(s) added to project successfully!");
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to add staffs to project:", error);
      alert("Failed to add staff(s) to project. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Add Staff to Project</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl w-[95vw]">
        <DialogHeader>
          <DialogTitle>Add Staff to Project</DialogTitle>
        </DialogHeader>
        <div className="space-y-5">
          <div className="w-full h-16 text-lg">
            {isLoadingProjects ? (
              <div className="w-full h-10 bg-muted animate-pulse rounded-md" />
            ) : (
              <Combobox
                options={
                  projects?.map((project) => ({
                    value: project.projectId.toString(),
                    label: project.projectName,
                  })) ?? []
                }
                value={selectedProject}
                onValueChange={handleProjectChange}
                placeholder="Select a project"
              />
            )}
          </div>

          {selectedProject && (
            <div className="border rounded-md overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[5%]"></TableHead>
                    <TableHead className="w-[20%]">Staff Name</TableHead>
                    <TableHead className="w-[25%]">Email</TableHead>
                    <TableHead className="w-[20%]">Department</TableHead>
                    <TableHead className="w-[10%] text-center">
                      In Project
                    </TableHead>
                    <TableHead className="w-[20%]">Role</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingStaffs ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : availableStaffs?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        No staff available to add to this project
                      </TableCell>
                    </TableRow>
                  ) : (
                    availableStaffs?.map((staff) => (
                      <TableRow key={staff.staffId}>
                        <TableCell className="text-center">
                          <Checkbox
                            checked={selectedStaffs.includes(staff.staffId)}
                            onCheckedChange={() =>
                              handleStaffSelection(staff.staffId)
                            }
                          />
                        </TableCell>
                        <TableCell className="truncate max-w-[150px]">
                          {staff.staffName}
                        </TableCell>
                        <TableCell className="truncate max-w-[200px]">
                          {staff.email}
                        </TableCell>
                        <TableCell className="truncate max-w-[150px]">
                          {staff.departmentName}
                        </TableCell>
                        <TableCell className="text-center">
                          {staff.countProject}
                        </TableCell>
                        <TableCell>
                          <Select
                            value={staffRoles[staff.staffId]}
                            onValueChange={(value) =>
                              handleRoleChange(staff.staffId, value)
                            }
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
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {selectedProject && (
            <div className="flex justify-end">
              <Button
                onClick={handleAddStaffs}
                disabled={selectedStaffs.length === 0}
              >
                Add Selected Staff
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
