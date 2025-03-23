import { RoleGuard } from "@/guards/roleGuard";
import HeaderAdmin from "@/sections/HeaderAdmin";
import TopLoadingBar from "@/components/common/TopLoadingBar";

const DashboardPage = () => {
    return (
        <RoleGuard>
            <HeaderAdmin />
            <TopLoadingBar />
        </RoleGuard>
    );
};

export default DashboardPage;