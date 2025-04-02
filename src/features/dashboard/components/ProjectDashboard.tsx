import { Button } from "@/components/ui/button";
import { useEffect, useState, useRef } from "react";
import { fetcher, postData, putData, deleteData } from "@/api/fetchers";
import axiosInstance from "@/api/axiosInstance";
import {
  Eye,
  MoreHorizontal,
  Filter,
  Pencil,
  Trash2,
  Download,
  Upload,
  Folder,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import TopLoadingBar from "@/components/common/TopLoadingBar";
import { GetAllProjectDTO } from "../type";
import HeaderAdmin from "@/sections/HeaderAdmin";
import CustomPagination from "@/components/common/CustomPagination";
import { ProjectFormDialog } from "./ProjectFormDialog";
import {
  notifySuccess,
  notifyError,
  ToastNotification,
} from "@/components/ui/notification";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Link } from "react-router-dom";

const ProjectDashboard = () => {
  const [projects, setProjects] = useState<GetAllProjectDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSorting, setIsSorting] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    isActive: "",
    sortBy: [] as { field: string; direction: "asc" | "desc" }[],
  });
  const [filter, setFilter] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedProject, setSelectedProject] =
    useState<GetAllProjectDTO | null>(null);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isWarningDialogOpen, setIsWarningDialogOpen] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(() => {
    const viewportHeight = window.innerHeight;
    const headerHeight = 64;
    const footerHeight = 64;
    const tableHeaderHeight = 56;
    const tableRowHeight = 73;
    const availableHeight =
      viewportHeight - (headerHeight + footerHeight + tableHeaderHeight + 120);
    const calculatedItems = Math.floor(availableHeight / tableRowHeight);
    return Math.max(1, calculatedItems);
  });

  const currentProjects = projects || [];
  const initialFetchDone = useRef(false);

  useEffect(() => {
    if (!initialFetchDone.current) {
      fetchProjects();
      initialFetchDone.current = true;
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const viewportHeight = window.innerHeight;
      const headerHeight = 64;
      const footerHeight = 64;
      const tableHeaderHeight = 56;
      const tableRowHeight = 73;
      const availableHeight =
        viewportHeight -
        (headerHeight + footerHeight + tableHeaderHeight + 120);
      const calculatedItems = Math.floor(availableHeight / tableRowHeight);
      setItemsPerPage(Math.max(1, calculatedItems));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const queryParams = new URLSearchParams({
        pageNumber: currentPage.toString(),
        pageSize: itemsPerPage.toString(),
      });
      queryParams.append("isActive", "");
      queryParams.append("sortBy", "");
      const url = `/Project/sort?${queryParams.toString()}`;

      const response = await fetcher(url);
      if (response.success && Array.isArray(response.data)) {
        setProjects(response.data);
        setError(null);
        await checkNextPage(currentPage);
      } else {
        setError(response?.error?.[0] || "Failed to fetch projects");
      }
    } catch (err) {
      setError("Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSortWithConfig = async (
    config: typeof sortConfig,
    forcePageOne?: boolean
  ) => {
    try {
      console.log("Starting handleSortWithConfig:", { config, forcePageOne });
      setIsSorting(true);
      const sortByString = config.sortBy
        .map((sort) => `${sort.field}:${sort.direction}`)
        .join(",");

      console.log("Sort string generated:", sortByString);

      const queryParams = new URLSearchParams();
      queryParams.append("isActive", config.isActive || "");
      queryParams.append("sortBy", sortByString);

      if (forcePageOne) {
        console.log("Forcing page one, resetting currentPage");
        setCurrentPage(1);
        queryParams.append("pageNumber", "1");
      } else {
        console.log("Using current page:", currentPage);
        queryParams.append("pageNumber", currentPage.toString());
      }

      queryParams.append("pageSize", itemsPerPage.toString());
      const url = `/Project/sort?${queryParams.toString()}`;
      console.log("Fetching data with URL:", url);

      const result = await fetcher(url);
      console.log("Fetch result:", {
        success: result.success,
        dataLength: result.data?.length,
      });

      if (result.success && Array.isArray(result.data)) {
        setProjects(result.data);
        setSortConfig(config);
        setError(null);

        const nextPageParams = new URLSearchParams();
        nextPageParams.append(
          "pageNumber",
          forcePageOne ? "2" : (currentPage + 1).toString()
        );
        nextPageParams.append("pageSize", itemsPerPage.toString());
        nextPageParams.append("isActive", config.isActive || "");
        nextPageParams.append("sortBy", sortByString);

        const nextPageUrl = `/Project/sort?${nextPageParams.toString()}`;
        console.log("Checking next page with URL:", nextPageUrl);

        const nextPageResponse = await fetcher(nextPageUrl);
        console.log("Next page check result:", {
          hasData:
            Array.isArray(nextPageResponse.data) &&
            nextPageResponse.data.length > 0,
          dataLength: nextPageResponse.data?.length,
        });

        const hasNextPageData =
          Array.isArray(nextPageResponse.data) &&
          nextPageResponse.data.length > 0;
        setHasNextPage(hasNextPageData);
      } else {
        console.error("Sort request failed:", result?.error || "Unknown error");
        setError(result?.error?.[0] || "Invalid response format from server");
        setProjects([]);
        setHasNextPage(false);
      }
    } catch (err) {
      console.error("Sort error:", err);
      setError("Có lỗi xảy ra khi sắp xếp dữ liệu. Vui lòng thử lại sau.");
      setProjects([]);
      setHasNextPage(false);
    } finally {
      setIsSorting(false);
    }
  };

  const getSortIcon = (field: string) => {
    const checkField = field === "isActive" ? "Active" : field;
    const sortItem = sortConfig.sortBy.find(
      (sort) => sort.field === checkField
    );
    if (!sortItem) return null;
    return sortItem.direction === "asc" ? "↑" : "↓";
  };

  const handleSearch = async (activeFilter?: string) => {
    try {
      setIsLoading(true);

      if (!searchTerm.trim()) {
        setIsSearchMode(false);
        setFilter("");
        setSortConfig({
          isActive: "",
          sortBy: [],
        });
        await fetchProjects();
        return;
      }

      if (activeFilter) {
        setFilter(activeFilter);
      }

      setSortConfig((prev) => ({
        isActive: prev.isActive,
        sortBy: [],
      }));
      setCurrentPage(1);

      const queryParams = new URLSearchParams();
      const filterToUse = activeFilter || filter;

      if (filterToUse === "true" || filterToUse === "false") {
        queryParams.append("isActive", filterToUse);
      }

      queryParams.append("projectName", searchTerm);
      queryParams.append("pageSize", itemsPerPage.toString());
      queryParams.append("pageNumber", "1");

      const url = `/Project/search?${queryParams.toString()}`;
      const result = await fetcher(url);

      if (result.success && Array.isArray(result.data)) {
        setProjects(result.data);
        setError(null);

        const nextPageQueryParams = new URLSearchParams({
          pageNumber: "2",
          pageSize: itemsPerPage.toString(),
        });

        if (filterToUse === "true" || filterToUse === "false") {
          nextPageQueryParams.append("isActive", filterToUse);
        }
        nextPageQueryParams.append("projectName", searchTerm);

        const nextPageUrl = `/Project/search?${nextPageQueryParams.toString()}`;
        const nextPageResponse = await fetcher(nextPageUrl);

        const hasNextPageData =
          Array.isArray(nextPageResponse.data) &&
          nextPageResponse.data.length > 0;
        setHasNextPage(hasNextPageData);
      } else {
        notifyError(result?.error?.[0] || "Failed to search projects");
        setProjects([]);
        setHasNextPage(false);
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error?.[0] ||
        "An error occurred while searching projects";
      notifyError(errorMessage);
      setProjects([]);
      setHasNextPage(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = async (page: number) => {
    try {
      setIsLoading(true);
      const queryParams = new URLSearchParams({
        pageNumber: page.toString(),
        pageSize: itemsPerPage.toString(),
      });

      let url = "";
      if (isSearchMode && searchTerm.trim()) {
        if (filter === "true" || filter === "false") {
          queryParams.append("isActive", filter);
        }
        queryParams.append("projectName", searchTerm);
        url = `/Project/search?${queryParams.toString()}`;
      } else {
        queryParams.append("isActive", sortConfig.isActive || "");
        const sortByString = sortConfig.sortBy
          .map((sort) => `${sort.field}:${sort.direction}`)
          .join(",");
        queryParams.append("sortBy", sortByString);
        url = `/Project/sort?${queryParams.toString()}`;
      }

      const response = await fetcher(url);

      if (response.success && Array.isArray(response.data)) {
        if (response.data.length === 0) {
          if (page > 1) {
            setCurrentPage(page - 1);
            setHasNextPage(false);
            await handlePageChange(page - 1);
          } else {
            setProjects([]);
            setHasNextPage(false);
          }
          return;
        }

        setProjects(response.data);
        setError(null);
        await checkNextPage(page);
      } else {
        setError(response?.error?.[0] || "Invalid response format from server");
        setProjects([]);
        setHasNextPage(false);
      }
    } catch (err) {
      setError("Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.");
      setProjects([]);
      setHasNextPage(false);
    } finally {
      setIsLoading(false);
    }

    setCurrentPage(page);
  };

  const handleColumnSort = (field: string) => {
    console.log("handleColumnSort called with field:", field);
    setSearchTerm("");
    setIsSearchMode(false);

    if (!sortConfig.isActive) {
      setSortConfig((prev) => ({ ...prev, isActive: "" }));
    }

    const newSortBy = [...sortConfig.sortBy];
    const sortField = field === "isActive" ? "Active" : field;
    const existingIndex = newSortBy.findIndex(
      (sort) => sort.field === sortField
    );

    console.log("Current sort config:", {
      sortConfig,
      existingIndex,
      currentField: sortField,
    });

    if (existingIndex !== -1) {
      if (newSortBy[existingIndex].direction === "asc") {
        newSortBy[existingIndex].direction = "desc";
      } else {
        newSortBy.splice(existingIndex, 1);
      }
    } else {
      newSortBy.push({ field: sortField, direction: "asc" as const });
    }

    const newConfig = {
      ...sortConfig,
      isActive: sortConfig.isActive || "",
      sortBy: newSortBy,
    };

    console.log("New sort config:", newConfig);
    setSortConfig(newConfig);
    handleSortWithConfig(newConfig);
  };

  const handleDeleteProject = async (projectId: number) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const response = await deleteData(`/Project/${projectId}`);
      if (response && response.success) {
        notifySuccess("Project deleted successfully");

        if (currentProjects.length === 1 && currentPage > 1) {
          await handlePageChange(currentPage - 1);
        } else {
          if (isSearchMode && searchTerm) {
            await handleSearch();
          } else if (
            sortConfig.sortBy.length > 0 ||
            sortConfig.isActive === "true" ||
            sortConfig.isActive === "false"
          ) {
            await handleSortWithConfig(sortConfig);
          } else {
            await fetchProjects();
          }
        }
      } else {
        notifyError(response?.error?.[0] || "Failed to delete project");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error?.[0] ||
        "An error occurred while deleting the project";
      notifyError(errorMessage);
    }
  };

  const handleAddProject = async (formData: {
    projectName: string;
    projectCode: string;
    startDate: string;
    endDate: string;
    budget: number;
    projectDetail: string;
    isDeleted?: boolean;
  }) => {
    try {
      const formattedData = {
        ...formData,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
      };

      const response = await postData("/Project/create", formattedData);
      if (response?.success) {
        notifySuccess(response.message || "Project created successfully");
        setIsFormOpen(false);
        setFormMode("create");
        setSelectedProject(null);

        if (initialFetchDone.current) {
          if (isSearchMode && searchTerm) {
            await handleSearch();
          } else if (
            sortConfig.sortBy.length > 0 ||
            sortConfig.isActive === "true" ||
            sortConfig.isActive === "false"
          ) {
            await handleSortWithConfig(sortConfig);
          } else {
            await fetchProjects();
          }
        }
      } else {
        notifyError(response?.error?.[0] || "Failed to create project");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error?.[0] ||
        "An error occurred while creating the project";
      notifyError(errorMessage);
    }
  };

  const handleUpdateProject = async (formData: any) => {
    if (!selectedProject) return;

    try {
      const formattedData = {
        ...formData,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
      };

      const response = await putData(
        `/Project/${selectedProject.projectId}/without-staff`,
        formattedData
      );
      if (response?.success) {
        notifySuccess(response.message || "Project updated successfully");
        setIsFormOpen(false);
        setSelectedProject(null);

        if (initialFetchDone.current) {
          if (isSearchMode && searchTerm) {
            await handleSearch();
          } else if (
            sortConfig.sortBy.length > 0 ||
            sortConfig.isActive === "true" ||
            sortConfig.isActive === "false"
          ) {
            await handleSortWithConfig(sortConfig);
          } else {
            await fetchProjects();
          }
        }
      } else {
        notifyError(response?.error?.[0] || "Failed to update project");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error?.[0] ||
        "An error occurred while updating the project";
      notifyError(errorMessage);
    }
  };

  const handleImportExcel = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axiosInstance.post(
        "/Project/import-excel",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data?.success) {
        if (response.data.message) {
          notifySuccess(response.data.data);
          setWarningMessage(response.data.message);
          setIsWarningDialogOpen(true);
        } else {
          notifySuccess(response.data.data);
        }

        if (isSearchMode && searchTerm) {
          await handleSearch();
        } else if (
          sortConfig.sortBy.length > 0 ||
          sortConfig.isActive === "true" ||
          sortConfig.isActive === "false" ||
          sortConfig.isActive === ""
        ) {
          await handleSortWithConfig(sortConfig);
        } else {
          await fetchProjects();
        }
      } else {
        notifyError(response.data?.error?.[0] || "Failed to import projects");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error?.[0] || "Failed to import projects";
      notifyError(errorMessage);
    } finally {
      if (event.target) {
        event.target.value = "";
      }
    }
  };

  const handleExportExcel = async () => {
    try {
      const queryParams = new URLSearchParams();

      if (sortConfig.isActive === "true" || sortConfig.isActive === "false") {
        queryParams.append("isActive", sortConfig.isActive);
      }

      if (isSearchMode && searchTerm) {
        queryParams.append("searchBy", searchTerm);
      }

      const sortByString = sortConfig.sortBy
        .map((sort) => `${sort.field}:${sort.direction}`)
        .join(",");
      if (sortByString) {
        queryParams.append("sortBy", sortByString);
      }

      const response = await axiosInstance.get(
        `/Project/export-excel-filtered?${queryParams.toString()}`,
        {
          responseType: "blob",
        }
      );

      if (response.data) {
        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "FilteredProjects.xlsx";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        notifyError("Failed to export projects");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error?.[0] || "Failed to export projects";
      notifyError(errorMessage);
    }
  };

  const checkNextPage = async (pageNumber: number) => {
    try {
      const queryParams = new URLSearchParams({
        pageNumber: (pageNumber + 1).toString(),
        pageSize: itemsPerPage.toString(),
      });

      let url = "";
      if (isSearchMode && searchTerm) {
        if (filter === "true" || filter === "false") {
          queryParams.append("isActive", filter);
        }
        queryParams.append("projectName", searchTerm);
        url = `/Project/search?${queryParams.toString()}`;
      } else {
        queryParams.append("isActive", sortConfig.isActive || "");
        const sortByString = sortConfig.sortBy
          .map((sort) => `${sort.field}:${sort.direction}`)
          .join(",");
        queryParams.append("sortBy", sortByString);
        url = `/Project/sort?${queryParams.toString()}`;
      }

      const response = await fetcher(url);
      const hasData = Array.isArray(response.data) && response.data.length > 0;
      setHasNextPage(hasData);
    } catch (err) {
      setHasNextPage(false);
    }
  };

  const handleFilterClick = (value: string) => {
    const newFilterValue = filter === value ? "" : value;
    setFilter(newFilterValue);

    setSortConfig((prev) => ({
      ...prev,
      isActive: newFilterValue,
    }));

    setCurrentPage(1);

    handleSortWithConfig(
      {
        ...sortConfig,
        isActive: newFilterValue,
      },
      true
    );
  };

  const handleSearchWithPageSize = async (pageSize: number) => {
    setCurrentPage(1);
    try {
      setIsLoading(true);
      const queryParams = new URLSearchParams();

      if (filter === "true" || filter === "false") {
        queryParams.append("isActive", filter);
      }

      queryParams.append("projectName", searchTerm);
      queryParams.append("pageSize", pageSize.toString());
      queryParams.append("pageNumber", "1");

      const url = `/Project/search?${queryParams.toString()}`;
      const result = await fetcher(url);

      if (result.success && Array.isArray(result.data)) {
        setProjects(result.data);
        setError(null);
        await checkNextPageWithPageSize(1, pageSize);
      } else {
        notifyError(result?.error?.[0] || "Failed to search projects");
        setProjects([]);
        setHasNextPage(false);
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error?.[0] ||
        "An error occurred while searching projects";
      notifyError(errorMessage);
      setProjects([]);
      setHasNextPage(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSortWithConfigAndPageSize = async (
    config: typeof sortConfig,
    pageSize: number
  ) => {
    try {
      setIsSorting(true);
      const sortByString = config.sortBy
        .map((sort) => `${sort.field}:${sort.direction}`)
        .join(",");

      const queryParams = new URLSearchParams();
      queryParams.append("isActive", config.isActive || "");
      queryParams.append("sortBy", sortByString);
      queryParams.append("pageNumber", "1");
      queryParams.append("pageSize", pageSize.toString());

      const url = `/Project/sort?${queryParams.toString()}`;
      const result = await fetcher(url);

      if (result.success && Array.isArray(result.data)) {
        setProjects(result.data);
        setSortConfig(config);
        setError(null);
        await checkNextPageWithPageSize(1, pageSize);
      } else {
        setError(result?.error?.[0] || "Invalid response format from server");
        setProjects([]);
        setHasNextPage(false);
      }
    } catch (err) {
      setError("Có lỗi xảy ra khi sắp xếp dữ liệu. Vui lòng thử lại sau.");
      setProjects([]);
      setHasNextPage(false);
    } finally {
      setIsSorting(false);
    }
  };

  const checkNextPageWithPageSize = async (
    pageNumber: number,
    pageSize: number
  ) => {
    try {
      const queryParams = new URLSearchParams({
        pageNumber: (pageNumber + 1).toString(),
        pageSize: pageSize.toString(),
      });

      let url = "";
      if (isSearchMode && searchTerm) {
        if (filter === "true" || filter === "false") {
          queryParams.append("isActive", filter);
        }
        queryParams.append("projectName", searchTerm);
        url = `/Project/search?${queryParams.toString()}`;
      } else {
        queryParams.append("isActive", sortConfig.isActive || "");
        const sortByString = sortConfig.sortBy
          .map((sort) => `${sort.field}:${sort.direction}`)
          .join(",");
        queryParams.append("sortBy", sortByString);
        url = `/Project/sort?${queryParams.toString()}`;
      }

      const response = await fetcher(url);
      const hasData = Array.isArray(response.data) && response.data.length > 0;
      setHasNextPage(hasData);
    } catch (err) {
      setHasNextPage(false);
    }
  };

  return (
    <>
      <ToastNotification />
      <div className="top-0 sticky" style={{ zIndex: 999 }}>
        <TopLoadingBar />
      </div>

      <div className="flex">
        <HeaderAdmin />

        <main className="flex-1 p-6 pb-0 flex flex-col">
          <div className="container mx-auto flex flex-col h-full">
            {/* Header with title and action buttons */}
            <div className="flex flex-col gap-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h1 className="text-2xl font-bold">Projects</h1>
                  {/* Primary action button - Add Project - moved here for prominence */}
                  <Button
                    variant="default"
                    onClick={() => {
                      setFormMode("create");
                      setSelectedProject(null);
                      setIsFormOpen(true);
                    }}
                    className="flex items-center gap-2"
                  >
                    Add Project
                  </Button>
                </div>

                {/* Move import/export buttons near the title for better grouping */}
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    id="excel-import"
                    accept=".xlsx,.xls"
                    onChange={handleImportExcel}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    onClick={() =>
                      document.getElementById("excel-import")?.click()
                    }
                    className="flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Import
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleExportExcel}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                  <div className="flex items-center gap-2 ml-4">
                    <label
                      htmlFor="itemsPerPage"
                      className="text-sm font-medium"
                    >
                      Items:
                    </label>
                    <input
                      id="itemsPerPage"
                      type="number"
                      min="1"
                      max="50"
                      value={itemsPerPage}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (value > 0 && value <= 50) {
                          setItemsPerPage(value);
                          setCurrentPage(1);
                          if (isSearchMode && searchTerm) {
                            handleSearchWithPageSize(value);
                          } else {
                            handleSortWithConfigAndPageSize(sortConfig, value);
                          }
                        }
                      }}
                      className="w-16 px-2 py-1 border rounded-md text-center"
                    />
                  </div>
                </div>
              </div>

              {/* Search and filter row */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex-1 max-w-md">
                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        placeholder="Search project..."
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          setIsSearchMode(true);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            setCurrentPage(1);
                            handleSearch();
                          }
                        }}
                        className="px-4 py-2 border rounded-md w-full"
                      />
                      <Button
                        variant="default"
                        onClick={() => {
                          setCurrentPage(1);
                          handleSearch();
                        }}
                      >
                        Search
                      </Button>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Filter className="h-4 w-4" />
                        Filter
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuLabel>Status Filter</DropdownMenuLabel>
                      <DropdownMenuRadioGroup
                        value={filter}
                        onValueChange={(value) => handleFilterClick(value)}
                      >
                        <DropdownMenuRadioItem value="true">
                          Active Projects
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="false">
                          Inactive Projects
                        </DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>

                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={async () => {
                          try {
                            setIsLoading(true);
                            setSortConfig({
                              isActive: "",
                              sortBy: [],
                            });
                            setFilter("");
                            setSearchTerm("");
                            setIsSearchMode(false);
                            setCurrentPage(1);

                            const queryParams = new URLSearchParams({
                              pageNumber: "1",
                              pageSize: itemsPerPage.toString(),
                            });
                            queryParams.append("isActive", "");
                            queryParams.append("sortBy", "");

                            const url = `/Project/sort?${queryParams.toString()}`;
                            const response = await fetcher(url);

                            if (
                              response.success &&
                              Array.isArray(response.data)
                            ) {
                              setProjects(response.data);
                              setError(null);

                              const nextPageQueryParams = new URLSearchParams({
                                pageNumber: "2",
                                pageSize: itemsPerPage.toString(),
                              });
                              nextPageQueryParams.append("isActive", "");
                              nextPageQueryParams.append("sortBy", "");

                              const nextPageUrl = `/Project/sort?${nextPageQueryParams.toString()}`;
                              const nextPageResponse = await fetcher(
                                nextPageUrl
                              );

                              const hasNextPageData =
                                Array.isArray(nextPageResponse.data) &&
                                nextPageResponse.data.length > 0;
                              setHasNextPage(hasNextPageData);
                            } else {
                              setError("Invalid response format from server");
                            }
                          } catch (err) {
                            setError(
                              "Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau."
                            );
                          } finally {
                            setIsLoading(false);
                          }
                        }}
                      >
                        Reset Filter
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>

            {/* Table content - unchanged */}
            <div className="flex-grow">
              {isLoading || isSorting ? (
                <div className="flex items-center justify-center h-[400px]">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center h-[400px]">
                  <div className="text-red-500 text-center">
                    <p className="text-xl font-semibold mb-2">ERROR</p>
                    <p>{error}</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader className="sticky top-0">
                        <TableRow>
                          <TableHead className="w-[100px] text-center">
                            <Button
                              variant="ghost"
                              className="flex items-center justify-center gap-2 p-0 hover:bg-transparent w-full h-full"
                              onClick={() => handleColumnSort("ProjectId")}
                            >
                              Project ID
                              {getSortIcon("ProjectId")}
                            </Button>
                          </TableHead>
                          <TableHead className="w-[250px] text-center">
                            <Button
                              variant="ghost"
                              className="flex items-center justify-center gap-2 p-0 hover:bg-transparent w-full h-full"
                              onClick={() => handleColumnSort("ProjectName")}
                            >
                              Project Name
                              {getSortIcon("ProjectName")}
                            </Button>
                          </TableHead>
                          <TableHead className="w-[120px] text-center">
                            <Button
                              variant="ghost"
                              className="flex items-center justify-center gap-2 p-0 hover:bg-transparent w-full h-full"
                              onClick={() => handleColumnSort("ProjectCode")}
                            >
                              Project Code
                              {getSortIcon("ProjectCode")}
                            </Button>
                          </TableHead>
                          <TableHead className="w-[180px] text-center">
                            <Button
                              variant="ghost"
                              className="flex items-center justify-center gap-2 p-0 hover:bg-transparent w-full h-full"
                              onClick={() => handleColumnSort("ProjectManager")}
                            >
                              Project Manager
                              {getSortIcon("ProjectManager")}
                            </Button>
                          </TableHead>
                          <TableHead className="w-[120px] text-center">
                            <Button
                              variant="ghost"
                              className="flex items-center justify-center gap-2 p-0 hover:bg-transparent w-full h-full"
                              onClick={() => handleColumnSort("StartDate")}
                            >
                              Start Date
                              {getSortIcon("StartDate")}
                            </Button>
                          </TableHead>
                          <TableHead className="w-[120px] text-center">
                            <Button
                              variant="ghost"
                              className="flex items-center justify-center gap-2 p-0 hover:bg-transparent w-full h-full"
                              onClick={() => handleColumnSort("EndDate")}
                            >
                              End Date
                              {getSortIcon("EndDate")}
                            </Button>
                          </TableHead>
                          <TableHead className="w-[100px] text-center">
                            <Button
                              variant="ghost"
                              className="flex items-center justify-center gap-2 p-0 hover:bg-transparent w-full h-full"
                              onClick={() => handleColumnSort("isActive")}
                            >
                              Status
                              {getSortIcon("isActive")}
                            </Button>
                          </TableHead>
                          <TableHead className="w-[100px] text-center">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(currentProjects || []).map((project) => (
                          <TableRow key={project.projectId}>
                            <TableCell className="max-w-[100px] truncate text-center">
                              {project.projectId}
                            </TableCell>
                            <TableCell className="max-w-[250px] truncate font-medium">
                              <div
                                className="truncate"
                                title={project.projectName}
                              >
                                {project.projectName}
                              </div>
                            </TableCell>
                            <TableCell className="max-w-[120px] truncate text-center">
                              <div
                                className="truncate text-center"
                                title={project.projectCode}
                              >
                                {project.projectCode}
                              </div>
                            </TableCell>
                            <TableCell className="max-w-[180px] truncate text-center">
                              <div
                                className="truncate text-center"
                                title={project.managerName || "N/A"}
                              >
                                {project.managerName || "N/A"}
                              </div>
                            </TableCell>
                            <TableCell className="max-w-[120px] truncate text-center">
                              {new Date(project.startDate).toLocaleDateString(
                                "vi-VN"
                              )}
                            </TableCell>
                            <TableCell className="max-w-[120px] truncate text-center">
                              {new Date(project.endDate).toLocaleDateString(
                                "vi-VN"
                              )}
                            </TableCell>
                            <TableCell className="max-w-[100px] text-center">
                              <div className="flex justify-center">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                    project.isActive
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {project.isActive ? "Active" : "Inactive"}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      className="h-8 w-8 p-0"
                                    >
                                      <span className="sr-only">Open menu</span>
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent
                                    align="end"
                                    className="w-[150px] p-2"
                                  >
                                    <DropdownMenuLabel className="text-base py-2">
                                      Actions
                                    </DropdownMenuLabel>
                                    <DropdownMenuItem
                                      className="py-2 cursor-pointer"
                                      onClick={() => {
                                        setSelectedProject(project);
                                        setFormMode("edit");
                                        setIsFormOpen(true);
                                      }}
                                    >
                                      <Pencil className="mr-3 h-5 w-5" />
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      className="py-2 cursor-pointer"
                                      onClick={() =>
                                        handleDeleteProject(project.projectId)
                                      }
                                    >
                                      <Trash2 className="mr-3 h-5 w-5" />
                                      Delete
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="my-2" />
                                    <DropdownMenuItem className="py-2 cursor-pointer">
                                      <Link
                                        to={`/admin/projects/${project.projectId}`}
                                        className="flex items-center w-full"
                                      >
                                        <Folder className="mr-3 h-5 w-5" />
                                        View details
                                      </Link>
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                        {currentProjects.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center py-8">
                              <div className="flex flex-col items-center justify-center text-gray-500">
                                <p className="text-lg font-medium">
                                  No projects found
                                </p>
                                <p className="text-sm mt-1">
                                  {isSearchMode
                                    ? "Try adjusting your search criteria"
                                    : "Add a new project to get started"}
                                </p>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  {currentProjects.length > 0 && (
                    <div className="py-4">
                      <CustomPagination
                        page={currentPage}
                        hasNextPage={hasNextPage}
                        onPageChange={handlePageChange}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <ProjectFormDialog
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedProject(null);
          setFormMode("create");
        }}
        onSubmit={
          formMode === "create" ? handleAddProject : handleUpdateProject
        }
        initialData={selectedProject || undefined}
        mode={formMode}
      />

      <Dialog open={isWarningDialogOpen} onOpenChange={setIsWarningDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Import Warning</DialogTitle>
            <DialogDescription>
              Some rows were skipped during import due to errors.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-red-600 whitespace-pre-wrap">
              {warningMessage}
            </p>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsWarningDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProjectDashboard;
