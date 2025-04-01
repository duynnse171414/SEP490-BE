import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "@/sections/Header";
import TopLoadingBar from "@/components/common/TopLoadingBar";
import { Footer } from "@/sections/Footer";
import AuthProvider from "@/features/auth/contexts/AuthProvider";

export const MainLayout = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleDrawerStateChange = (open: boolean) => {
    setIsDrawerOpen(open);
  };

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <header className="relative top-0 sticky z-50">
          <Header onDrawerStateChange={handleDrawerStateChange} />
        </header>
        <main className="relative flex-grow">
          <div
            className={`transition-transform duration-300 ${isDrawerOpen ? "scale-90 opacity-75" : "scale-100 opacity-100"}`}
          >
            <Outlet />
          </div>
          <div className="top-0 sticky" style={{ zIndex: 999 }}>
            <TopLoadingBar />
          </div>
        </main>
        <footer>
          <Footer />
        </footer>
      </div>
    </AuthProvider>
  );
};
