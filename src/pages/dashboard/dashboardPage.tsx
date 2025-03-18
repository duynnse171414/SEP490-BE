import { Button } from "@/components/ui/button";
import { BarChart, LayoutDashboard, Settings } from "lucide-react";
import TotalBar from "@/sections/TotalBar";
import { RoleGuard } from "@/guards/roleGuard";

const DashboardPage = () => {
    return (
        <RoleGuard>
            <div className="flex h-screen">
                {/* Sidebar */}
                <aside className="w-64 p-4 flex flex-col">
                    <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
                    <nav className="flex flex-col gap-4">
                        <Button variant="ghost" className="flex gap-2 items-center">
                            <LayoutDashboard className="w-5 h-5" /> Dashboard
                        </Button>
                        <Button variant="ghost" className="flex gap-2 items-center">
                            <BarChart className="w-5 h-5" /> Analytics
                        </Button>
                        <Button variant="ghost" className="flex gap-2 items-center">
                            <Settings className="w-5 h-5" /> Settings
                        </Button>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-bold">Welcome Back!</h2>
                        <Button>New Report</Button>
                    </div>

                    <TotalBar />
                </main>
            </div>
        </RoleGuard>
    );
};

export default DashboardPage;