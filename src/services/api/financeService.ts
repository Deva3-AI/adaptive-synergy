
import apiClient from '@/utils/apiUtils';

export interface Invoice {
  invoice_id: number;
  client_id: number;
  client_name: string;
  invoice_number: string;
  amount: number;
  due_date: string;
  status: 'pending' | 'paid' | 'overdue';
  created_at: string;
}

export interface FinancialRecord {
  record_id: number;
  record_type: 'expense' | 'income';
  amount: number;
  description: string;
  record_date: string;
  created_at: string;
}

export const financeService = {
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
      throw error;
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
      throw error;
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
      throw error;
    }
  },
  
  getFinancialRecords: async (recordType?: string, startDate?: string, endDate?: string) => {
    try {
      let url = '/finance/records';
      const params = new URLSearchParams();
      
      if (recordType) params.append('type', recordType);
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Get financial records error:', error);
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
  
  analyzeTeamCosts: async (startDate?: string, endDate?: string) => {
    try {
      let url = '/finance/analyze/team-costs';
      const params = new URLSearchParams();
      
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Analyze team costs error:', error);
      throw error;
    }
  },
  
  getFinancialOverview: async () => {
    try {
      const response = await apiClient.get('/finance/overview');
      return response.data;
    } catch (error) {
      console.error('Get financial overview error:', error);
      throw error;
    }
  },
  
  getFinancialMetrics: async () => {
    try {
      const response = await apiClient.get('/finance/metrics');
      return response.data;
    } catch (error) {
      console.error('Get financial metrics error:', error);
      throw error;
    }
  },
  
  getUpsellOpportunities: async () => {
    try {
      const response = await apiClient.get('/finance/upsell-opportunities');
      return response.data;
    } catch (error) {
      console.error('Get upsell opportunities error:', error);
      throw error;
    }
  },
  
  getFinancialPlans: async () => {
    try {
      const response = await apiClient.get('/finance/plans');
      return response.data;
    } catch (error) {
      console.error('Get financial plans error:', error);
      throw error;
    }
  },
  
  getSalesMetrics: async () => {
    try {
      const response = await apiClient.get('/finance/sales/metrics');
      return response.data;
    } catch (error) {
      console.error('Get sales metrics error:', error);
      throw error;
    }
  },
  
  getSalesFollowUps: async () => {
    try {
      const response = await apiClient.get('/finance/sales/follow-ups');
      return response.data;
    } catch (error) {
      console.error('Get sales follow-ups error:', error);
      throw error;
    }
  },
  
  getImprovementSuggestions: async () => {
    try {
      const response = await apiClient.get('/finance/sales/improvement-suggestions');
      return response.data;
    } catch (error) {
      console.error('Get improvement suggestions error:', error);
      throw error;
    }
  },
  
  completeFollowUp: async (followUpId: number, notes: string) => {
    try {
      const response = await apiClient.post(`/finance/sales/follow-ups/${followUpId}/complete`, { notes });
      return response.data;
    } catch (error) {
      console.error('Complete follow up error:', error);
      throw error;
    }
  },
  
  getSalesGrowthData: async () => {
    try {
      const response = await apiClient.get('/finance/sales/growth');
      return response.data;
    } catch (error) {
      console.error('Get sales growth data error:', error);
      throw error;
    }
  },
  
  getSalesTargets: async () => {
    try {
      const response = await apiClient.get('/finance/sales/targets');
      return response.data;
    } catch (error) {
      console.error('Get sales targets error:', error);
      throw error;
    }
  },
  
  getGrowthForecast: async () => {
    try {
      const response = await apiClient.get('/finance/sales/forecast');
      return response.data;
    } catch (error) {
      console.error('Get growth forecast error:', error);
      throw error;
    }
  },
  
  getWeeklyReports: async () => {
    try {
      const response = await apiClient.get('/finance/sales/reports/weekly');
      return response.data;
    } catch (error) {
      console.error('Get weekly reports error:', error);
      throw error;
    }
  },
  
  getMonthlyReports: async () => {
    try {
      const response = await apiClient.get('/finance/sales/reports/monthly');
      return response.data;
    } catch (error) {
      console.error('Get monthly reports error:', error);
      throw error;
    }
  },
  
  getSalesTrends: async () => {
    try {
      const response = await apiClient.get('/finance/sales/trends');
      return response.data;
    } catch (error) {
      console.error('Get sales trends error:', error);
      throw error;
    }
  },
  
  getSalesByChannel: async () => {
    try {
      const response = await apiClient.get('/finance/sales/by-channel');
      return response.data;
    } catch (error) {
      console.error('Get sales by channel error:', error);
      throw error;
    }
  },
  
  getTopProducts: async () => {
    try {
      const response = await apiClient.get('/finance/sales/top-products');
      return response.data;
    } catch (error) {
      console.error('Get top products error:', error);
      throw error;
    }
  },
};
