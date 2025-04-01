import { Button } from "@/components/ui/button";
import {
  Plus,
  Clock,
  FileText,
  X,
  Loader2,
  Ticket,
  LayoutDashboard,
  RotateCcw,
  Trash2Icon
} from "lucide-react";
import { useState, useEffect } from "react";
import { ClaimRequest } from "@/types/claims";
import { claimApi } from "@/api/claimApi";
import { useNavigate } from "react-router-dom";
import "../css/dashboardPage.css";
import { motion } from "framer-motion";

type ViewType = "draft" | "pending" | "approved" | "paid" | "rejected" | "cancelled" | "returned";

interface CustomPaginationProps {
  page: number;
  hasNextPage: boolean;
  onPageChange: (page: number) => void;
}

const CustomPagination = ({ page, hasNextPage, onPageChange }: CustomPaginationProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex justify-center gap-2"
    >
      <Button
        variant="outline"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white
          transition-all duration-300 hover:scale-105"
      >
        Previous
      </Button>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-900 dark:text-white">Page {page}</span>
      </div>
      <Button
        variant="outline"
        onClick={() => onPageChange(page + 1)}
        disabled={!hasNextPage}
        className="border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white
          transition-all duration-300 hover:scale-105"
      >
        Next
      </Button>
    </motion.div>
  );
};

