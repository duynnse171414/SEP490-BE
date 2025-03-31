import { Button } from "@/components/ui/button";
import {
  Plus,
  Clock,
  FileText,
  X,
  Loader2,
  Ticket,
  LayoutDashboard,
  Ban
} from "lucide-react";
import { useState, useEffect } from "react";
import { ClaimRequest } from "@/types/claims";
import { claimApi } from "@/api/claimApi";
import { useNavigate } from "react-router-dom";
import "../css/dashboardPage.css";

type ViewType = "draft" | "pending" | "approved" | "paid" | "rejected" | "cancelled" | "returned";

interface CustomPaginationProps {
  page: number;
  hasNextPage: boolean;
  onPageChange: (page: number) => void;
}

const CustomPagination = ({ page, hasNextPage, onPageChange }: CustomPaginationProps) => {
  return (
    <div className="flex justify-center gap-2">
      <Button
        variant="outline"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
      >
        Previous
      </Button>
      <div className="flex items-center gap-2">
        <span className="text-sm">Page {page}</span>
      </div>
      <Button
        variant="outline"
        onClick={() => onPageChange(page + 1)}
        disabled={!hasNextPage}
      >
        Next
      </Button>
    </div>
  );
};

const DashboardPage = () => {
  const navigate = useNavigate();
  const pageSize = 10;
  const [totalClaims, setTotalClaims] = useState(0);
  const [currentView, setCurrentView] = useState<ViewType>("draft");
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

  const fetchRequests = async (
    status: string,
    setData: (data: ClaimRequest[]) => void,
    page: number
  ) => {
    try {
      const response = await claimApi.filterClaims(
        status,
        "createAt",
        "desc",
        page,
        pageSize
      );
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

  // Hàm chuyển đổi status number sang text
  const getStatusText = (status: string | number) => {
    // Chuyển status về string để so sánh
    const statusStr = String(status);
    
    switch (statusStr) {
      case "1":
        return "Draft";
      case "2": 
        return "Pending";
      case "3":
        return "Approved";
      case "4":
        return "Paid";
      case "5":
        return "Rejected";
      case "6":
        return "Cancelled";
      case "7":
        return "Returned";
      default:
        console.log("Unknown status:", status); // Log giá trị không khớp
        return "Unknown";
    }
  };

  // Thêm hàm kiểm tra trang tiếp theo
  const checkNextPage = async (pageNumber: number) => {
    try {
      const response = await claimApi.filterClaims(
        currentView === "draft" ? "1" :
        currentView === "pending" ? "2" :
        currentView === "approved" ? "3" :
        currentView === "paid" ? "4" :
        currentView === "rejected" ? "5" :
        currentView === "cancelled" ? "6" : "7" ,
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

  return (
    <div className="flex">
      {/* Sidebar sẽ được thêm vào bởi layout */}
      <div className="flex-1 p-6 bg-gray-900">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create claim Request
            </Button>
        </div>

        {/* Total Claims Card */}
        <div className="bg-gray-800 rounded-lg p-6 shadow border border-gray-700 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-3xl font-semibold text-white">{totalClaims}</h3>
              <p className="text-gray-400">Total Requests</p>
            </div>
            <div className="p-4 bg-blue-900/30 rounded-lg">
              <LayoutDashboard className="w-8 h-8 text-blue-400" />
            </div>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-6 mb-8">
          {/* Draft Card */}
          <div
            className={`bg-gray-800 rounded-lg p-6 shadow border border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors ${
              currentView === "draft" ? "ring-2 ring-blue-500" : ""
            }`}
            onClick={() => handleViewChange("draft")}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-2xl font-semibold text-white">
                  {draftTotal}
                </h3>
                <p className="text-gray-400">Draft Requests</p>
              </div>
              <div className="p-3 bg-gray-900/30 rounded-lg">
                <FileText className="w-6 h-6 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Pending Card */}
          <div
            className={`bg-gray-800 rounded-lg p-6 shadow border border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors ${
              currentView === "pending" ? "ring-2 ring-blue-500" : ""
            }`}
            onClick={() => handleViewChange("pending")}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-2xl font-semibold text-white">
                  {pendingTotal}
                </h3>
                <p className="text-gray-400">Pending Approval</p>
              </div>
              <div className="p-3 bg-yellow-900/30 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
          </div>

          {/* Approved Card */}
          <div
            className={`bg-gray-800 rounded-lg p-6 shadow border border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors ${
              currentView === "approved" ? "ring-2 ring-blue-500" : ""
            }`}
            onClick={() => handleViewChange("approved")}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-2xl font-semibold text-white">
                  {approvedTotal}
                </h3>
                <p className="text-gray-400">Approved Requests</p>
              </div>
              <div className="p-3 bg-green-900/30 rounded-lg">
                <FileText className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </div>

          {/* Paid Card */}
          <div
            className={`bg-gray-800 rounded-lg p-6 shadow border border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors ${
              currentView === "paid" ? "ring-2 ring-blue-500" : ""
            }`}
            onClick={() => handleViewChange("paid")}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-2xl font-semibold text-white">
                  {paidTotal}
                </h3>
                <p className="text-gray-400">Paid Requests</p>
              </div>
              <div className="p-3 bg-purple-900/30 rounded-lg">
                <Ticket className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </div>

          {/* Rejected Card */}
          <div
            className={`bg-gray-800 rounded-lg p-6 shadow border border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors ${
              currentView === "rejected" ? "ring-2 ring-blue-500" : ""
            }`}
            onClick={() => handleViewChange("rejected")}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-2xl font-semibold text-white">
                  {rejectedTotal}
                </h3>
                <p className="text-gray-400">Rejected Requests</p>
              </div>
              <div className="p-3 bg-red-900/30 rounded-lg">
                <X className="w-6 h-6 text-red-400" />
              </div>
            </div>
          </div>

          {/* Cancelled Card */}
          <div
            className={`bg-gray-800 rounded-lg p-6 shadow border border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors ${
              currentView === "cancelled" ? "ring-2 ring-blue-500" : ""
            }`}
            onClick={() => handleViewChange("cancelled")}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-2xl font-semibold text-white">
                  {cancelledTotal}
                </h3>
                <p className="text-gray-400">Cancelled Requests</p>
              </div>
              <div className="p-3 bg-gray-900/30 rounded-lg">
                <Ban className="w-6 h-6 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Returned Card */}
          <div
            className={`bg-gray-800 rounded-lg p-6 shadow border border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors ${
              currentView === "returned" ? "ring-2 ring-blue-500" : ""
            }`}
            onClick={() => handleViewChange("returned")}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-2xl font-semibold text-white">
                  {returnedTotal}
                </h3>
                <p className="text-gray-400">Returned Requests</p>
              </div>
              <div className="p-3 bg-gray-900/30 rounded-lg">
                <FileText className="w-6 h-6 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Claims Table */}
        <div className="bg-gray-800 rounded-lg shadow p-4 mt-8 claims-table-container">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">{getViewTitle()}</h2>
          </div>

          {loading ? (
            <div className="claims-loading-state">
              <Loader2 className="h-6 w-6 animate-spin text-white" />
            </div>
          ) : (
            <>
              {(getCurrentRequests()?.length || 0) === 0 ? (
                <div className="claims-empty-state">
                  No requests found
                </div>
              ) : (
                <div className="claims-table-wrapper">
                  <table className="claims-table">
                    <thead>
                      <tr>
                        <th>Staff ID</th>
                        <th>Project ID</th>
                        <th>Hours</th>
                        <th>Amount</th>
                        <th>Claim Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getCurrentRequests()?.map((request) => (
                        <tr
                          key={request.claimId}
                          onClick={() => handleRowClick(request.claimId)}
                        >
                          <td>{request.staffId}</td>
                          <td>{request.projectId}</td>
                          <td>{request.workingHours}</td>
                          <td>{request.claimAmount}</td>
                          <td>{new Date(request.claimDate).toLocaleDateString()}</td>
                          <td>{getStatusText(request.claimStatus)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {getCurrentRequests()?.length > 0 && (
                <div className="claims-pagination">
                  <CustomPagination
                    page={currentPage}
                    hasNextPage={hasNextPage}
                    onPageChange={(page) => handlePageChange(page)}
                  />
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;