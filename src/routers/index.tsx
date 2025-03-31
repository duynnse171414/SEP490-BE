import { Suspense, lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import SplashScreen from "@/sections/SplashScreen";
import { AdminLayout } from "@/layouts/AdminLayout";

// Lazy-loaded pages
const HomePage = lazy(() => import("../pages/HomePage"));
const PostsPage = lazy(() => import("../pages/post/PostsPage"));
const PostPage = lazy(() => import("../pages/post/PostPage"));
const CommentsPage = lazy(() => import("../pages/comment/CommentsPage"));
const AlbumsPage = lazy(() => import("../pages/album/AlbumsPage"));
const PhotosPage = lazy(() => import("../pages/photo/PhotosPage"));
const TodosPage = lazy(() => import("../pages/todo/TodosPage"));
const UsersPage = lazy(() => import("../pages/user/UsersPage"));
const UserDetailPage = lazy(() => import("../pages/user/UserDetailPage"));
const AboutPage = lazy(() => import("../pages/about/AboutPage"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));
const DashboardPage = lazy(() => import("../pages/dashboard/dashboardPage"));
const ReportPage = lazy(() => import("../pages/report/report"));
const StaffPage = lazy(() => import("../pages/admin/StaffPage"));

// Import Project Pages
const ProjectPage = lazy(() => import("../pages/project/ProjectPage"));
const ProjectDetailPage = lazy(() => import("../pages/project/ProjectDetail"));
const DashboardAdmin = lazy(() => import("../pages/dashboard/dashboardAdmin"));
const ProjectDashboard = lazy(() => import("../features/dashboard/components/ProjectDashboard"));
const ClaimsPage = lazy(() => import("../pages/claims/ClaimsPage"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "posts", element: <PostsPage /> },
      { path: "posts/:id", element: <PostPage /> },
      { path: "comments", element: <CommentsPage /> },
      { path: "albums", element: <AlbumsPage /> },
      { path: "photos", element: <PhotosPage /> },
      { path: "users", element: <UsersPage /> },
      { path: "users/:id", element: <UserDetailPage /> },
      { path: "about", element: <AboutPage /> },
      { path: "dashboard", element: <DashboardPage /> },
      { path: "report", element: <ReportPage /> },
      { path: "todos", element: <TodosPage /> },
      // { path: "projects", element: <ProjectPage /> }, // Add Project List Page
      { path: "projects", element: <ProjectDashboard /> },
      { path: "claims", element: <ClaimsPage /> },
    ],
  },
  {
    path: "admin/",
    element: <AdminLayout />,
    children: [
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
