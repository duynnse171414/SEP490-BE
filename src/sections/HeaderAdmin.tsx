import { Button } from "@/components/ui/button";
import { BarChart, LayoutDashboard, Folder, Cog, LogOut } from "lucide-react"; 
import { RoleGuard } from "@/guards/roleGuard";
import { useNavigate } from "react-router-dom";

const HeaderAdmin = () => {
  const navigate = useNavigate(); 

  return (
    <RoleGuard>
      <div className="flex h-screen">
        {/* Sidebar */}
        <aside className="w-64 p-4 flex flex-col">
          <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
          <nav className="flex flex-col gap-4">
            <Button variant="ghost" className="flex gap-2 items-center" onClick={() => navigate("/admin/dashboard")}>
              <LayoutDashboard className="w-5 h-5" /> Dashboard
            </Button>
            <Button variant="ghost" className="flex gap-2 items-center" onClick={() => navigate("/admin/analytics")}>
              <BarChart className="w-5 h-5" /> Analytics
            </Button>
            <Button variant="ghost" className="flex gap-2 items-center" onClick={() => navigate("/admin/projects")}>
              <Folder className="w-5 h-5" /> Projects
            </Button>
            <Button variant="ghost" className="flex gap-2 items-center" onClick={() => navigate("/admin/settings")}>
              <Cog className="w-5 h-5" /> Settings
            </Button>
            <Button variant="ghost" className="flex gap-2 items-center" onClick={() => navigate("/admin/logout")}>
              <LogOut className="w-5 h-5" /> Logout
            </Button>
          </nav>
        </aside>
      </div>
    </RoleGuard>
  );
};

export default HeaderAdmin;