const DashboardPage = () => {
  const navigate = useNavigate();
  const pageSize = 10;
  const [totalClaims, setTotalClaims] = useState(0);
  const [currentView, setCurrentView] = useState<ViewType>("pending");
  const [currentPage, setCurrentPage] = useState(1);
  const [draftRequests, setDraftRequests] = useState<ClaimRequest[]>([]);
  const [pendingRequests, setPendingRequests] = useState<ClaimRequest[]>([]);
  const [approvedRequests, setApprovedRequests] = useState<ClaimRequest[]>([]);
  const [paidRequests, setPaidRequests] = useState<ClaimRequest[]>([]);
  const [rejectedRequests, setRejectedRequests] = useState<ClaimRequest[]>([]);
  const [cancelledRequests, setCancelledRequests] = useState<ClaimRequest[]>([]);
  const [returnedRequests, setReturnedRequests] = useState<ClaimRequest[]>([]);
  const [draftPage, setDraftPage] = useState(1);
  const [pendingPage, setPendingPage] = useState(1);
  const [approvedPage, setApprovedPage] = useState(1);
  const [paidPage, setPaidPage] = useState(1);
  const [rejectedPage, setRejectedPage] = useState(1);
  const [cancelledPage, setCancelledPage] = useState(1);
  const [returnedPage, setReturnedPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [draftTotal, setDraftTotal] = useState(0);
  const [pendingTotal, setPendingTotal] = useState(0);
  const [approvedTotal, setApprovedTotal] = useState(0);
  const [paidTotal, setPaidTotal] = useState(0);
  const [rejectedTotal, setRejectedTotal] = useState(0);
  const [cancelledTotal, setCancelledTotal] = useState(0);
  const [returnedTotal, setReturnedTotal] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  const fetchRequests = async (
    status: string,
    setData: (data: ClaimRequest[]) => void,
    page: number
  ) => {
    try {
      const formattedMonth = selectedMonth ? selectedMonth.split('-')[1] + '/' + selectedMonth.split('-')[0] : '';
      
      const response = await claimApi.filterClaims(
        selectedMonth ? {
          "ClaimStatus": status,
          "CreateAt": formattedMonth
        } : status,
        "createAt",
        "desc",
        page,
        pageSize
      );
      
      console.log('API Parameters:', {
        filterParams: selectedMonth ? {
          "ClaimStatus": status,
          "CreateAt": formattedMonth
        } : status,
        sortField: "createAt",
        sortOrder: "desc",
        page,
        pageSize
      });

      if (response?.success) {
        setData(response.data || []);
        await checkNextPage(page);
      } else {
        setData([]);
        setHasNextPage(false);
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
      setData([]);
      setHasNextPage(false);
    }
  };

  const fetchTotalClaims = async () => {
    try {
      const response = await claimApi.getNumberAllClaims();
      console.log('Total claims response:', response); // Thêm log để debug
      if (response?.success) {
        setTotalClaims(response.data?.totalClaims || 0);
      }
    } catch (error) {
      console.error("Error fetching total claims:", error);
      setTotalClaims(0);
    }
  };

  const fetchTotalsByStatus = async () => {
    try {
      const response = await claimApi.getNumberAllClaims();
      if (response?.success && response.data) {
        setDraftTotal(response.data.draftClaims || 0);
        setPendingTotal(response.data.pendingClaims || 0);
        setApprovedTotal(response.data.approvedClaims || 0);
        setPaidTotal(response.data.paidClaims || 0);
        setRejectedTotal(response.data.rejectClaims || 0);
        setCancelledTotal(response.data.cancelClaims || 0);
        setReturnedTotal(response.data.returnClaims || 0);
      }
    } catch (error) {
      console.error("Error fetching totals by status:", error);
    }
  };

  const fetchAllRequests = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchTotalClaims(),
        fetchTotalsByStatus(),
        fetchRequests("1", setDraftRequests, currentPage),
        fetchRequests("2", setPendingRequests, currentPage),
        fetchRequests("3", setApprovedRequests, currentPage),
        fetchRequests("4", setPaidRequests, currentPage),
        fetchRequests("5", setRejectedRequests, currentPage),
        fetchRequests("6", setCancelledRequests, currentPage),
        fetchRequests("7", setReturnedRequests, currentPage),
      ]);
    } catch (error) {
      console.error("Error fetching all requests:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load tất cả dữ liệu khi component mount
  useEffect(() => {
    fetchAllRequests();
  }, []);

  // Fetch lại dữ liệu cho tab hiện tại khi chuyển tab
  useEffect(() => {
    switch (currentView) {
      case "draft":
        fetchRequests("1", setDraftRequests, currentPage);
        break;
      case "pending":
        fetchRequests("2", setPendingRequests, currentPage);
        break;
      case "approved":
        fetchRequests("3", setApprovedRequests, currentPage);
        break;
      case "paid":
        fetchRequests("4", setPaidRequests, currentPage);
        break;
      case "rejected":
        fetchRequests("5", setRejectedRequests, currentPage);
        break;
      case "cancelled":
        fetchRequests("6", setCancelledRequests, currentPage);
        break;
      case "returned":
        fetchRequests("7", setReturnedRequests, currentPage);
        break;
    }
  }, [currentView]);

  // Thêm useEffect để theo dõi selectedMonth
  useEffect(() => {
    if (currentView) {
      fetchRequests(
        currentView === "draft" ? "1" :
        currentView === "pending" ? "2" :
        currentView === "approved" ? "3" :
        currentView === "paid" ? "4" :
        currentView === "rejected" ? "5" :
        currentView === "cancelled" ? "6" : "7",
        getCurrentSetterFunction(),
        1
      );
    }
  }, [selectedMonth]); // Thêm selectedMonth vào dependencies

  const handleViewChange = (view: ViewType) => {
    setCurrentView(view);
    switch (view) {
      case "draft":
        setCurrentPage(draftPage);
        break;
      case "pending":
        setCurrentPage(pendingPage);
        break;
      case "approved":
        setCurrentPage(approvedPage);
        break;
      case "paid":
        setCurrentPage(paidPage);
        break;
      case "rejected":
        setCurrentPage(rejectedPage);
        break;
      case "cancelled":
        setCurrentPage(cancelledPage);
        break;
      case "returned":
        setCurrentPage(returnedPage);
        break;
    }
  };

  const handleRowClick = (claimId: string) => {
    navigate(`/claims/${claimId}`);
  };

  const getCurrentRequests = () => {
    switch (currentView) {
      case "draft":
        return draftRequests || [];
      case "pending":
        return pendingRequests || [];
      case "approved":
        return approvedRequests || [];
      case "paid":
        return paidRequests || [];
      case "rejected":
        return rejectedRequests || [];
      case "cancelled":
        return cancelledRequests || [];
      case "returned":
        return returnedRequests || [];
      default:
        return [];
    }
  };

  const getViewTitle = () => {
    switch (currentView) {
      case "draft":
        return "Draft Requests";
      case "pending":
        return "Pending Approval Requests";
      case "approved":
        return "Approved Requests";
      case "paid":
        return "Paid Requests";
      case "rejected":
        return "Rejected Requests";
      case "cancelled":
        return "Cancelled Requests";
      case "returned":
        return "Returned Requests";
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);

    switch (currentView) {
      case "draft":
        setDraftPage(page);
        fetchRequests("1", setDraftRequests, page);
        break;
      case "pending":
        setPendingPage(page);
        fetchRequests("2", setPendingRequests, page);
        break;
      case "approved":
        setApprovedPage(page);
        fetchRequests("3", setApprovedRequests, page);
        break;
      case "paid":
        setPaidPage(page);
        fetchRequests("4", setPaidRequests, page);
        break;
      case "rejected":
        setRejectedPage(page);
        fetchRequests("5", setRejectedRequests, page);
        break;
      case "cancelled":
        setCancelledPage(page);
        fetchRequests("6", setCancelledRequests, page);
        break;
      case "returned":
        setReturnedPage(page);
        fetchRequests("7", setReturnedRequests, page);
        break;
    }
  };

  // Thêm hàm kiểm tra trang tiếp theo
  const checkNextPage = async (pageNumber: number) => {
    try {
      const formattedMonth = selectedMonth ? selectedMonth.split('-')[1] + '/' + selectedMonth.split('-')[0] : '';
      
      const response = await claimApi.filterClaims(
        selectedMonth ? {
          "ClaimStatus": currentView === "draft" ? "1" :
            currentView === "pending" ? "2" :
            currentView === "approved" ? "3" :
            currentView === "paid" ? "4" :
            currentView === "rejected" ? "5" :
            currentView === "cancelled" ? "6" : "7",
          "CreateAt": formattedMonth
        } : (currentView === "draft" ? "1" :
            currentView === "pending" ? "2" :
            currentView === "approved" ? "3" :
            currentView === "paid" ? "4" :
            currentView === "rejected" ? "5" :
            currentView === "cancelled" ? "6" : "7"),
        "createAt",
        "desc",
        pageNumber + 1,
        pageSize
      );
      
      const hasData = response?.success && Array.isArray(response.data) && response.data.length > 0;
      setHasNextPage(hasData);
    } catch (err) {
      setHasNextPage(false);
    }
  };

  // Sửa lại handleMonthChange để chỉ cập nhật state
  const handleMonthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedMonth(event.target.value);
    setCurrentPage(1); // Reset về trang 1
  };

  const getCurrentSetterFunction = () => {
    switch (currentView) {
      case "draft": return setDraftRequests;
      case "pending": return setPendingRequests;
      case "approved": return setApprovedRequests;
      case "paid": return setPaidRequests;
      case "rejected": return setRejectedRequests;
      case "cancelled": return setCancelledRequests;
      case "returned": return setReturnedRequests;
    }
  };

  const handleClickCreate = () => {
    navigate('/create-claim')
  }

  return (
    <div className="flex">
      <div className="flex-1 p-6 bg-white dark:bg-gray-900 transition-colors duration-300 ease-in-out">
        {/* Header với animation fade in từ trên xuống */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-6"
        >
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white transition-colors duration-300">Dashboard</h1>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 transition-all duration-300 hover:scale-105"
            onClick={handleClickCreate}
          >
            <Plus className="w-4 h-4" />
            Create claim Request
          </Button>
        </motion.div>

        {/* Total Claims Card với animation scale và hover */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 shadow border border-gray-200 dark:border-gray-700 mb-8 transform transition-all duration-300 hover:shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-3xl font-semibold text-gray-900 dark:text-white transition-colors duration-300">{totalClaims}</h3>
              <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">Total Requests</p>
            </div>
            <div className="p-4 bg-blue-100/30 dark:bg-blue-900/30 rounded-lg transition-colors duration-300">
              <LayoutDashboard className="w-8 h-8 text-blue-600 dark:text-blue-400 transition-colors duration-300" />
            </div>
          </div>
        </motion.div>

        {/* Status Cards Grid với animation stagger */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-6 mb-8"
        >
          {/* Wrap mỗi card trong motion.div */}
          <motion.div
            variants={{
              hidden: { opacity: 0, x: -20 },
              visible: { opacity: 1, x: 0 }
            }}
            className={`bg-gray-100 dark:bg-gray-800 rounded-lg p-6 shadow border border-gray-200 dark:border-gray-700 
              cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-105
              ${currentView === "draft" ? "ring-2 ring-blue-500" : ""}`}
            onClick={() => handleViewChange("draft")}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white transition-colors duration-300">
                  {draftTotal}
                </h3>
                <p className="text-black-600 dark:text-gray-400 transition-colors duration-300">Draft Requests</p>
              </div>
              <div className="p-3 bg-gray-200/30 dark:bg-gray-900/30 rounded-lg transition-colors duration-300">
                <FileText className="w-6 h-6 text-gray-600 dark:text-gray-400 transition-colors duration-300" />
              </div>
            </div>
          </motion.div>

          {/* Pending Card */}
          <motion.div
            variants={{
              hidden: { opacity: 0, x: -20 },
              visible: { opacity: 1, x: 0 }
            }}
            className={`bg-gray-100 dark:bg-gray-800 rounded-lg p-6 shadow border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-105 ${
              currentView === "pending" ? "ring-2 ring-blue-500" : ""
            }`}
            onClick={() => handleViewChange("pending")}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white transition-colors duration-300">
                  {pendingTotal}
                </h3>
                <p className="text-black-600 dark:text-gray-400 transition-colors duration-300">Pending Approval</p>
              </div>
              <div className="p-3 bg-yellow-100/30 dark:bg-yellow-900/30 rounded-lg transition-colors duration-300">
                <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400 transition-colors duration-300" />
              </div>
            </div>
          </motion.div>

          {/* Approved Card */}
          <motion.div
            variants={{
              hidden: { opacity: 0, x: -20 },
              visible: { opacity: 1, x: 0 }
            }}
            className={`bg-gray-100 dark:bg-gray-800 rounded-lg p-6 shadow border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-105 ${
              currentView === "approved" ? "ring-2 ring-blue-500" : ""
            }`}
            onClick={() => handleViewChange("approved")}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white transition-colors duration-300">
                  {approvedTotal}
                </h3>
                <p className="text-black-600 dark:text-gray-400 transition-colors duration-300">Approved Requests</p>
              </div>
              <div className="p-3 bg-green-100/30 dark:bg-green-900/30 rounded-lg transition-colors duration-300">
                <FileText className="w-6 h-6 text-green-600 dark:text-green-400 transition-colors duration-300" />
              </div>
            </div>
          </motion.div>

          {/* Paid Card */}
          <motion.div
            variants={{
              hidden: { opacity: 0, x: -20 },
              visible: { opacity: 1, x: 0 }
            }}
            className={`bg-gray-100 dark:bg-gray-800 rounded-lg p-6 shadow border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-105 ${
              currentView === "paid" ? "ring-2 ring-blue-500" : ""
            }`}
            onClick={() => handleViewChange("paid")}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white transition-colors duration-300">
                  {paidTotal}
                </h3>
                <p className="text-black-600 dark:text-gray-400 transition-colors duration-300">Paid Requests</p>
              </div>
              <div className="p-3 bg-purple-100/30 dark:bg-purple-900/30 rounded-lg transition-colors duration-300">
                <Ticket className="w-6 h-6 text-purple-600 dark:text-purple-400 transition-colors duration-300" />
              </div>
            </div>
          </motion.div>

          {/* Rejected Card */}
          <motion.div
            variants={{
              hidden: { opacity: 0, x: -20 },
              visible: { opacity: 1, x: 0 }
            }}
            className={`bg-gray-100 dark:bg-gray-800 rounded-lg p-6 shadow border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-105 ${
              currentView === "rejected" ? "ring-2 ring-blue-500" : ""
            }`}
            onClick={() => handleViewChange("rejected")}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white transition-colors duration-300">
                  {rejectedTotal}
                </h3>
                <p className="text-black-600 dark:text-gray-400 transition-colors duration-300">Rejected Requests</p>
              </div>
              <div className="p-3 bg-red-100/30 dark:bg-red-900/30 rounded-lg transition-colors duration-300">
                <X  className="w-6 h-6 text-red-600 dark:text-red-400 transition-colors duration-300" />
              </div>
            </div>
          </motion.div>

          {/* Cancelled Card */}
          <motion.div
            variants={{
              hidden: { opacity: 0, x: -20 },
              visible: { opacity: 1, x: 0 }
            }}
            className={`bg-gray-100 dark:bg-gray-800 rounded-lg p-6 shadow border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-105 ${
              currentView === "cancelled" ? "ring-2 ring-blue-500" : ""
            }`}
            onClick={() => handleViewChange("cancelled")}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white transition-colors duration-300">
                  {cancelledTotal}
                </h3>
                <p className="text-black-600 dark:text-gray-400 transition-colors duration-300">Cancelled Requests</p>
              </div>
              <div className="p-3 bg-gray-200/30 dark:bg-gray-900/30 rounded-lg transition-colors duration-100">
                <Trash2Icon className="w-6 h-6 text-blue-600 dark:text-blue-400 transition-colors duration-100" />
              </div>
            </div>
          </motion.div>

          {/* Returned Card */}
          <motion.div
            variants={{
              hidden: { opacity: 0, x: -20 },
              visible: { opacity: 1, x: 0 }
            }}
            className={`bg-gray-100 dark:bg-gray-800 rounded-lg p-6 shadow border border-gray-200 dark:border-gray-700 
              cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-105
              ${currentView === "returned" ? "ring-2 ring-blue-500" : ""}`}
            onClick={() => handleViewChange("returned")}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white transition-colors duration-300">
                  {returnedTotal}
                </h3>
                <p className="text-black-600 dark:text-gray-400 transition-colors duration-300">Returned Requests</p>
              </div>
              <div className="p-3 bg-orange-100/30 dark:bg-orange-900/30 rounded-lg transition-colors duration-300">
                <RotateCcw className="w-6 h-6 text-orange-500 dark:text-orange-400 transition-colors duration-300" />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Claims Table - Bỏ motion.div, chỉ giữ div bình thường */}
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow p-4 mt-8 transition-colors duration-300">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white transition-colors duration-300">{getViewTitle()}</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">Filter by Create At:</span>
              <input
                type="month"
                value={selectedMonth}
                onChange={handleMonthChange}
                className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded px-3 py-2 
                  border border-gray-200 dark:border-gray-600
                  transition-colors duration-300
                  hover:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center p-4">
              <Loader2 className="h-6 w-6 animate-spin text-gray-600 dark:text-white" />
            </div>
          ) : (
            <>
              {(getCurrentRequests()?.length || 0) === 0 ? (
                <div className="text-center py-8 text-gray-600 dark:text-gray-400 transition-colors duration-300">
                  No requests found
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
                        <th className="px-4 py-2 text-left text-gray-900 dark:text-white transition-colors duration-300">Staff ID</th>
                        <th className="px-4 py-2 text-left text-gray-900 dark:text-white transition-colors duration-300">Project ID</th>
                        <th className="px-4 py-2 text-left text-gray-900 dark:text-white transition-colors duration-300">Hours</th>
                        <th className="px-4 py-2 text-left text-gray-900 dark:text-white transition-colors duration-300">Claim Date</th>
                        <th className="px-4 py-2 text-left text-gray-900 dark:text-white transition-colors duration-300">Create At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getCurrentRequests()?.map((request) => (
                        <tr
                          key={request.claimId}
                          onClick={() => handleRowClick(request.claimId)}
                          className="border-b border-gray-200 dark:border-gray-700 
                            hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer 
                            transition-colors duration-300"
                        >
                          <td className="px-4 py-2 text-gray-900 dark:text-gray-200 transition-colors duration-300">{request.staffId}</td>
                          <td className="px-4 py-2 text-gray-900 dark:text-gray-200 transition-colors duration-300">{request.projectId}</td>
                          <td className="px-4 py-2 text-gray-900 dark:text-gray-200 transition-colors duration-300">{request.workingHours}</td>
                          <td className="px-4 py-2 text-gray-900 dark:text-gray-200 transition-colors duration-300">
                            {new Date(request.claimDate).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-2 text-gray-900 dark:text-gray-200 transition-colors duration-300">
                            {new Date(request.createAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {getCurrentRequests()?.length > 0 && (
            <div className="mt-4">
              <CustomPagination
                page={currentPage}
                hasNextPage={hasNextPage}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;