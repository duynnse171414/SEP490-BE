import { Button } from "@/components/ui/button";
import { BarChart, LayoutDashboard, Folder, Cog, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/features/auth/hooks/useAuthContext";

const HeaderAdmin = () => {
  const navigate = useNavigate();
  const { logout } = useAuthContext();

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside
        className={`p-4 flex flex-col transition-all duration-300 hover:w-64 w-20`}
      >
        {/* <h1 className="text-2xl font-bold mb-6 truncate">Dashboard</h1> */}
        <nav className="flex flex-col gap-4">
          <Button
            variant="ghost"
            className="flex gap-2 items-center justify-start"
            onClick={() => navigate("/admin/dashboard")}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="truncate">Dashboard</span>
          </Button>
          <Button
            variant="ghost"
            className="flex gap-2 items-center justify-start"
            onClick={() => navigate("/admin/staffs")}
          >
            <BarChart className="w-5 h-5" />
            <span className="truncate">Staff</span>
          </Button>
          <Button
            variant="ghost"
            className="flex gap-2 items-center justify-start"
            onClick={() => navigate("/admin/projects")}
          >
            <Folder className="w-5 h-5" />
            <span className="truncate">Projects</span>
          </Button>
          <Button
            variant="ghost"
            className="flex gap-2 items-center justify-start"
            onClick={() => navigate("/admin/settings")}
          >
            <Cog className="w-5 h-5" />
            <span className="truncate">Settings</span>
          </Button>
          <Button
            variant="ghost"
            className="flex gap-2 items-center justify-start"
            onClick={logout}
          >
            <LogOut className="w-5 h-5" />
            <span className="truncate">Logout</span>
          </Button>
        </nav>
      </aside>
    </div>
  );
};

export default HeaderAdmin;
