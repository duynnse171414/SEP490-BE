import { Button } from "@/components/ui/button";
import {
  BarChart,
  LayoutDashboard,
  Folder,
  Cog,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/features/auth/hooks/useAuthContext";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";

const HeaderAdmin = () => {
  const navigate = useNavigate();
  const { logout } = useAuthContext();
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="p-4 flex flex-col transition-all duration-300 hover:w-64 w-20 bg-background border-r">
        <div className="flex items-center gap-2 bg-accent/30 p-1 rounded-full mb-4">
          <Sun className="h-4 w-4 text-yellow-500" />
          <Switch
            checked={theme === "dark"}
            onCheckedChange={(checked: boolean) =>
              setTheme(checked ? "dark" : "light")
            }
            className="data-[state=checked]:bg-primary"
          />
          <Moon className="h-4 w-4 text-blue-500" />
        </div>
        <nav className="flex flex-col gap-4">
          <Button
            variant="ghost"
            className="flex gap-2 items-center justify-start hover:bg-accent"
            onClick={() => navigate("/admin/dashboard")}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="truncate">Dashboard</span>
          </Button>
          <Button
            variant="ghost"
            className="flex gap-2 items-center justify-start hover:bg-accent"
            onClick={() => navigate("/admin/staffs")}
          >
            <BarChart className="w-5 h-5" />
            <span className="truncate">Staff</span>
          </Button>
          <Button
            variant="ghost"
            className="flex gap-2 items-center justify-start hover:bg-accent"
            onClick={() => navigate("/admin/projects")}
          >
            <Folder className="w-5 h-5" />
            <span className="truncate">Projects</span>
          </Button>
          <Button
            variant="ghost"
            className="flex gap-2 items-center justify-start hover:bg-accent"
            onClick={() => navigate("/admin/settings")}
          >
            <Cog className="w-5 h-5" />
            <span className="truncate">Settings</span>
          </Button>
          <Button
            variant="ghost"
            className="flex gap-2 items-center justify-start hover:bg-accent"
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
