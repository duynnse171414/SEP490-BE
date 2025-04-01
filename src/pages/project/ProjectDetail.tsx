"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useParams } from "react-router-dom";
import { useProject } from "@/features/project/hooks/useProject";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { AddStaffToProjectDialog } from "../admin/staff/AddStaffToProject";
const BASE_URL = "https://localhost:7100/api";

const ProjectDetail = () => {
  const { id } = useParams();
  const projectId = Number(id);
  const { data: project, isLoading, error } = useProject(projectId);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (e) {
      return dateString;
    }
  };

  const handleExport = async () => {
    if (!project) return;

    const selectedStaffData = {
      projectName: project.projectName,
      projectCode: project.projectCode,
      staffs: project.staffs.map((staff) => ({
        staffName: staff.staffName,
        roleInProject: staff.roleInProject,
        startDate: project.startDate,
        endDate: project.endDate,
        createAt: staff.createAt,
      })),
    };

    const response = await fetch(`${BASE_URL}/Project/export-to-excel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
      },
      body: JSON.stringify(selectedStaffData),
    });

    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Staffs-In-Project-${new Date().toISOString().split("T")[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      const errorMessage = await response.text();
      console.error("Failed to export file:", response.status, errorMessage);
    }
  };

  

  const handleDeleteStaff = async (staffId) => {
    try {
      const response = await fetch(`${BASE_URL}/Project/DeleteStaffFromProject?staffId=${staffId}&projectId=${projectId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Staff deleted successfully.");
      } else {
        const errorMessage = await response.text();
        console.error("Failed to delete staff:", response.status, errorMessage);
        alert("Failed to delete staff.");
      }
    } catch (error) {
      console.error("Error while deleting staff:", error);
      alert("Error occurred while deleting staff.");
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="shadow-lg">
        <CardHeader className="bg-primary/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="text-2xl font-bold text-primary">Project Details</CardTitle>
          <div className="flex items-center space-x-2">
            {AddStaffToProjectDialog(id, true)}

            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer flex items-center gap-2"
              onClick={handleExport}
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-lg text-muted-foreground">Loading project data...</span>
            </div>
          ) : error ? (
            <div className="bg-destructive/10 text-destructive p-4 rounded-md flex items-center justify-center h-32">
              <p className="font-medium">Error: {error.message}</p>
            </div>
          ) : !project ? (
            <div className="bg-muted p-8 rounded-md flex items-center justify-center h-32">
              <p className="text-muted-foreground text-lg">No project data found.</p>
            </div>
          ) : (
            <>
              {/* Project Information */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold">Project Information</h2>
                <div className="grid grid-cols-2 gap-4 mt-2 text-muted-foreground">
                  <p><strong>Project Code:</strong> {project.projectCode}</p>
                  <p><strong>Project Name:</strong> {project.projectName}</p>
                  <p><strong>Start Date:</strong> {formatDate(project.startDate)}</p>
                  <p><strong>End Date:</strong> {formatDate(project.endDate)}</p>
                </div>
              </div>

              {/* Table of Staffs */}
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold">No.</TableHead>
                      <TableHead className="font-semibold">Email</TableHead>
                      <TableHead className="font-semibold">Username</TableHead>
                      <TableHead className="font-semibold">Staff Name</TableHead>
                      <TableHead className="font-semibold">Job Rank</TableHead>
                      <TableHead className="font-semibold">Salary</TableHead>
                      <TableHead className="font-semibold">Department</TableHead>
                      <TableHead className="font-semibold">Role</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold">Created At</TableHead>
                      <TableHead className="font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {project?.staffs?.length ? (
                      project.staffs.map((staff, index) => (
                        <TableRow key={staff.staffId} className="hover:bg-muted/50">
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{staff.email}</TableCell>
                          <TableCell>{staff.userName}</TableCell>
                          <TableCell>{staff.staffName}</TableCell>
                          <TableCell>{staff.jobRank}</TableCell>
                          <TableCell>${staff.salary?.toLocaleString()}</TableCell>
                          <TableCell>{staff.departmentName}</TableCell>
                          <TableCell>{staff.roleInProject}</TableCell>
                          <TableCell>
                            <Badge className={staff.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                              {staff.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(staff.createAt)}</TableCell>
                          <TableCell className="flex space-x-2">
                            
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-2 text-red-500 hover:bg-red-100"
                              onClick={() => handleDeleteStaff(staff.staffId)}
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={12} className="text-center py-4 text-muted-foreground">
                          No staff data available.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>    
    </div>
  );
};

export default ProjectDetail;
