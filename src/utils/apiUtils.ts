
import axios from 'axios';
import config from '@/config/config';

// Interfaces
export interface LeaveRequest {
  id: number;
  employeeId: number;
  employeeName: string;
  leaveType: 'annual' | 'sick' | 'personal' | 'wfh' | 'halfDay' | 'other';
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
  status: 'draft' | 'final' | 'pending' | 'paid';
}

export interface SalesData {
  monthly_revenue: number;
  annual_target: number;
  growth_rate: number;
  client_acquisition: number;
  conversion_rate: number;
  avg_deal_size: number;
  top_clients: {
    client_id: number;
    client_name: string;
    revenue: number;
    growth: number;
  }[];
  monthly_trend: {
    month: string;
    revenue: number;
    target: number;
  }[];
  sales_by_service: {
    service: string;
    value: number;
  }[];
}

export interface DetailedTask {
  id: number;
  title: string;
  description: string;
  client: string;
  priority: "high" | "medium" | "low";
  status: string;
  dueDate: Date;
  estimatedHours: number;
  actualHours: number;
  assignedTo: string;
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

// Fetch data function used in components
export const fetchData = async (url: string, params?: any) => {
  try {
    const response = await axios.get(url, { params });
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

// Create default API client
const apiClient = createApiClient();

export default apiClient;
