"use client";

import { useStaff } from "@/features/admin/hooks/useStaff";
import { useRef, useState } from "react";
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

import { Input } from "@/components/ui/input";
import { postData } from "@/api/fetchers";
import * as XLSX from "xlsx";

interface ExcelData {
  [key: string]: string | number;
}

const StaffListPage = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const { data: staffs, isLoading, error } = useStaff(pageNumber);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      const jsonData: ExcelData[] = (
        XLSX.utils.sheet_to_json(sheet) as ExcelData[]
      ).map(({ __rowNum__, ...rest }) => rest);

      console.log("Dữ liệu từ file Excel:", jsonData);

      const formattedData = jsonData.map((item) => ({
        userName: item.UserName,
        email: item.Email,
        staffName: item.StaffName,
        jobRank: Number(item.JobRank),
        salary: item.Salary,
        departmentName: item.DepartmentName,
        isActive: item.IsActive === "Active" ? true : false,
        createAt: item.CreateAt.toLocaleString(),
      }));
      console.log("Dữ liệu sau khi format:", formattedData);
      try {
        const data = await postData("Staffs/import-files", formattedData); // Gọi hàm importStaffs để lưu dữ liệu
        console.log(data);
        console.log("Dữ liệu đã được lưu thành công");
        alert("Dữ liệu đã được import thành công!"); // Thông báo cho người dùng
      } catch (error) {
        console.error("Lỗi khi lưu dữ liệu:", error);
        alert("Có lỗi xảy ra khi import dữ liệu."); // Thông báo lỗi cho người dùng
      }
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
                      <TableHead className="font-semibold">Email</TableHead>
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
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {staffs.map((staff) => (
                      <TableRow
                        key={staff.staffId}
                        className="hover:bg-muted/50"
                      >
                        <TableCell className="font-medium">
                          {staff.email}
                        </TableCell>
                        <TableCell>{staff.staffName}</TableCell>
                        <TableCell>{staff.jobRank}</TableCell>
                        <TableCell>${staff.salary?.toLocaleString()}</TableCell>
                        <TableCell>{staff.departmentName}</TableCell>
                        <TableCell>
                          <Badge
                            // variant={staff.isActive ? "success" : "secondary"}
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
                    className="h-8 w-8 p-0 cursor-pointer"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Previous page</span>
                  </Button>
                  <span className="text-sm font-medium">Page {pageNumber}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pageNumber + 1)}
                    disabled={staffs.length < 3}
                    className="h-8 w-8 p-0 cursor-pointer"
                  >
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">Next page</span>
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

export default StaffListPage;
