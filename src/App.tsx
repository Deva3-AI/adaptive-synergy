
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/theme-provider';
import RootLayout from '@/components/layouts/RootLayout';
import AuthLayout from '@/components/layouts/AuthLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Dashboard from '@/pages/Dashboard';
import Login from '@/pages/auth/Login';
import Signup from '@/pages/auth/Signup';
import VerifyEmail from '@/pages/auth/VerifyEmail';
import ResetPassword from '@/pages/auth/ResetPassword';
import NotFound from '@/pages/NotFound';
import EmployeeDashboard from '@/pages/employee/Dashboard';
import EmployeeProfile from '@/pages/employee/Profile';
import Tasks from '@/pages/employee/Tasks';
import TaskDetail from '@/pages/employee/TaskDetail';
import HRDashboard from '@/pages/hr/HRDashboard';
import Attendance from '@/pages/hr/Attendance';
import Recruitment from '@/pages/hr/Recruitment';
import LeaveManagement from '@/pages/hr/LeaveManagement';
import Payroll from '@/pages/hr/Payroll';
import FinancialDashboard from '@/pages/finance/FinancialDashboard';
import Invoices from '@/pages/finance/Invoices';
import Expenses from '@/pages/finance/Expenses';
import SalesDashboard from '@/pages/finance/SalesDashboard';
import Reports from '@/pages/finance/Reports';
import Performance from '@/pages/finance/Performance';
import MarketingDashboard from '@/pages/marketing/Dashboard';
import Campaigns from '@/pages/marketing/Campaigns';
import Leads from '@/pages/marketing/Leads';
import Analytics from '@/pages/marketing/Analytics';
import Meetings from '@/pages/marketing/Meetings';
import OutreachPlans from '@/pages/marketing/OutreachPlans';
import ClientDashboard from '@/pages/client/Dashboard';
import BrandsDashboard from '@/pages/client/BrandsDashboard';
import ClientTasks from '@/pages/client/Tasks';
import ClientReports from '@/pages/client/Reports';
import Settings from '@/pages/Settings';
import { AuthProvider } from '@/hooks/use-auth';

// Create a query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="ui-theme">
        <AuthProvider>
          <Router>
            <Routes>
              {/* Auth routes */}
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route path="/reset-password" element={<ResetPassword />} />
              </Route>
              
              {/* Protected routes */}
              <Route element={<ProtectedRoute><RootLayout /></ProtectedRoute>}>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                
                {/* Employee routes */}
                <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
                <Route path="/employee/profile" element={<EmployeeProfile />} />
                <Route path="/employee/tasks" element={<Tasks />} />
                <Route path="/employee/tasks/:taskId" element={<TaskDetail />} />
                
                {/* HR routes */}
                <Route path="/hr/dashboard" element={<HRDashboard />} />
                <Route path="/hr/attendance" element={<Attendance />} />
                <Route path="/hr/leave-management" element={<LeaveManagement />} />
                <Route path="/hr/recruitment" element={<Recruitment />} />
                <Route path="/hr/payroll" element={<Payroll />} />
                
                {/* Finance routes */}
                <Route path="/finance/dashboard" element={<FinancialDashboard />} />
                <Route path="/finance/invoices" element={<Invoices />} />
                <Route path="/finance/expenses" element={<Expenses />} />
                <Route path="/finance/sales" element={<SalesDashboard />} />
                <Route path="/finance/reports" element={<Reports />} />
                <Route path="/finance/performance" element={<Performance />} />
                
                {/* Marketing routes */}
                <Route path="/marketing/dashboard" element={<MarketingDashboard />} />
                <Route path="/marketing/campaigns" element={<Campaigns />} />
                <Route path="/marketing/leads" element={<Leads />} />
                <Route path="/marketing/analytics" element={<Analytics />} />
                <Route path="/marketing/meetings" element={<Meetings />} />
                <Route path="/marketing/plans" element={<OutreachPlans />} />
                
                {/* Client routes */}
                <Route path="/client/dashboard" element={<ClientDashboard />} />
                <Route path="/client/brands" element={<BrandsDashboard />} />
                <Route path="/client/tasks" element={<ClientTasks />} />
                <Route path="/client/reports" element={<ClientReports />} />
                
                {/* Settings */}
                <Route path="/settings" element={<Settings />} />
              </Route>
              
              {/* Catch all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </AuthProvider>
        <Toaster position="top-right" richColors />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
