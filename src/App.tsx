
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Toaster } from 'sonner';

// Import pages
import Index from './pages/Index';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import PasswordRecovery from './pages/auth/PasswordRecovery';
import VerifyEmail from './pages/auth/VerifyEmail';
import Dashboard from './pages/Dashboard';
import EmployeeDashboard from './pages/employee/Dashboard';
import EmployeeTasks from './pages/employee/Tasks';
import EmployeeTaskDetail from './pages/employee/TaskDetail';
import EmployeeDirectory from './pages/employee/Directory';
import EmployeeProfile from './pages/employee/Profile';
import ClientDashboard from './pages/client/Dashboard';
import ClientTasks from './pages/client/Tasks';
import ClientTaskDetail from './pages/client/TaskDetail';
import BrandsDashboard from './pages/client/BrandsDashboard';
import ClientReports from './pages/client/Reports';
import NotFound from './pages/NotFound';

// HR Pages
import HRDashboard from './pages/hr/Dashboard';
import HRAttendance from './pages/hr/Attendance';
import HRRecruitment from './pages/hr/Recruitment';
import HRPayroll from './pages/hr/Payroll';
import HRReports from './pages/hr/Reports';

// Finance Pages
import FinanceDashboard from './pages/finance/Dashboard';
import FinancialDashboard from './pages/finance/FinancialDashboard';
import Invoices from './pages/finance/Invoices';
import CostAnalysis from './pages/finance/CostAnalysis';
import Performance from './pages/finance/Performance';
import Reports from './pages/finance/Reports';
import Budgets from './pages/finance/Budgets';

// Marketing Pages
import MarketingDashboard from './pages/marketing/Dashboard';
import MarketingCampaigns from './pages/marketing/Campaigns';
import MarketingMeetings from './pages/marketing/Meetings';
import MarketingAnalytics from './pages/marketing/Analytics';

// Lazy load the ClientRequirements page
const ClientRequirements = React.lazy(() => import('./pages/ai/ClientRequirements'));

// Define a ProtectedRoute component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a more sophisticated loading indicator
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Toaster />
      <Routes>
        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/password-recovery" element={<PasswordRecovery />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        
        {/* Public routes */}
        <Route path="/" element={<Index />} />
        
        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        
        {/* New AI Client Requirements route */}
        <Route
          path="/ai/client-requirements"
          element={
            <ProtectedRoute>
              <React.Suspense fallback={<div>Loading...</div>}>
                <ClientRequirements />
              </React.Suspense>
            </ProtectedRoute>
          }
        />
        
        {/* Employee routes */}
        <Route
          path="/employee/dashboard"
          element={
            <ProtectedRoute>
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/tasks"
          element={
            <ProtectedRoute>
              <EmployeeTasks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/tasks/:taskId"
          element={
            <ProtectedRoute>
              <EmployeeTaskDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/directory"
          element={
            <ProtectedRoute>
              <EmployeeDirectory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/profile/:userId"
          element={
            <ProtectedRoute>
              <EmployeeProfile />
            </ProtectedRoute>
          }
        />
        
        {/* Client routes */}
        <Route
          path="/client/dashboard"
          element={
            <ProtectedRoute>
              <ClientDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/client/tasks"
          element={
            <ProtectedRoute>
              <ClientTasks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/client/tasks/:taskId"
          element={
            <ProtectedRoute>
              <ClientTaskDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/client/brands"
          element={
            <ProtectedRoute>
              <BrandsDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/client/reports"
          element={
            <ProtectedRoute>
              <ClientReports />
            </ProtectedRoute>
          }
        />
        
        {/* HR Routes */}
        <Route
          path="/hr/dashboard"
          element={
            <ProtectedRoute>
              <HRDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hr/attendance"
          element={
            <ProtectedRoute>
              <HRAttendance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hr/recruitment"
          element={
            <ProtectedRoute>
              <HRRecruitment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hr/payroll"
          element={
            <ProtectedRoute>
              <HRPayroll />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hr/reports"
          element={
            <ProtectedRoute>
              <HRReports />
            </ProtectedRoute>
          }
        />
        
        {/* Finance Routes */}
        <Route
          path="/finance/dashboard"
          element={
            <ProtectedRoute>
              <FinanceDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/finance/financial-dashboard"
          element={
            <ProtectedRoute>
              <FinancialDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/finance/invoices"
          element={
            <ProtectedRoute>
              <Invoices />
            </ProtectedRoute>
          }
        />
        <Route
          path="/finance/cost-analysis"
          element={
            <ProtectedRoute>
              <CostAnalysis />
            </ProtectedRoute>
          }
        />
        <Route
          path="/finance/performance"
          element={
            <ProtectedRoute>
              <Performance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/finance/reports"
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/finance/budgets"
          element={
            <ProtectedRoute>
              <Budgets />
            </ProtectedRoute>
          }
        />
        
        {/* Marketing Routes */}
        <Route
          path="/marketing/dashboard"
          element={
            <ProtectedRoute>
              <MarketingDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/marketing/campaigns"
          element={
            <ProtectedRoute>
              <MarketingCampaigns />
            </ProtectedRoute>
          }
        />
        <Route
          path="/marketing/meetings"
          element={
            <ProtectedRoute>
              <MarketingMeetings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/marketing/analytics"
          element={
            <ProtectedRoute>
              <MarketingAnalytics />
            </ProtectedRoute>
          }
        />
        
        {/* 404 - Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
