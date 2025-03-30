
import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";

import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import PasswordRecovery from "@/pages/PasswordRecovery";
import VerifyEmail from "@/pages/VerifyEmail";
import AppLayout from "@/components/layout/AppLayout";
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
import MarketingDashboard from "@/pages/marketing/Dashboard";
import Campaigns from "@/pages/marketing/Campaigns";
import EmailTemplates from "@/pages/marketing/EmailTemplates";
import Meetings from "@/pages/marketing/Meetings";
import Analytics from "@/pages/marketing/Analytics";
import FinancialDashboard from "@/pages/finance/FinancialDashboard";
import Invoices from "@/pages/finance/Invoices";
import Expenses from "@/pages/finance/Expenses";
import Budgets from "@/pages/finance/Budgets";
import FinanceReports from "@/pages/finance/Reports";
import FinancePerformance from "@/pages/finance/Performance";
import HRDashboard from "@/pages/hr/HRDashboard";
import EmployeeManagement from "@/pages/hr/EmployeeManagement";
import Recruitment from "@/pages/hr/Recruitment";
import PerformanceReviews from "@/pages/hr/PerformanceReviews";
import HRReports from "@/pages/hr/Reports";
import BrandsDashboard from "./pages/client/BrandsDashboard";
import SalesDashboard from "./pages/finance/SalesDashboard";
import EmployeeDashboard from "./pages/employee/Dashboard";
import { AuthProvider } from "./hooks/use-auth";
import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/password-recovery" element={<PasswordRecovery />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          
          <Route path="/app" element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="employees" element={<EmployeeDirectory />} />
            <Route path="employees/:employeeId" element={<EmployeeProfile />} />
            <Route path="clients" element={<Clients />} />
            <Route path="client/dashboard" element={<ClientDashboard />} />
            <Route path="client/brands" element={<BrandsDashboard />} />
            <Route path="client/tasks" element={<ClientTasks />} />
            <Route path="client/tasks/:taskId" element={<TaskDetail />} />
            <Route path="client/reports" element={<Reports />} />
            <Route path="employee/dashboard" element={<EmployeeDashboard />} />
            <Route path="marketing/dashboard" element={<MarketingDashboard />} />
            <Route path="marketing/campaigns" element={<Campaigns />} />
            <Route path="marketing/email-templates" element={<EmailTemplates />} />
            <Route path="marketing/meetings" element={<Meetings />} />
            <Route path="marketing/analytics" element={<Analytics />} />
            <Route path="finance/dashboard" element={<FinancialDashboard />} />
            <Route path="finance/invoices" element={<Invoices />} />
            <Route path="finance/expenses" element={<Expenses />} />
            <Route path="finance/budgets" element={<Budgets />} />
            <Route path="finance/reports" element={<FinanceReports />} />
            <Route path="finance/performance" element={<FinancePerformance />} />
            <Route path="finance/sales" element={<SalesDashboard />} />
            <Route path="hr/dashboard" element={<HRDashboard />} />
            <Route path="hr/employee-management" element={<EmployeeManagement />} />
            <Route path="hr/recruitment" element={<Recruitment />} />
            <Route path="hr/performance-reviews" element={<PerformanceReviews />} />
            <Route path="hr/reports" element={<HRReports />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
