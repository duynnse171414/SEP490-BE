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
const CreateClaimPage = lazy(() => import("../pages/claim/CreateClaimPage"));
const DashboardAdmin = lazy(() => import("../pages/dashboard/dashboardAdmin"));
const ProjectDashboard = lazy(() => import("../features/dashboard/components/ProjectDashboard"));
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
      { path: "dashboard", element: <DashboardAdmin /> },
      { path: "projects", element: <ProjectDashboard /> },
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
