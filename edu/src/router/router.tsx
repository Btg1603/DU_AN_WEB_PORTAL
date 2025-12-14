import { createBrowserRouter, Navigate } from "react-router-dom";
import NaukriLogin from "../pages/Login";
import NaukriHomepage from "../pages/dashboard";
import NaukriProfilePage from "../pages/profile";
import NaukriCoursesPage from "../pages/allCourse";
import NaukriCourseDetail from "../pages/course";
import NaukriRegister from "../pages/register";
import AdminPage from "../pages/admin";
import ProtectedRoute from "../components/ProtectedRoute";
import QuizListPage from "../pages/quizList";
import QuizDetailPage from "../pages/quizDetail";
import QuizResultsPage from "../pages/quizResults";

export const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/login" replace /> }, // Redirect trang chủ
  { path: "/login", element: <NaukriLogin /> },
  { path: "register", element: <NaukriRegister /> },
  {
    path: "/homepage",
    element: (
      <ProtectedRoute>
        <NaukriHomepage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <NaukriProfilePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/coursepage",
    element: (
      <ProtectedRoute>
        <NaukriCoursesPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/coursedetail/:courseId",
    element: (
      <ProtectedRoute>
        <NaukriCourseDetail />
      </ProtectedRoute>
    ),
  },
  {
    path: "/quizzes",
    element: (
      <ProtectedRoute>
        <QuizListPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/quiz/:quizId",
    element: (
      <ProtectedRoute>
        <QuizDetailPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/quiz-results",
    element: (
      <ProtectedRoute>
        <QuizResultsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <AdminPage />
      </ProtectedRoute>
    ),
  },
  { path: "*", element: <Navigate to="/login" replace /> }, // 404 redirect
]);
