import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Download,
} from "lucide-react";
const BASE_URL = "https://localhost:7100/api";
interface Staff {
  staffId: string; // FK từ bảng Project
  staffName: string;
  roleinProject?: string; // Nếu không có role trong API, để tùy chọn
}

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjectDetail = async () => {
      try {
        const response = await axios.get(`https://localhost:7100/api/Project/${id}`);
        console.log("API Response:", response.data); // Log dữ liệu để kiểm tra
        const projectData = response.data?.data; // Lấy `data` từ phản hồi
        if (projectData && projectData.staffs) {
          setStaffList(projectData.staffs); // Gán `staffs` vào state
        } else {
          setStaffList([]); // Trường hợp không có `staffs`
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Axios error:", error.response?.data || error.message);
          setError(error.response?.data || error.message);
        } else {
          console.error("Unexpected error:", error);
          setError("An unexpected error occurred.");
        }
      }
    };
    fetchProjectDetail();
  }, [id]);

  const handelExportExcel = async () => {
    // const response = await axios.post(`${BASE_URL}/Project/export-to-excel`,
    //   {
        
    //   });
    alert("Export Excel Coming soon");
  };


  if (error) {
    return <div className="text-red-500 text-center p-4">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4 bg-black text-white min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold mb-4">Project Detail - ID: {id}</h1>
        <Button
        variant="outline"
        size="sm"
        className="cursor-pointer flex items-center gap-2 text-black"
        onClick={handelExportExcel}
      >
        <Download className="h-4 w-4" />
        Export
      </Button>
      </div> 
      <h2 className="text-xl font-semibold mb-3">Staff List:</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 border border-gray-600 text-white">
          <thead className="bg-gray-900 text-gray-300">
            <tr>
              <th className="border border-gray-700 px-4 py-2">Staff ID</th>
              <th className="border border-gray-700 px-4 py-2">Name</th>
            </tr>
          </thead>
          <tbody>
            {staffList.length > 0 ? (
              staffList.map((staff) => (
                <tr key={staff.staffId} className="hover:bg-gray-700">
                  <td className="border border-gray-700 px-4 py-2">{staff.staffId}</td>
                  <td className="border border-gray-700 px-4 py-2">{staff.staffName}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="text-center text-gray-400 py-4">
                  No staff members found for this project.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
