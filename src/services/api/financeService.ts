
import apiClient from '@/utils/apiUtils';

export interface Invoice {
  id: number;
  client_id: number;
  client_name: string;
  invoice_number: string;
  amount: number;
  due_date: string;
  issued_date: string;
  status: 'pending' | 'paid' | 'overdue';
  payment_terms: string;
  notes: string;
}

export interface FinancialRecord {
  id: number;
  record_type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: string;
  created_at: string;
}

export const financeService = {
  // Invoices
  getInvoices: async (status?: string) => {
    try {
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      
      const response = await apiClient.get(`/finance/invoices?${params.toString()}`);
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
  
  // Reports
  getRevenueReports: async (startDate?: string, endDate?: string) => {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      
      const response = await apiClient.get(`/finance/reports/revenue?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Get revenue reports error:', error);
      return { data: [] };
    }
  },
  
  getExpenseReports: async (startDate?: string, endDate?: string) => {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      
      const response = await apiClient.get(`/finance/reports/expenses?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Get expense reports error:', error);
      return { data: [] };
    }
  },
  
  // Add missing methods
  sendInvoiceReminder: async (invoiceId: number) => {
    try {
      const response = await apiClient.post(`/finance/invoices/${invoiceId}/reminder`);
      return response.data;
    } catch (error) {
      console.error('Send invoice reminder error:', error);
      throw error;
    }
  },
  
  getFinancialRecords: async (type?: string, startDate?: string, endDate?: string) => {
    try {
      const params = new URLSearchParams();
      if (type) params.append('type', type);
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      
      const response = await apiClient.get(`/finance/records?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Get financial records error:', error);
      return [];
    }
  },
  
  analyzeTeamCosts: async (startDate?: string, endDate?: string) => {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      
      const response = await apiClient.get(`/finance/analyze/team-costs?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Analyze team costs error:', error);
      return { 
        departments: [],
        employees: [],
        total_cost: 0,
        average_hourly_rate: 0
      };
    }
  },
  
  // Sales related methods
  getSalesFollowUps: async () => {
    try {
      const response = await apiClient.get('/finance/sales/follow-ups');
      return response.data;
    } catch (error) {
      console.error('Get sales follow ups error:', error);
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
  
  completeFollowUp: async (followUpId: number, notes?: string) => {
    try {
      const response = await apiClient.put(`/finance/sales/follow-ups/${followUpId}/complete`, { notes });
      return response.data;
    } catch (error) {
      console.error('Complete follow up error:', error);
      throw error;
    }
  },
  
  getSalesGrowthData: async (period?: string) => {
    try {
      const params = new URLSearchParams();
      if (period) params.append('period', period);
      
      const response = await apiClient.get(`/finance/sales/growth?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Get sales growth data error:', error);
      return { data: [] };
    }
  },
  
  getSalesTargets: async (year?: number) => {
    try {
      const params = new URLSearchParams();
      if (year) params.append('year', year.toString());
      
      const response = await apiClient.get(`/finance/sales/targets?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Get sales targets error:', error);
      return [];
    }
  },
  
  getGrowthForecast: async () => {
    try {
      const response = await apiClient.get('/finance/sales/forecast');
      return response.data;
    } catch (error) {
      console.error('Get growth forecast error:', error);
      return {
        short_term: [],
        mid_term: [],
        long_term: []
      };
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
  
  getSalesTrends: async () => {
    try {
      const response = await apiClient.get('/finance/sales/trends');
      return response.data;
    } catch (error) {
      console.error('Get sales trends error:', error);
      return [];
    }
  },
  
  getSalesByChannel: async () => {
    try {
      const response = await apiClient.get('/finance/sales/by-channel');
      return response.data;
    } catch (error) {
      console.error('Get sales by channel error:', error);
      return [];
    }
  },
  
  getTopProducts: async () => {
    try {
      const response = await apiClient.get('/finance/sales/top-products');
      return response.data;
    } catch (error) {
      console.error('Get top products error:', error);
      return [];
    }
  },
  
  getFinancialOverview: async () => {
    try {
      const response = await apiClient.get('/finance/overview');
      return response.data;
    } catch (error) {
      console.error('Get financial overview error:', error);
      return {
        monthly_revenue: 0,
        total_outstanding: 0,
        growth_rate: 0,
        expenses: 0
      };
    }
  },
  
  getFinancialMetrics: async () => {
    try {
      const response = await apiClient.get('/finance/metrics');
      return response.data;
    } catch (error) {
      console.error('Get financial metrics error:', error);
      return {};
    }
  },
  
  getUpsellOpportunities: async () => {
    try {
      const response = await apiClient.get('/finance/upsell-opportunities');
      return response.data;
    } catch (error) {
      console.error('Get upsell opportunities error:', error);
      return [];
    }
  },
  
  getFinancialPlans: async () => {
    try {
      const response = await apiClient.get('/finance/plans');
      return response.data;
    } catch (error) {
      console.error('Get financial plans error:', error);
      return [];
    }
  },
  
  getSalesMetrics: async () => {
    try {
      const response = await apiClient.get('/finance/sales/metrics');
      return response.data;
    } catch (error) {
      console.error('Get sales metrics error:', error);
      return {};
    }
  }
};
