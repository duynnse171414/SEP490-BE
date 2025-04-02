import { Suspense, lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import SplashScreen from "@/sections/SplashScreen";
import { AdminLayout } from "@/layouts/AdminLayout";

// Lazy-loaded pages
const HomePage = lazy(() => import("../pages/HomePage"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));
const DashboardPage = lazy(() => import("../pages/dashboard/dashboardPage"));
const ReportPage = lazy(() => import("../pages/report/report"));
const StaffPage = lazy(() => import("../pages/admin/StaffPage"));

// Import Project Pages
const ProjectPage = lazy(() => import("../pages/project/ProjectPage"));
const ProjectDetailPage = lazy(() => import("../pages/project/ProjectDetail"));
const CreateClaimPage = lazy(() => import("../pages/claim/CreateClaimPage"));
const DashboardAdmin = lazy(() => import("../pages/dashboard/dashboardAdmin"));
const ProjectDashboard = lazy(
  () => import("../features/dashboard/components/ProjectDashboard")
);
const ClaimsPage = lazy(() => import("../pages/claims/ClaimsPage"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "dashboard", element: <DashboardPage /> },
      { path: "report", element: <ReportPage /> },
      { path: "create-claim", element: <CreateClaimPage /> },
      { path: "projects", element: <ProjectDashboard /> },
      { path: "approve-claims", element: <ClaimsPage /> },
    ],
  },
  {
    path: "admin/",
    element: <AdminLayout />,
    children: [
      { index: true, element: <DashboardAdmin /> },
      { path: "dashboard", element: <DashboardAdmin /> },
      { path: "projects", element: <ProjectDashboard /> },
      { path: "staffs", element: <StaffPage /> },
      { path: "projects/:id", element: <ProjectDetailPage /> }, // Add Project Detail Page
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export const AppRouter = () => (
  <Suspense fallback={<SplashScreen />}>
    <RouterProvider router={router} />
  </Suspense>
);

export default AppRouter;
