import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/theme-provider";
import { ScrollToTop } from "@/components/utils/scroll-to-top";
import { useAuth } from "@/hooks/use-auth";
import { HelmetProvider } from 'react-helmet-async';
import AppLayout from "@/components/layout/AppLayout";
import { LandingPage } from "@/pages/LandingPage";
import Login from "@/pages/auth/Login";
import Signup from "@/pages/auth/Signup";
import PasswordRecovery from "@/pages/auth/PasswordRecovery";
import ResetPassword from "@/pages/auth/ResetPassword";
import VerifyEmail from "@/pages/auth/VerifyEmail";
import Dashboard from "@/pages/Dashboard";
import Tasks from "@/pages/employee/Tasks";
import Clients from "@/pages/Clients";
import EmployeeDirectory from "@/pages/employee/EmployeeDirectory";
import Finance from "@/pages/finance/FinancialDashboard";
import MarketingDashboard from "@/pages/marketing/Dashboard";
import Reports from "@/pages/Reports";
import Settings from "@/pages/Settings";
import ProtectedRoute from "@/components/ProtectedRoute";
import GuestRoute from "@/components/auth/GuestRoute";
import EmployeeProfile from "@/pages/employee/EmployeeProfile";
import TaskDetail from "@/pages/employee/TaskDetail";
import Profile from "@/pages/Profile";
import HRDashboard from "@/pages/hr/HRDashboard";
import CompanyCalendar from "@/pages/CompanyCalendar";
import Announcements from "@/pages/Announcements";
import Documentation from '@/pages/Documentation';

const queryClient = new QueryClient();

function App() {
  const { user, loading } = useAuth();

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-react-theme">
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <Router>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              
              {/* Auth routes */}
              <Route
                path="/login"
                element={
                  <GuestRoute>
                    <Login />
                  </GuestRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <GuestRoute>
                    <Signup />
                  </GuestRoute>
                }
              />
              <Route
                path="/forgot-password"
                element={
                  <GuestRoute>
                    <PasswordRecovery />
                  </GuestRoute>
                }
              />
              <Route
                path="/reset-password/:token"
                element={
                  <GuestRoute>
                    <ResetPassword />
                  </GuestRoute>
                }
              />
              <Route
                path="/verify-email/:token"
                element={
                  <GuestRoute>
                    <VerifyEmail />
                  </GuestRoute>
                }
              />
              
              {/* Protected routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Dashboard />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tasks"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Tasks />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tasks/:taskId"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <TaskDetail />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/clients"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Clients />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/employees"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <EmployeeDirectory />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/employees/:employeeId"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <EmployeeProfile />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/finance"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Finance />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/marketing"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <MarketingDashboard />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reports"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Reports />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Settings />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Profile />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/hr-dashboard"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <HRDashboard />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/calendar"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <CompanyCalendar />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/announcements"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Announcements />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/documentation"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Documentation />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Router>
        </HelmetProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
