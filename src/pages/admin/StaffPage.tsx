"use client";

import { useRef, useState, useEffect } from "react";
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
import { toast } from "@/components/ui/toast";

// import { Staff } from "@/features/admin/types";
import { Input } from "@/components/ui/input";
import { postData } from "@/api/fetchers";
import * as XLSX from "xlsx";

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

  interface ExcelData {
    No?: number;
    Email: string;
    UserName: string;
    StaffName: string;
    JobRank: string;
    Salary: number;
    DepartmentName: string;
    IsActive: string;
    CreateAt: string;
    // [key: string]: any; // Để đảm bảo vẫn có thể xử lý các trường bổ sung
  }
  const BASE_URL = "https://localhost:7100/api";
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedStaffs, setSelectedStaffs] = useState<Set<string>>(new Set());
  const [allSelected, setAllSelected] = useState(false);
  const [allStaffs, setAllStaffs] = useState<any[]>([]);

  useEffect(() => {
    if (staffResponse?.items) {
      setAllStaffs((prev) => {
        const updatedList = [...prev, ...staffResponse.items];
        return Array.from(new Set(updatedList.map((s) => s.staffId))).map(
          (id) => updatedList.find((s) => s.staffId === id)
        );
      });
    }
  }, [staffResponse]);

  useEffect(() => {
    setAllSelected(
      selectedStaffs.size === allStaffs.length && allStaffs.length > 0
    );
  }, [selectedStaffs, allStaffs]);

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedStaffs(new Set());
    } else {
      setSelectedStaffs(new Set(allStaffs.map((staff) => staff.staffId)));
    }
  };

  const handleSelectStaff = (staffId: string) => {
    setSelectedStaffs((prev) => {
      const newSelected = new Set(prev);
      if (newSelected.has(staffId)) {
        newSelected.delete(staffId);
      } else {
        newSelected.add(staffId);
      }
      return newSelected;
    });
  };

  const jobRankMap: Record<string, number> = {
    Manager: 0,
    Executive: 1,
    Assistant: 2,
    LeadDesigner: 3,
    Developer: 4,
    Senior: 5,
    Director: 6,
  };

  const fixCreateAt = (dateStr: any) => {
    const date = new Date(dateStr);
    if (isNaN(date.getTime()) || date.getFullYear() < 1900) {
      return "2025-03-26T03:32:28.493Z";
    }
    return date.toISOString(); // Chuyển thành định dạng chuẩn
  };

  const handleExport = async () => {
    const selectedStaffData = allStaffs
      .filter((staff) => selectedStaffs.has(staff.staffId))
      .map((staff) => ({
        email: staff.email,
        userName: staff.userName,
        staffName: staff.staffName,
        jobRank: jobRankMap[staff.jobRank] ?? 0,
        salary: staff.salary,
        departmentName: staff.departmentName,
        isActive: staff.isActive,
        createAt: fixCreateAt(staff.createAt),
      }));

    console.log(selectedStaffData);

    const response = await fetch(`${BASE_URL}/Staffs/export-to-excel`, {
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
      a.download = `Staffs-${new Date().toISOString().split("T")[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      const errorMessage = await response.text();
      console.error("Failed to export file:", response.status, errorMessage);
    }
  };

  type Staff = {
    staffId: number;
    staffName: string;
    username: string; // Added username field
    email: string;
    jobRank: string;
    salary: number;
    departmentName: string;
    isActive: boolean;
    createAt: string;
  };

  useEffect(() => {
    setStaffs(staffResponse?.items || []); // Cập nhật danh sách nhân viên khi API trả về
  }, [staffResponse]);

  const handleNewStaff = (newStaff: any) => {
    setStaffs((prev) => [newStaff, ...prev]); // Thêm nhân viên mới vào danh sách hiện tại
    mutate(); // Đồng bộ lại dữ liệu với server
  };

  const handleDeleteStaff = (staffId: string) => {
    deleteStaffMutate(staffId, {
      onSuccess: () => {
        setStaffs((prev) =>
          prev.map((staff) =>
            staff.staffId === staffId ? { ...staff, isActive: false } : staff
          )
        ); // Mark staff as inactive
        toast.success("Staff deactivated successfully!");
        mutate(); // Synchronize data with the server if needed
      },
      onError: (error) => {
        console.error("Error deactivating staff:", error.message);
        toast.error("Failed to deactivate staff.");
      },
    });
  };

  const handleUpdateStaff = (updatedStaff: any) => {
    console.log("Sending updated staff data:", updatedStaff);

    updateStaffMutate(updatedStaff, {
      onSuccess: () => {
        setStaffs((prev) =>
          prev.map((staff) =>
            staff.staffId === updatedStaff.staffId ? updatedStaff : staff
          )
        );
        mutate(); // Cập nhật dữ liệu từ server
        toast.success("Staff updated successfully!");
      },
      onError: (error: any) => {
        console.error("Error updating staff:", error.message);
        toast.error("Failed to update staff. Please try again.");
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
        await fetch(`/api/staffs/${selectedStaff.staffId}`, {
          method: "PUT",
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

  // Hàm xử lý khi người dùng click vào nút Import
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const binaryStr = e.target?.result;
      if (!binaryStr) return;

      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet) as ExcelData[];

      console.log("Dữ liệu từ file Excel:", jsonData);

      const formattedData = jsonData.map((item) => ({
        userName: item.UserName,
        email: item.Email,
        staffName: item.StaffName,
        jobRank: jobRankMap[item.JobRank],
        salary: item.Salary,
        departmentName: item.DepartmentName,
        isActive: item.IsActive === "Active" ? true : false,
      }));

      console.log("Dữ liệu sau khi format:", formattedData);
      const data = await postData("Staffs/import-files", formattedData); // Gọi hàm importStaffs để lưu dữ liệu
      console.log(data);
      console.log("Dữ liệu đã được lưu thành công");
      mutate(); // Cập nhật lại danh sách nhân viên sau khi import thành công
      // try {

      //   alert("Dữ liệu đã được import thành công!"); // Thông báo cho người dùng
      // } catch (error) {
      //   console.error("Lỗi khi lưu dữ liệu:", error);
      //   alert("Có lỗi xảy ra khi import dữ liệu."); // Thông báo lỗi cho người dùng
      // }
    };
    reader.readAsBinaryString(file);
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
            <Input
              ref={fileInputRef}
              id="fileInput"
              type="file"
              accept=".xls,.xlsx"
              className="absolute opacity-0 w-0 h-0"
              onChange={handleFileUpload}
            />
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer flex items-center gap-2"
              onClick={handleButtonClick}
            >
              <Upload className="h-4 w-4" type="file" />
              Import
            </Button>
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
                      <TableHead>
                        <input
                          type="checkbox"
                          checked={allSelected}
                          onChange={handleSelectAll}
                        />
                      </TableHead>
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
                          <input
                            type="checkbox"
                            checked={selectedStaffs.has(staff.staffId)}
                            onChange={() => handleSelectStaff(staff.staffId)}
                          />
                        </TableCell>
                        <TableCell>
                          {(pageNumber - 1) * 10 + index + 1}
                        </TableCell>
                        <TableCell>{staff.email}</TableCell>
                        <TableCell>{staff.userName}</TableCell>
                        <TableCell>{staff.staffName}</TableCell>
                        <TableCell>{staff.jobRank}</TableCell>
                        <TableCell>${staff.salary?.toLocaleString()}</TableCell>
                        <TableCell>{staff.departmentName}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              staff.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-red-200 text-red-800"
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
