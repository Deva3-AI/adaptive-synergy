
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Authentication Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PasswordRecovery from "./pages/PasswordRecovery";
import VerifyEmail from "./pages/VerifyEmail";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

// Layout
import AppLayout from "./components/layout/AppLayout";

// Dashboard Pages
import Dashboard from "./pages/Dashboard";

// Employee Module
import EmployeeDashboard from "./pages/employee/Dashboard";
import EmployeeTasks from "./pages/employee/Tasks";
import EmployeeTaskDetail from "./pages/employee/TaskDetail";

// Client Module
import ClientDashboard from "./pages/client/Dashboard";
import ClientTasks from "./pages/client/Tasks";
import ClientTaskDetail from "./pages/client/TaskDetail";
import ClientReports from "./pages/client/Reports";

// Marketing Module
import MarketingDashboard from "./pages/marketing/Dashboard";
import MarketingCampaigns from "./pages/marketing/Campaigns";
import MarketingMeetings from "./pages/marketing/Meetings";
import MarketingAnalytics from "./pages/marketing/Analytics";

// HR Module
import HrDashboard from "./pages/hr/Dashboard";
import HrAttendance from "./pages/hr/Attendance";
import HrRecruitment from "./pages/hr/Recruitment";
import HrPayroll from "./pages/hr/Payroll";
import HrReports from "./pages/hr/Reports";

// Finance Module
import FinanceDashboard from "./pages/finance/Dashboard";
import FinanceInvoices from "./pages/finance/Invoices";
import FinanceCostAnalysis from "./pages/finance/CostAnalysis";
import FinancePerformance from "./pages/finance/Performance";
import FinanceReports from "./pages/finance/Reports";

// Not Found
import NotFound from "./pages/NotFound";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

// Protected Route Component with proper TypeScript
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/password-recovery" element={<PasswordRecovery />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            
            {/* Protected routes */}
            <Route element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }>
              {/* Main Dashboard */}
              <Route path="/dashboard" element={<Dashboard />} />
              
              {/* User Settings */}
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              
              {/* Employee Module */}
              <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
              <Route path="/employee/tasks" element={<EmployeeTasks />} />
              <Route path="/employee/tasks/:taskId" element={<EmployeeTaskDetail />} />
              
              {/* Client Module */}
              <Route path="/client/dashboard" element={<ClientDashboard />} />
              <Route path="/client/tasks" element={<ClientTasks />} />
              <Route path="/client/tasks/:taskId" element={<ClientTaskDetail />} />
              <Route path="/client/reports" element={<ClientReports />} />
              
              {/* Marketing Module */}
              <Route path="/marketing/dashboard" element={<MarketingDashboard />} />
              <Route path="/marketing/campaigns" element={<MarketingCampaigns />} />
              <Route path="/marketing/meetings" element={<MarketingMeetings />} />
              <Route path="/marketing/analytics" element={<MarketingAnalytics />} />
              
              {/* HR Module */}
              <Route path="/hr/dashboard" element={<HrDashboard />} />
              <Route path="/hr/attendance" element={<HrAttendance />} />
              <Route path="/hr/recruitment" element={<HrRecruitment />} />
              <Route path="/hr/payroll" element={<HrPayroll />} />
              <Route path="/hr/reports" element={<HrReports />} />
              
              {/* Finance Module */}
              <Route path="/finance/dashboard" element={<FinanceDashboard />} />
              <Route path="/finance/invoices" element={<FinanceInvoices />} />
              <Route path="/finance/cost-analysis" element={<FinanceCostAnalysis />} />
              <Route path="/finance/performance" element={<FinancePerformance />} />
              <Route path="/finance/reports" element={<FinanceReports />} />
            </Route>
            
            {/* Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
