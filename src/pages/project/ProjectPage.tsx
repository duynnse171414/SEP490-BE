import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useProjects } from "@/features/project/hooks/userProject"; // Import hook useProjects
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

const ProjectPage: React.FC = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const { data: projectResponse, isLoading, error } = useProjects(pageNumber);
  const projects = projectResponse?.items || []; // Lấy danh sách project từ response
  const totalPages = projectResponse?.totalPages;

  const handlePageChange = (newPageNumber: number) => {
    setPageNumber(newPageNumber);
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 bg-black text-white">
      <Card className="shadow-lg">
        <CardHeader className="bg-primary/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="text-2xl font-bold text-primary">
            Project Management
          </CardTitle>
          {/* Thêm các nút chức năng khác nếu cần */}
        </CardHeader>
        <CardContent className="p-6">
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
          ) : !Array.isArray(projects) || !projects.length ? ( // Kiểm tra projects
            <div className="bg-muted p-8 rounded-md flex items-center justify-center h-32">
              <p className="text-muted-foreground text-lg">
                No project records found.
              </p>
            </div>
          ) : (
            <>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold">No.</TableHead>
                      <TableHead className="font-semibold">
                        Project Name
                      </TableHead>
                      <TableHead className="font-semibold">
                        Project Code
                      </TableHead>
                      <TableHead className="font-semibold">
                        Start Date
                      </TableHead>
                      <TableHead className="font-semibold">End Date</TableHead>
                      {/* ... other table headers */}
                      <TableHead className="font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projects.map((project, index) => (
                      <TableRow
                        key={project.projectId}
                        className="hover:bg-muted/50"
                      >
                        <TableCell>
                          {(pageNumber - 1) * 10 + index + 1}
                        </TableCell>
                        <TableCell>{project.projectName}</TableCell>
                        <TableCell>{project.projectCode}</TableCell>
                        <TableCell>{formatDate(project.startDate)}</TableCell>
                        <TableCell>{formatDate(project.endDate)}</TableCell>
                        {/* ... other table cells */}
                        <TableCell className="flex space-x-2">
                          <Link
                            to={`/admin/projects/${project.projectId}`} // Đường dẫn đến trang chi tiết nhân viên của dự án
                            className="text-blue-400 hover:underline"
                          >
                            View Staff
                          </Link>
                          {/* Thêm các nút chức năng khác nếu cần */}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-muted-foreground">
                  Showing page {pageNumber} of {totalPages}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pageNumber - 1)}
                    disabled={pageNumber === 1}
                    className="cursor-pointer"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-medium">Page {pageNumber}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pageNumber + 1)}
                    disabled={pageNumber === totalPages}
                    className="cursor-pointer"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectPage;
