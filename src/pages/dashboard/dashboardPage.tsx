import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
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

  useEffect(() => {
    fetchAllRequests();
  }, []);

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
  }, [selectedMonth]);

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

  const handleMonthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedMonth(event.target.value);
    setCurrentPage(1);
    const status = currentView === "draft" ? "1" :
      currentView === "pending" ? "2" :
        currentView === "approved" ? "3" :
          currentView === "paid" ? "4" :
            currentView === "rejected" ? "5" :
              currentView === "cancelled" ? "6" : "7";
    fetchRequests(status, getCurrentSetterFunction(), 1);
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
      <div className="flex-1 p-6 bg-background text-foreground transition-colors duration-300 ease-in-out">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-6"
        >
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <Button
            className="flex items-center gap-2 transition-all duration-300 hover:scale-105"
            onClick={handleClickCreate}
          >
            <Plus className="w-4 h-4" />
            Create claim Request
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Card className="transform transition-all duration-300 hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
              <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalClaims}</div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-6 mb-8">
          <div
            className={`cursor-pointer transition-all duration-300 rounded-lg ${currentView === "draft" ? "border-b-4 border-primary" : "border-b-4 border-transparent"}`}
            onClick={() => handleViewChange("draft")}
          >
            <Card className="h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Draft Requests</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{draftTotal}</div>
              </CardContent>
            </Card>
          </div>

          <div
            className={`cursor-pointer transition-all duration-300 rounded-lg ${currentView === "pending" ? "border-b-4 border-primary" : "border-b-4 border-transparent"}`}
            onClick={() => handleViewChange("pending")}
          >
            <Card className="h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingTotal}</div>
              </CardContent>
            </Card>
          </div>

          <div
            className={`cursor-pointer transition-all duration-300 rounded-lg ${currentView === "approved" ? "border-b-4 border-primary" : "border-b-4 border-transparent"}`}
            onClick={() => handleViewChange("approved")}
          >
            <Card className="h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approved Requests</CardTitle>
                <FileText className="h-4 w-4 text-green-600 dark:text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{approvedTotal}</div>
              </CardContent>
            </Card>
          </div>

          <div
            className={`cursor-pointer transition-all duration-300 rounded-lg ${currentView === "paid" ? "border-b-4 border-primary" : "border-b-4 border-transparent"}`}
            onClick={() => handleViewChange("paid")}
          >
            <Card className="h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Paid Requests</CardTitle>
                <Ticket className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{paidTotal}</div>
              </CardContent>
            </Card>
          </div>

          <div
            className={`cursor-pointer transition-all duration-300 rounded-lg ${currentView === "rejected" ? "border-b-4 border-primary" : "border-b-4 border-transparent"}`}
            onClick={() => handleViewChange("rejected")}
          >
            <Card className="h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rejected Requests</CardTitle>
                <X className="h-4 w-4 text-red-600 dark:text-red-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{rejectedTotal}</div>
              </CardContent>
            </Card>
          </div>

          <div
            className={`cursor-pointer transition-all duration-300 rounded-lg ${currentView === "cancelled" ? "border-b-4 border-primary" : "border-b-4 border-transparent"}`}
            onClick={() => handleViewChange("cancelled")}
          >
            <Card className="h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cancelled Requests</CardTitle>
                <Trash2Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{cancelledTotal}</div>
              </CardContent>
            </Card>
          </div>

          <div
            className={`cursor-pointer transition-all duration-300 rounded-lg ${currentView === "returned" ? "border-b-4 border-primary" : "border-b-4 border-transparent"}`}
            onClick={() => handleViewChange("returned")}
          >
            <Card className="h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Returned Requests</CardTitle>
                <RotateCcw className="h-4 w-4 text-orange-500 dark:text-orange-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{returnedTotal}</div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-xl">{getViewTitle()}</CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Filter by Create At:</span>
              <Input
                type="month"
                value={selectedMonth}
                onChange={handleMonthChange}
                className="w-auto"
              />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                {(getCurrentRequests()?.length || 0) === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No requests found
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Project Name</TableHead>
                          <TableHead>Hours</TableHead>
                          <TableHead>Claim Date</TableHead>
                          <TableHead>Create At</TableHead>
                          <TableHead>Update At</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getCurrentRequests()?.map((request) => (
                          <TableRow
                            key={request.claimId}
                            onClick={() => handleRowClick(request.claimId)}
                            className="cursor-pointer"
                          >
                            {/* <TableCell>{request.staffId}</TableCell> */}
                            <TableCell>{request.projectName}</TableCell>
                            <TableCell>{request.workingHours}</TableCell>
                            <TableCell>
                              {new Date(request.claimDate).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              {new Date(request.createAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              {request.updateAt? new Date(request.updateAt).toLocaleDateString() : "N/A"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </>
            )}

            {getCurrentRequests()?.length > 0 && !loading && (
              <div className="mt-4">
                <CustomPagination
                  page={currentPage}
                  hasNextPage={hasNextPage}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;