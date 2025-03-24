import { Button } from "@/components/ui/button";
import { FolderOpen, Eye, MoreHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { fetcher } from "@/api/fetchers";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
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
} from "@/components/ui/dropdown-menu";
import TopLoadingBar from "@/components/common/TopLoadingBar";
import { GetAllProjectDTO } from "../type";
import HeaderAdmin from "@/sections/HeaderAdmin";
import CustomPagination from "@/components/common/CustomPagination";

const ITEMS_PER_PAGE = 7;

const ProjectDashboard = () => {
  const [projects, setProjects] = useState<GetAllProjectDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const totalPages = Math.ceil(projects.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProjects = projects.slice(startIndex, endIndex);
  const hasNextPage = currentPage < totalPages;

  useEffect(() => {
    const token = localStorage.getItem("loggedUser")
      ? JSON.parse(localStorage.getItem("loggedUser")!).token
      : null;

    if (!token) {
      navigate("/login");
      return;
    }

    const decodedToken: any = jwtDecode(token);
    const userRole = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

    if (userRole !== "admin") {
      navigate("/unauthorized");
      return;
    }

    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const response = await fetcher("/Project");
        console.log("Fetched projects:", response);
        setProjects(response);
        setError(null);
      } catch (err) {
        setError("Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.");
        console.error("Error fetching projects:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [navigate]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <div className="top-0 sticky" style={{ zIndex: 999 }}>
        <TopLoadingBar />
      </div>

      <div className="flex h-screen">
        <HeaderAdmin />
        
        <main className="flex-1 p-6">
          <div className="container mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Projects</h1>
              <Button variant="default">Add Project</Button>
            </div>
            
            {isLoading ? (
              <div className="flex items-center justify-center h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-[400px]">
                <div className="text-red-500 text-center">
                  <p className="text-xl font-semibold mb-2">Lỗi</p>
                  <p>{error}</p>
                </div>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project Name</TableHead>
                      <TableHead>Project Code</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentProjects.map((project) => (
                      <TableRow key={project.projectId}>
                        <TableCell className="font-medium">{project.projectName}</TableCell>
                        <TableCell>{project.projectCode}</TableCell>
                        <TableCell>{new Date(project.startDate).toLocaleDateString('vi-VN')}</TableCell>
                        <TableCell>{new Date(project.endDate).toLocaleDateString('vi-VN')}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => navigator.clipboard.writeText(project.projectId.toString())}
                              >
                                Copy project ID
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                View details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <FolderOpen className="mr-2 h-4 w-4" />
                                Open project
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {totalPages > 1 && (
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
        </main>
      </div>
    </>
  );
};

export default ProjectDashboard;