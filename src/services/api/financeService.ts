
import apiClient from '@/utils/apiUtils';

export interface Invoice {
  id: number;
  invoiceId?: number; // Added for compatibility
  invoice_id?: number; // Added for compatibility
  client_id: number;
  client_name: string;
  invoice_number: string;
  amount: number;
  due_date: string;
  issue_date: string;
  status: 'pending' | 'paid' | 'overdue';
  items?: Array<{
    id: number;
    description: string;
    quantity: number;
    unit_price: number;
    total: number;
  }>;
}

export interface FinancialRecord {
  id: number;
  record_id?: number; // For compatibility
  record_type: 'expense' | 'income';
  amount: number;
  description: string;
  category?: string;
  date: string;
  record_date?: string; // For compatibility
}

export const financeService = {
  // Invoice management
  getInvoices: async (status?: string) => {
    try {
      let url = '/finance/invoices';
      if (status) {
        url += `?status=${status}`;
      }
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Get invoices error:', error);
      return [];
    }
  },
  
  getInvoiceDetails: async (invoiceId: number) => {
    try {
      const response = await apiClient.get(`/finance/invoices/${invoiceId}`);
      return response.data;
    } catch (error) {
      console.error('Get invoice details error:', error);
      throw error;
    }
  },
  
  createInvoice: async (invoiceData: any) => {
    try {
      const response = await apiClient.post('/finance/invoices', invoiceData);
      return response.data;
    } catch (error) {
      console.error('Create invoice error:', error);
      throw error;
    }
  },
  
  updateInvoiceStatus: async (invoiceId: number, status: string) => {
    try {
      const response = await apiClient.put(`/finance/invoices/${invoiceId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Update invoice status error:', error);
      throw error;
    }
  },
  
  sendInvoiceReminder: async (invoiceId: number) => {
    try {
      const response = await apiClient.post(`/finance/invoices/${invoiceId}/remind`);
      return response.data;
    } catch (error) {
      console.error('Send invoice reminder error:', error);
      throw error;
    }
  },
  
  // Reports
  getRevenueReports: async (startDate?: string, endDate?: string) => {
    try {
      let url = '/finance/reports/revenue';
      const params = new URLSearchParams();
      
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Get revenue reports error:', error);
      return {};
    }
  },
  
  getExpenseReports: async (startDate?: string, endDate?: string) => {
    try {
      let url = '/finance/reports/expenses';
      const params = new URLSearchParams();
      
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Get expense reports error:', error);
      return {};
    }
  },

  // Financial records
  getFinancialRecords: async (type?: 'expense' | 'income', startDate?: string, endDate?: string) => {
    try {
      let url = '/finance/records';
      const params = new URLSearchParams();
      
      if (type) params.append('type', type);
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Get financial records error:', error);
      return [];
    }
  },
  
  createFinancialRecord: async (recordData: any) => {
    try {
      const response = await apiClient.post('/finance/records', recordData);
      return response.data;
    } catch (error) {
      console.error('Create financial record error:', error);
      throw error;
    }
  },
  
  // Dashboard
  getFinancialOverview: async () => {
    try {
      const response = await apiClient.get('/finance/overview');
      return response.data;
    } catch (error) {
      console.error('Get financial overview error:', error);
      return {
        monthly_revenue: 0,
        monthly_expenses: 0,
        profit: 0,
        growth_rate: 0,
        pending_invoices: 0,
        pending_amount: 0
      };
    }
  },
  
  getFinancialMetrics: async (period: string = 'month') => {
    try {
      const response = await apiClient.get(`/finance/metrics?period=${period}`);
      return response.data;
    } catch (error) {
      console.error('Get financial metrics error:', error);
      return {};
    }
  },
  
  // Upsell opportunities
  getUpsellOpportunities: async () => {
    try {
      const response = await apiClient.get('/finance/upsell-opportunities');
      return response.data;
    } catch (error) {
      console.error('Get upsell opportunities error:', error);
      return [];
    }
  },

  // Team costs analysis
  analyzeTeamCosts: async (period: string = 'month') => {
    try {
      const response = await apiClient.get(`/finance/team-costs?period=${period}`);
      return response.data;
    } catch (error) {
      console.error('Analyze team costs error:', error);
      return {
        total_cost: 0,
        departments: [],
        trend: [],
        efficiency: []
      };
    }
  },
  
  // Financial plans
  getFinancialPlans: async () => {
    try {
      const response = await apiClient.get('/finance/plans');
      return response.data;
    } catch (error) {
      console.error('Get financial plans error:', error);
      return [];
    }
  },
  
  // Sales-related methods
  getSalesMetrics: async (period: string = 'month') => {
    try {
      const response = await apiClient.get(`/finance/sales/metrics?period=${period}`);
      return response.data;
    } catch (error) {
      console.error('Get sales metrics error:', error);
      return {};
    }
  },
  
  getSalesTrends: async (dateRange: string = 'month') => {
    try {
      const response = await apiClient.get(`/finance/sales/trends?range=${dateRange}`);
      return response.data;
    } catch (error) {
      console.error('Get sales trends error:', error);
      return { data: [], insights: [], activities: [] };
    }
  },
  
  getSalesByChannel: async (dateRange: string = 'month') => {
    try {
      const response = await apiClient.get(`/finance/sales/by-channel?range=${dateRange}`);
      return response.data;
    } catch (error) {
      console.error('Get sales by channel error:', error);
      return [];
    }
  },
  
  getTopProducts: async (dateRange: string = 'month') => {
    try {
      const response = await apiClient.get(`/finance/sales/top-products?range=${dateRange}`);
      return response.data;
    } catch (error) {
      console.error('Get top products error:', error);
      return [];
    }
  },
  
  getSalesGrowthData: async (dateRange: string = 'month') => {
    try {
      const response = await apiClient.get(`/finance/sales/growth?range=${dateRange}`);
      return response.data;
    } catch (error) {
      console.error('Get sales growth data error:', error);
      return { trends: [], currentPeriod: {}, growthDrivers: [] };
    }
  },
  
  getSalesTargets: async (dateRange: string = 'month') => {
    try {
      const response = await apiClient.get(`/finance/sales/targets?range=${dateRange}`);
      return response.data;
    } catch (error) {
      console.error('Get sales targets error:', error);
      return [];
    }
  },
  
  getGrowthForecast: async (dateRange: string = 'month') => {
    try {
      const response = await apiClient.get(`/finance/sales/forecast?range=${dateRange}`);
      return response.data;
    } catch (error) {
      console.error('Get growth forecast error:', error);
      return { chart: [], insights: [] };
    }
  },
  
  getWeeklyReports: async () => {
    try {
      const response = await apiClient.get('/finance/sales/reports/weekly');
      return response.data;
    } catch (error) {
      console.error('Get weekly reports error:', error);
      return [];
    }
  },
  
  getMonthlyReports: async () => {
    try {
      const response = await apiClient.get('/finance/sales/reports/monthly');
      return response.data;
    } catch (error) {
      console.error('Get monthly reports error:', error);
      return [];
    }
  },
  
  getSalesFollowUps: async () => {
    try {
      const response = await apiClient.get('/finance/sales/follow-ups');
      return response.data;
    } catch (error) {
      console.error('Get sales follow-ups error:', error);
      return [];
    }
  },
  
  getImprovementSuggestions: async () => {
    try {
      const response = await apiClient.get('/finance/sales/improvement-suggestions');
      return response.data;
    } catch (error) {
      console.error('Get improvement suggestions error:', error);
      return [];
    }
  },
  
  completeFollowUp: async (followUpId: number, feedback: string) => {
    try {
      const response = await apiClient.post(`/finance/sales/follow-ups/${followUpId}/complete`, { feedback });
      return response.data;
    } catch (error) {
      console.error('Complete follow-up error:', error);
      throw error;
    }
  }
};

export default financeService;
