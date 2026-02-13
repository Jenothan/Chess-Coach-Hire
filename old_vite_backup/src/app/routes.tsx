import { createBrowserRouter } from "react-router";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { CoachDashboard } from "./pages/coach/CoachDashboard";
import { StudentDashboard } from "./pages/student/StudentDashboard";
import { CoachListingPage } from "./pages/student/CoachListingPage";
import { CoachProfilePage } from "./pages/student/CoachProfilePage";
import { BookingPage } from "./pages/student/BookingPage";
import { PaymentPage } from "./pages/student/PaymentPage";
import { NotificationsPage } from "./pages/NotificationsPage";
import { HelpPage } from "./pages/HelpPage";
import { Layout } from "./components/Layout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/admin",
    element: <Layout role="admin" />,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "notifications", element: <NotificationsPage /> },
      { path: "help", element: <HelpPage /> },
    ],
  },
  {
    path: "/coach",
    element: <Layout role="coach" />,
    children: [
      { index: true, element: <CoachDashboard /> },
      { path: "notifications", element: <NotificationsPage /> },
      { path: "help", element: <HelpPage /> },
    ],
  },
  {
    path: "/student",
    element: <Layout role="student" />,
    children: [
      { index: true, element: <StudentDashboard /> },
      { path: "coaches", element: <CoachListingPage /> },
      { path: "coaches/:id", element: <CoachProfilePage /> },
      { path: "booking/:coachId", element: <BookingPage /> },
      { path: "payment", element: <PaymentPage /> },
      { path: "notifications", element: <NotificationsPage /> },
      { path: "help", element: <HelpPage /> },
    ],
  },
]);
