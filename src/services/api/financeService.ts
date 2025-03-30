
import apiClient from '@/utils/apiUtils';

export interface Invoice {
  id: number;
  client_id: number;
  client_name: string;
  invoice_number: string;
  amount: number;
  due_date: string;
  status: 'pending' | 'paid' | 'overdue' | 'sent';
  created_at: string;
}

export interface FinancialRecord {
  id: number;
  record_type: 'expense' | 'income';
  amount: number;
  description?: string;
  record_date: string;
  created_at: string;
}

const financeService = {
  getInvoices: async (status?: string) => {
    try {
      let url = '/finance/invoices';
      if (status) {
        url += `?status=${status}`;
      }
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching invoices:', error);
      return [];
    }
  },

  getInvoiceDetails: async (invoiceId: number) => {
    try {
      const response = await apiClient.get(`/finance/invoices/${invoiceId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching invoice ${invoiceId}:`, error);
      return null;
    }
  },

  createInvoice: async (invoiceData: any) => {
    try {
      const response = await apiClient.post('/finance/invoices', invoiceData);
      return response.data;
    } catch (error) {
      console.error('Error creating invoice:', error);
      throw error;
    }
  },

  updateInvoiceStatus: async (invoiceId: number, status: string) => {
    try {
      const response = await apiClient.put(`/finance/invoices/${invoiceId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error(`Error updating invoice ${invoiceId} status:`, error);
      throw error;
    }
  },

  getRevenueReports: async (startDate?: string, endDate?: string) => {
    try {
      let url = '/finance/reports/revenue';
      if (startDate && endDate) {
        url += `?startDate=${startDate}&endDate=${endDate}`;
      }
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching revenue reports:', error);
      return null;
    }
  },

  getExpenseReports: async (startDate?: string, endDate?: string) => {
    try {
      let url = '/finance/reports/expenses';
      if (startDate && endDate) {
        url += `?startDate=${startDate}&endDate=${endDate}`;
      }
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching expense reports:', error);
      return null;
    }
  },

  getFinancialRecords: async (startDate?: string, endDate?: string, type?: string) => {
    try {
      let url = '/finance/records';
      const params = [];
      if (startDate) params.push(`startDate=${startDate}`);
      if (endDate) params.push(`endDate=${endDate}`);
      if (type) params.push(`type=${type}`);
      if (params.length > 0) {
        url += `?${params.join('&')}`;
      }
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching financial records:', error);
      return [];
    }
  },

  sendInvoiceReminder: async (invoiceId: number) => {
    try {
      const response = await apiClient.post(`/finance/invoices/${invoiceId}/remind`);
      return response.data;
    } catch (error) {
      console.error(`Error sending reminder for invoice ${invoiceId}:`, error);
      throw error;
    }
  },

  analyzeTeamCosts: async (startDate?: string, endDate?: string) => {
    try {
      let url = '/finance/team-costs';
      if (startDate && endDate) {
        url += `?startDate=${startDate}&endDate=${endDate}`;
      }
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Error analyzing team costs:', error);
      return null;
    }
  },

  getSalesFollowUps: async () => {
    try {
      const response = await apiClient.get('/finance/sales/follow-ups');
      return response.data;
    } catch (error) {
      console.error('Error fetching sales follow-ups:', error);
      return [];
    }
  },

  getImprovementSuggestions: async () => {
    try {
      const response = await apiClient.get('/finance/sales/improvement-suggestions');
      return response.data;
    } catch (error) {
      console.error('Error fetching improvement suggestions:', error);
      return [];
    }
  },

  completeFollowUp: async (followUpId: number, feedback: string) => {
    try {
      const response = await apiClient.put(`/finance/sales/follow-ups/${followUpId}/complete`, { feedback });
      return response.data;
    } catch (error) {
      console.error(`Error completing follow-up ${followUpId}:`, error);
      throw error;
    }
  },

  getSalesGrowthData: async (dateRange: string) => {
    try {
      const response = await apiClient.get(`/finance/sales/growth?range=${dateRange}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching sales growth data:', error);
      return null;
    }
  },

  getSalesTargets: async (dateRange: string) => {
    try {
      const response = await apiClient.get(`/finance/sales/targets?range=${dateRange}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching sales targets:', error);
      return [];
    }
  },

  getGrowthForecast: async (dateRange: string) => {
    try {
      const response = await apiClient.get(`/finance/sales/forecast?range=${dateRange}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching growth forecast:', error);
      return null;
    }
  },

  getWeeklyReports: async () => {
    try {
      const response = await apiClient.get('/finance/sales/reports/weekly');
      return response.data;
    } catch (error) {
      console.error('Error fetching weekly reports:', error);
      return [];
    }
  },

  getMonthlyReports: async () => {
    try {
      const response = await apiClient.get('/finance/sales/reports/monthly');
      return response.data;
    } catch (error) {
      console.error('Error fetching monthly reports:', error);
      return [];
    }
  },

  getSalesTrends: async (dateRange: string) => {
    try {
      const response = await apiClient.get(`/finance/sales/trends?range=${dateRange}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching sales trends:', error);
      return null;
    }
  },

  getSalesByChannel: async (dateRange: string) => {
    try {
      const response = await apiClient.get(`/finance/sales/by-channel?range=${dateRange}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching sales by channel:', error);
      return [];
    }
  },

  getTopProducts: async (dateRange: string) => {
    try {
      const response = await apiClient.get(`/finance/sales/top-products?range=${dateRange}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching top products:', error);
      return [];
    }
  },

  getFinancialOverview: async () => {
    try {
      const response = await apiClient.get('/finance/overview');
      return response.data;
    } catch (error) {
      console.error('Error fetching financial overview:', error);
      return null;
    }
  },

  getFinancialMetrics: async (period?: string) => {
    try {
      let url = '/finance/metrics';
      if (period) {
        url += `?period=${period}`;
      }
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching financial metrics:', error);
      return null;
    }
  },

  getUpsellOpportunities: async () => {
    try {
      const response = await apiClient.get('/finance/upsell-opportunities');
      return response.data;
    } catch (error) {
      console.error('Error fetching upsell opportunities:', error);
      return [];
    }
  },

  getFinancialPlans: async () => {
    try {
      const response = await apiClient.get('/finance/plans');
      return response.data;
    } catch (error) {
      console.error('Error fetching financial plans:', error);
      return [];
    }
  },

  getSalesMetrics: async () => {
    try {
      const response = await apiClient.get('/finance/sales/metrics');
      return response.data;
    } catch (error) {
      console.error('Error fetching sales metrics:', error);
      return null;
    }
  }
};

export default financeService;
