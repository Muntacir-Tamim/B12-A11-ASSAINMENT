import { createBrowserRouter } from "react-router";
import MainLayout from "../layouts/MainLayout";
import ErrorPage from "../pages/ErrorPage";
import Home from "../pages/Home/Home";
import AllIssues from "../pages/AllIssues/AllIssues";
import PrivateRoute from "./PrivateRoute";
import IssueDetails from "../pages/IssueDetails/IssueDetails";
import HowItWorks from "../pages/HowItWorks/HowItWorks";
import About from "../pages/About/About";
import PaymentSuccess from "../pages/Payment/PaymentSuccess";
import Login from "../pages/Login/Login";
import SignUp from "../pages/SignUp/SignUp";
import DashboardLayout from "../layouts/DashboardLayout";
import Statistics from "../pages/Dashboard/Common/Statistics";
import Profile from "../pages/Dashboard/Common/Profile";
import CitizenRoute from "./CitizenRoute";
import ReportIssue from "../pages/Dashboard/Citizen/ReportIssue";
import MyIssues from "../pages/Dashboard/Citizen/MyIssues";
import StaffRoute from "./StaffRoute";
import AssignedIssues from "../pages/Dashboard/Staff/AssignedIssues";
import AdminRoute from "./AdminRoute";
import AdminAllIssues from "../pages/Dashboard/Admin/AdminAllIssues";
import ManageCitizens from "../pages/Dashboard/Admin/ManageCitizens";
import ManageStaff from "../pages/Dashboard/Admin/ManageStaff";
import AdminPayments from "../pages/Dashboard/Admin/AdminPayments";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/all-issues", element: <AllIssues /> },
      {
        path: "/issues/:id",
        element: (
          <PrivateRoute>
            <IssueDetails />
          </PrivateRoute>
        ),
      },
      { path: "/how-it-works", element: <HowItWorks /> },
      { path: "/about", element: <About /> },
      { path: "/payment-success", element: <PaymentSuccess /> },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <SignUp /> },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      // Common
      {
        index: true,
        element: (
          <PrivateRoute>
            <Statistics />
          </PrivateRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        ),
      },

      // Citizen
      {
        path: "report-issue",
        element: (
          <PrivateRoute>
            <CitizenRoute>
              <ReportIssue />
            </CitizenRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "my-issues",
        element: (
          <PrivateRoute>
            <CitizenRoute>
              <MyIssues />
            </CitizenRoute>
          </PrivateRoute>
        ),
      },

      // Staff
      {
        path: "assigned-issues",
        element: (
          <PrivateRoute>
            <StaffRoute>
              <AssignedIssues />
            </StaffRoute>
          </PrivateRoute>
        ),
      },

      // Admin
      {
        path: "all-issues",
        element: (
          <PrivateRoute>
            <AdminRoute>
              <AdminAllIssues />
            </AdminRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "manage-citizens",
        element: (
          <PrivateRoute>
            <AdminRoute>
              <ManageCitizens />
            </AdminRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "manage-staff",
        element: (
          <PrivateRoute>
            <AdminRoute>
              <ManageStaff />
            </AdminRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "payments",
        element: (
          <PrivateRoute>
            <AdminRoute>
              <AdminPayments />
            </AdminRoute>
          </PrivateRoute>
        ),
      },
    ],
  },
]);
