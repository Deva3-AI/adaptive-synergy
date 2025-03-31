import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './hooks/use-auth';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import EmployeeDashboard from './pages/employee/Dashboard';
import EmployeeTasks from './pages/employee/Tasks';
import TaskDetail from './pages/employee/TaskDetail';
import Profile from './pages/employee/Profile';
import LeaveRequests from './pages/employee/LeaveRequests';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            {/* Dashboard routes */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Employee routes */}
            <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
            <Route path="/employee/tasks" element={<EmployeeTasks />} />
            <Route path="/employee/tasks/:taskId" element={<TaskDetail />} />
            <Route path="/employee/profile" element={<Profile />} />
            <Route path="/employee/leave-requests" element={<LeaveRequests />} />
            
            {/* Add more protected routes here */}
          </Route>
          
          {/* Add a 404 route here */}
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
