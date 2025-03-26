"use client";

import { useParams } from "react-router-dom";
import { useProject } from "@/features/project/hooks/userProject";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

const ProjectDetail = () => {
  // Lấy projectId từ URL
  const { id } = useParams();
  const projectId = Number(id);

  // Gọi API lấy thông tin project
  const { data: project, isLoading, error } = useProject(projectId);
  console.log(project);

  // Định dạng ngày tháng
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="shadow-lg">
        {/* Header */}
        <CardHeader className="bg-primary/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="text-2xl font-bold text-primary">
            Project Details
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6">
          {/* Loading & Error Handling */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-lg text-muted-foreground">
                Loading project data...
              </span>
            </div>
          ) : error ? (
            <div className="bg-destructive/10 text-destructive p-4 rounded-md flex items-center justify-center h-32">
              <p className="font-medium">Error: {error.message}</p>
            </div>
          ) : !project ? (
            <div className="bg-muted p-8 rounded-md flex items-center justify-center h-32">
              <p className="text-muted-foreground text-lg">
                No project data found.
              </p>
            </div>
          ) : (
            <>
              {/* Thông tin Project */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold">Project Information</h2>
                <div className="grid grid-cols-2 gap-4 mt-2 text-muted-foreground">
                  <p>
                    <strong>Project Code:</strong> {project.projectCode}
                  </p>
                  <p>
                    <strong>Project Name:</strong> {project.projectName}
                  </p>
                  <p>
                    <strong>Start Date:</strong> {formatDate(project.startDate)}
                  </p>
                  <p>
                    <strong>End Date:</strong> {formatDate(project.endDate)}
                  </p>
                </div>
              </div>

              {/* Table danh sách Staff */}
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold">No.</TableHead>
                      <TableHead className="font-semibold">Email</TableHead>
                      <TableHead className="font-semibold">Username</TableHead>
                      <TableHead className="font-semibold">
                        Staff Name
                      </TableHead>
                      <TableHead className="font-semibold">Job Rank</TableHead>
                      <TableHead className="font-semibold">Salary</TableHead>
                      <TableHead className="font-semibold">
                        Department
                      </TableHead>
                      <TableHead className="font-semibold">Role</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold">
                        Created At
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {project?.staffs?.length ? (
                      project.staffs.map((staff, index) => (
                        <TableRow
                          key={staff.staffId}
                          className="hover:bg-muted/50"
                        >
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{staff.email}</TableCell>
                          <TableCell>{staff.username}</TableCell>
                          <TableCell>{staff.staffName}</TableCell>
                          <TableCell>{staff.jobRank}</TableCell>
                          <TableCell>
                            ${staff.salary?.toLocaleString()}
                          </TableCell>
                          <TableCell>{staff.departmentName}</TableCell>
                          <TableCell>{staff.roleInProject}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                staff.isActive
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }
                            >
                              {staff.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(staff.createAt)}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={10}
                          className="text-center py-4 text-muted-foreground"
                        >
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
