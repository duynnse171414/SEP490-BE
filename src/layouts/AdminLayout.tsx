import { Outlet } from "react-router-dom";
import AuthProvider from "@/features/auth/contexts/AuthProvider";
import { Footer } from "@/sections/Footer";

export const AdminLayout = () => {
    return (
        <AuthProvider>
            <main className="relative">
                <Outlet />
            </main>
            <footer>
                <Footer />
            </footer>
        </AuthProvider>
    );
};
