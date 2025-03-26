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

interface Staff {
  staffId: string;
  staffName: string;
  email: string;
  departmentName: string;
}

interface Project {
  id: string;
  name: string;
}

export function AddStaffToProjectDialog() {
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [selectedStaffs, setSelectedStaffs] = useState<string[]>([]);

  // Mock data - thay thế bằng API call thực tế
  const projects: Project[] = [
    { id: "1", name: "Project A" },
    { id: "2", name: "Project B" },
  ];

  const availableStaffs: Staff[] = [
    {
      staffId: "1",
      staffName: "John Doe",
      email: "john@example.com",
      departmentName: "IT",
    },
    {
      staffId: "2",
      staffName: "Jane Smith",
      email: "jane@example.com",
      departmentName: "HR",
    },
  ];

  const handleProjectChange = (projectId: string) => {
    setSelectedProject(projectId);
    setSelectedStaffs([]);
    // Thêm API call để lấy danh sách staff chưa được thêm vào project
  };

  const handleStaffSelection = (staffId: string) => {
    setSelectedStaffs((prev) =>
      prev.includes(staffId)
        ? prev.filter((id) => id !== staffId)
        : [...prev, staffId]
    );
  };

  const handleAddStaffs = () => {
    // Xử lý thêm staff vào project
    console.log(
      "Adding staffs:",
      selectedStaffs,
      "to project:",
      selectedProject
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Add Staff to Project</Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>Add Staff to Project</DialogTitle>
        </DialogHeader>
        <div className="space-y-5">
          <div className="w-full h-16 text-lg">
            <Combobox
              options={projects.map((project) => ({
                value: project.id,
                label: project.name,
              }))}
              value={selectedProject}
              onValueChange={handleProjectChange}
              placeholder="Select a project"
            />
          </div>

          {selectedProject && (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Staff Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>In Project</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {availableStaffs.map((staff) => (
                    <TableRow key={staff.staffId}>
                      <TableCell>
                        <Checkbox
                          checked={selectedStaffs.includes(staff.staffId)}
                          onCheckedChange={() =>
                            handleStaffSelection(staff.staffId)
                          }
                        />
                      </TableCell>
                      <TableCell>{staff.staffName}</TableCell>
                      <TableCell>{staff.email}</TableCell>
                      <TableCell>{staff.departmentName}</TableCell>
                      <TableCell>{1}</TableCell>
                    </TableRow>
                  ))}
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
