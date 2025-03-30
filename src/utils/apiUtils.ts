
import axios from 'axios';
import config from '@/config/config';

// Interfaces
export interface LeaveRequest {
  id: number;
  employeeId: number;
  employeeName: string;
  leaveType: 'annual' | 'sick' | 'personal' | 'wfh' | 'halfDay';
  startDate: string;
  endDate?: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
  documentUrl?: string;
}

export interface PaySlip {
  id: number;
  employeeId: number;
  employeeName: string;
  month: string;
  year: number;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  paidDate?: string;
  status: 'draft' | 'final' | 'paid';
}

// API utilities
export const createApiClient = (baseURL = config.apiUrl) => {
  return axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const handleApiError = (error: any, defaultValue: any = null) => {
  console.error('API Error:', error);
  if (error.response) {
    console.error('Response data:', error.response.data);
    console.error('Response status:', error.response.status);
    console.error('Response headers:', error.response.headers);
  } else if (error.request) {
    console.error('Request without response:', error.request);
  } else {
    console.error('Error message:', error.message);
  }
  return defaultValue;
};

// Create default API client
const apiClient = createApiClient();

export default apiClient;
