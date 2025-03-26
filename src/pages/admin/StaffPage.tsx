"use client";

import { useState, useEffect } from "react";
import { useStaffs } from "@/features/admin/hooks/useStaff";
import { useDeleteStaff } from "@/features/admin/hooks/useDeleteStaff";
import { useUpdateStaff } from "@/features/admin/hooks/useUpdateStaff";
import CreateStaffButton from "@/features/staff/CreateStaffButton";
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
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Upload,
  Download,
} from "lucide-react";
import UpdateModal from "@/components/ui/updateModal";
import DeleteModal from "@/components/ui/deleteModal";
import { Staff } from "@/features/admin/types";

const StaffPage = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const {
    data: staffResponse,
    isLoading,
    error,
    mutate,
  } = useStaffs(pageNumber);
  const { mutate: deleteStaffMutate } = useDeleteStaff();
  const { mutate: updateStaffMutate } = useUpdateStaff();
  const [staffs, setStaffs] = useState(staffResponse?.items || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const totalPages = staffResponse?.totalPages;

  // type Staff = {
  //   staffId: number
  //   staffName: string
  //   username: string // Added username field
  //   email: string
  //   jobRank: string
  //   salary: number
  //   departmentName: string
  //   isActive: boolean
  //   createAt: string
  // }

  useEffect(() => {
    setStaffs(staffResponse?.items || []); // Cập nhật danh sách nhân viên khi API trả về
  }, [staffResponse]);

  const handleNewStaff = (newStaff: any) => {
    setStaffs((prev) => [newStaff, ...prev]); // Thêm nhân viên mới vào danh sách hiện tại
    mutate(); // Đồng bộ lại dữ liệu với server
  };

  const handleDeleteStaff = (staffId: string) => {
    const numericStaffId = Number(staffId);
    if (isNaN(numericStaffId)) {
      console.error("Invalid staff ID:", staffId);
      return;
    }

    deleteStaffMutate(numericStaffId, {
      onSuccess: () => {
        setStaffs((prev) =>
          prev.filter((staff) => Number(staff.staffId) !== numericStaffId)
        ); // Lọc danh sách với ID là số
        mutate(); // Đồng bộ dữ liệu với server
      },
      onError: (error: any) => {
        console.error("Error deleting staff:", error.message);
      },
    });
  };

  const handleUpdateStaff = (updatedStaff: any) => {
    updateStaffMutate(updatedStaff, {
      onSuccess: () => {
        setStaffs((prev) =>
          prev.map((staff) =>
            staff.staffId === updatedStaff.staffId ? updatedStaff : staff
          )
        );
        mutate();
      },
      onError: (error: any) => {
        console.error("Error updating staff:", error.message);
      },
    });
  };

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

  const handleUpdateClick = (staff: any) => {
    setSelectedStaff(staff); // Gán nhân viên được chọn
    setIsModalOpen(true); // Hiển thị Modal
  };

  const handleModalClose = () => {
    setIsModalOpen(false); // Đóng Modal
    setSelectedStaff(null); // Xóa thông tin nhân viên được chọn
  };

  const handleModalSubmit = (updatedStaff: any) => {
    handleUpdateStaff(updatedStaff); // Cập nhật thông tin nhân viên
    handleModalClose(); // Đóng Modal sau khi cập nhật
  };

  const handleDeleteClick = (staff: any) => {
    setSelectedStaff(staff); // Gán nhân viên được chọn
    setIsDeleteModalOpen(true); // Hiển thị Modal Xóa
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false); // Đóng Modal Xóa
    setSelectedStaff(null); // Xóa thông tin nhân viên được chọn
  };

  const handleDeleteModalConfirm = async (reason: string) => {
    if (selectedStaff) {
      try {
        await fetch(`/api/staffs/${selectedStaff.staffId}/reason`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reason }),
        });

        handleDeleteStaff(selectedStaff.staffId.toString());
      } catch (error) {
        console.error("Error handling delete reason or deleting staff:", error);
      }
    }
    handleDeleteModalClose();
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="shadow-lg">
        <CardHeader className="bg-primary/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="text-2xl font-bold text-primary">
            Staff Management
          </CardTitle>
          <div className="flex items-center space-x-2">
            <CreateStaffButton onSuccess={handleNewStaff} />
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer flex items-center gap-2"
              onClick={() => alert("Import functionality coming soon!")}
            >
              <Upload className="h-4 w-4" />
              Import
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer flex items-center gap-2"
              onClick={() => alert("Export functionality coming soon!")}
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {/* Modal Update */}
          <UpdateModal
            isOpen={isModalOpen}
            onClose={handleModalClose}
            onSubmit={handleModalSubmit}
            staff={selectedStaff}
          />
          {/* Modal Delete */}
          <DeleteModal
            isOpen={isDeleteModalOpen}
            onClose={handleDeleteModalClose}
            onConfirm={handleDeleteModalConfirm}
            staffName={selectedStaff?.staffName}
          />

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-lg text-muted-foreground">
                Loading staff data...
              </span>
            </div>
          ) : error ? (
            <div className="bg-destructive/10 text-destructive p-4 rounded-md flex items-center justify-center h-32">
              <p className="font-medium">Error: {error.message}</p>
            </div>
          ) : !Array.isArray(staffs) || !staffs.length ? (
            <div className="bg-muted p-8 rounded-md flex items-center justify-center h-32">
              <p className="text-muted-foreground text-lg">
                No staff records found.
              </p>
            </div>
          ) : (
            <>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold">No.</TableHead>
                      <TableHead className="font-semibold">Email</TableHead>
                      <TableHead className="font-semibold">
                        Username
                      </TableHead>{" "}
                      {/* Added Username column */}
                      <TableHead className="font-semibold">
                        Staff Name
                      </TableHead>
                      <TableHead className="font-semibold">Job Rank</TableHead>
                      <TableHead className="font-semibold">Salary</TableHead>
                      <TableHead className="font-semibold">
                        Department
                      </TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold">
                        Created At
                      </TableHead>
                      <TableHead className="font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {staffs.map((staff, index) => (
                      <TableRow
                        key={staff.staffId}
                        className="hover:bg-muted/50"
                      >
                        <TableCell>
                          {(pageNumber - 1) * 10 + index + 1}
                        </TableCell>
                        <TableCell>{staff.email}</TableCell>
                        <TableCell>{staff.username}</TableCell>
                        <TableCell>{staff.staffName}</TableCell>
                        <TableCell>{staff.jobRank}</TableCell>
                        <TableCell>${staff.salary?.toLocaleString()}</TableCell>
                        <TableCell>{staff.departmentName}</TableCell>
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
                        <TableCell className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdateClick(staff)}
                            className="cursor-pointer"
                          >
                            Update
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteClick(staff)}
                            className="cursor-pointer"
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-muted-foreground">
                  Showing page {pageNumber}
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

export default StaffPage;
