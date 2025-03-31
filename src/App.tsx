
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './hooks/use-auth';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import EmployeeDashboard from './pages/employee/Dashboard';
import EmployeeTasks from './pages/employee/Tasks';
import TaskDetail from './pages/employee/TaskDetail';
import Profile from './pages/employee/Profile';
import LeaveRequests from './pages/employee/LeaveRequests';
import AppLayout from './components/layout/AppLayout';

// Finance pages
import FinanceDashboard from './pages/finance/Dashboard';
import FinancialDashboard from './pages/finance/FinancialDashboard';
import SalesDashboard from './pages/finance/SalesDashboard';
import FinancePerformance from './pages/finance/Performance';
import FinanceReports from './pages/finance/Reports';

// HR pages
import HRDashboard from './pages/hr/HRDashboard';
import Attendance from './pages/hr/Attendance';
import LeaveManagement from './pages/hr/LeaveManagement';
import Recruitment from './pages/hr/Recruitment';
import Payroll from './pages/hr/Payroll';
import HRReports from './pages/hr/Reports';
import PerformanceReviews from './pages/hr/PerformanceReviews';

// Marketing pages
import MarketingDashboard from './pages/marketing/Dashboard';
import MarketingCampaigns from './pages/marketing/Campaigns';
import MarketingAnalytics from './pages/marketing/Analytics';
import MarketingLeads from './pages/marketing/Leads';
import MarketingMeetings from './pages/marketing/Meetings';
import EmailTemplates from './pages/marketing/EmailTemplates';
import MarketingOutreachPlans from './pages/marketing/OutreachPlans';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Signup />} />
          
          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              {/* Dashboard routes */}
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              
              {/* Employee routes */}
              <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
              <Route path="/employee/tasks" element={<EmployeeTasks />} />
              <Route path="/employee/tasks/:taskId" element={<TaskDetail />} />
              <Route path="/employee/profile" element={<Profile />} />
              <Route path="/employee/leave-requests" element={<LeaveRequests />} />
              
              {/* Finance routes */}
              <Route path="/finance/dashboard" element={<FinanceDashboard />} />
              <Route path="/finance/overview" element={<FinancialDashboard />} />
              <Route path="/finance/sales" element={<SalesDashboard />} />
              <Route path="/finance/performance" element={<FinancePerformance />} />
              <Route path="/finance/reports" element={<FinanceReports />} />
              
              {/* HR routes */}
              <Route path="/hr/dashboard" element={<HRDashboard />} />
              <Route path="/hr/attendance" element={<Attendance />} />
              <Route path="/hr/leave-management" element={<LeaveManagement />} />
              <Route path="/hr/recruitment" element={<Recruitment />} />
              <Route path="/hr/payroll" element={<Payroll />} />
              <Route path="/hr/reports" element={<HRReports />} />
              <Route path="/hr/performance" element={<PerformanceReviews />} />
              
              {/* Marketing routes */}
              <Route path="/marketing/dashboard" element={<MarketingDashboard />} />
              <Route path="/marketing/campaigns" element={<MarketingCampaigns />} />
              <Route path="/marketing/analytics" element={<MarketingAnalytics />} />
              <Route path="/marketing/leads" element={<MarketingLeads />} />
              <Route path="/marketing/meetings" element={<MarketingMeetings />} />
              <Route path="/marketing/email-templates" element={<EmailTemplates />} />
              <Route path="/marketing/plans" element={<MarketingOutreachPlans />} />
            </Route>
          </Route>
          
          {/* 404 route */}
          <Route path="*" element={<div className="p-8 text-center">Page not found</div>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
