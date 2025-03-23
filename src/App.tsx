import React, { useEffect, useState } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { Toaster } from "@/components/ui/toaster"
import { useAuth } from "@/hooks/useAuth";

import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import PasswordRecovery from "@/pages/PasswordRecovery";
import VerifyEmail from "@/pages/VerifyEmail";
import AppLayout from "@/layouts/AppLayout";
import Dashboard from "@/pages/Dashboard";
import EmployeeDirectory from "@/pages/employee/EmployeeDirectory";
import EmployeeProfile from "@/pages/employee/EmployeeProfile";
import Clients from "@/pages/Clients";
import ClientDashboard from "@/pages/client/Dashboard";
import ClientTasks from "@/pages/client/Tasks";
import TaskDetail from "@/pages/tasks/TaskDetail";
import Reports from "@/pages/Reports";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";
import MarketingDashboard from "@/pages/marketing/MarketingDashboard";
import Campaigns from "@/pages/marketing/Campaigns";
import EmailTemplates from "@/pages/marketing/EmailTemplates";
import Analytics from "@/pages/marketing/Analytics";
import FinancialDashboard from "@/pages/finance/FinancialDashboard";
import Invoices from "@/pages/finance/Invoices";
import Expenses from "@/pages/finance/Expenses";
import Budgets from "@/pages/finance/Budgets";
import HRDashboard from "@/pages/hr/HRDashboard";
import EmployeeManagement from "@/pages/hr/EmployeeManagement";
import Recruitment from "@/pages/hr/Recruitment";
import PerformanceReviews from "@/pages/hr/PerformanceReviews";
import BrandsDashboard from "./pages/client/BrandsDashboard";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn, loading } = useAuth();
  const [render, setRender] = useState(false);

  useEffect(() => {
    setRender(true);
  }, []);

  if (loading || !render) {
    return <div>Loading...</div>;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/password-recovery",
    element: <PasswordRecovery />,
  },
  {
    path: "/verify-email",
    element: <VerifyEmail />,
  },
  {
    path: "/app",
    element: <ProtectedRoute><AppLayout /></ProtectedRoute>,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "employees",
        element: <EmployeeDirectory />,
      },
      {
        path: "employees/:employeeId",
        element: <EmployeeProfile />,
      },
      {
        path: "clients",
        element: <Clients />,
      },
      {
        path: "client/dashboard",
        element: <ClientDashboard />,
      },
      {
        path: "client/brands",
        element: <BrandsDashboard />,
      },
      {
        path: "client/tasks",
        element: <ClientTasks />,
      },
      {
        path: "client/tasks/:taskId",
        element: <TaskDetail />,
      },
      {
        path: "client/reports",
        element: <Reports />,
      },
      {
        path: "marketing/dashboard",
        element: <MarketingDashboard />,
      },
      {
        path: "marketing/campaigns",
        element: <Campaigns />,
      },
      {
        path: "marketing/email-templates",
        element: <EmailTemplates />,
      },
      {
        path: "marketing/analytics",
        element: <Analytics />,
      },
      {
        path: "finance/dashboard",
        element: <FinancialDashboard />,
      },
      {
        path: "finance/invoices",
        element: <Invoices />,
      },
      {
        path: "finance/expenses",
        element: <Expenses />,
      },
      {
        path: "finance/budgets",
        element: <Budgets />,
      },
      {
        path: "hr/dashboard",
        element: <HRDashboard />,
      },
      {
        path: "hr/employee-management",
        element: <EmployeeManagement />,
      },
      {
        path: "hr/recruitment",
        element: <Recruitment />,
      },
      {
        path: "hr/performance-reviews",
        element: <PerformanceReviews />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  )
}

export default App
