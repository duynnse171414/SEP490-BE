import { Outlet } from "react-router-dom";
import AuthProvider from "@/features/auth/contexts/AuthProvider";
import { Footer } from "@/sections/Footer";
import { RoleGuard } from "@/guards/roleGuard";

export const AdminLayout = () => {
  return (
    <AuthProvider>
      <RoleGuard role="admin">
        <main className="relative">
          <Outlet />
        </main>
        <footer>
          <Footer />
        </footer>
      </RoleGuard>
    </AuthProvider>
  );
};
