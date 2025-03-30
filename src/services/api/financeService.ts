
import apiClient from '@/utils/apiUtils';

export interface Invoice {
  invoice_id: number; // Using snake_case to match database schema
  client_id: number;
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

const financeService = {
  // Invoice Management
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

  // Reports
  getRevenueReports: async (startDate?: string, endDate?: string) => {
    try {
      let url = '/finance/reports/revenue';
      const params = [];
      if (startDate) params.push(`startDate=${startDate}`);
      if (endDate) params.push(`endDate=${endDate}`);
      if (params.length > 0) {
        url += `?${params.join('&')}`;
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
      const params = [];
      if (startDate) params.push(`startDate=${startDate}`);
      if (endDate) params.push(`endDate=${endDate}`);
      if (params.length > 0) {
        url += `?${params.join('&')}`;
      }
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching expense reports:', error);
      return null;
    }
  },

  // Additional methods for financial dashboard
  getFinancialRecords: async (startDate?: string, endDate?: string) => {
    try {
      let url = '/finance/records';
      const params = [];
      if (startDate) params.push(`startDate=${startDate}`);
      if (endDate) params.push(`endDate=${endDate}`);
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
      const response = await apiClient.post(`/finance/invoices/${invoiceId}/reminder`);
      return response.data;
    } catch (error) {
      console.error(`Error sending reminder for invoice ${invoiceId}:`, error);
      throw error;
    }
  },

  analyzeTeamCosts: async (startDate?: string, endDate?: string) => {
    try {
      let url = '/finance/analyze/team-costs';
      const params = [];
      if (startDate) params.push(`startDate=${startDate}`);
      if (endDate) params.push(`endDate=${endDate}`);
      if (params.length > 0) {
        url += `?${params.join('&')}`;
      }
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Error analyzing team costs:', error);
      return null;
    }
  },

  // Methods for FinancialDashboard.tsx
  getFinancialOverview: async () => {
    try {
      const response = await apiClient.get('/finance/overview');
      return response.data;
    } catch (error) {
      console.error('Error fetching financial overview:', error);
      return null;
    }
  },

  getFinancialMetrics: async (timeframe?: string) => {
    try {
      let url = '/finance/metrics';
      if (timeframe) {
        url += `?timeframe=${timeframe}`;
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
      return null;
    }
  },

  // Sales related methods
  getSalesMetrics: async (timeframe?: string) => {
    try {
      let url = '/finance/sales/metrics';
      if (timeframe) {
        url += `?timeframe=${timeframe}`;
      }
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching sales metrics:', error);
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

  completeFollowUp: async (followUpId: number, data: any) => {
    try {
      const response = await apiClient.put(`/finance/sales/follow-ups/${followUpId}/complete`, data);
      return response.data;
    } catch (error) {
      console.error(`Error completing follow-up ${followUpId}:`, error);
      throw error;
    }
  },

  getSalesGrowthData: async (timeframe?: string) => {
    try {
      let url = '/finance/sales/growth';
      if (timeframe) {
        url += `?timeframe=${timeframe}`;
      }
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching sales growth data:', error);
      return null;
    }
  },

  getSalesTargets: async () => {
    try {
      const response = await apiClient.get('/finance/sales/targets');
      return response.data;
    } catch (error) {
      console.error('Error fetching sales targets:', error);
      return null;
    }
  },

  getGrowthForecast: async (timeframe?: string) => {
    try {
      let url = '/finance/sales/forecast';
      if (timeframe) {
        url += `?timeframe=${timeframe}`;
      }
      const response = await apiClient.get(url);
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
      return null;
    }
  },

  getMonthlyReports: async () => {
    try {
      const response = await apiClient.get('/finance/sales/reports/monthly');
      return response.data;
    } catch (error) {
      console.error('Error fetching monthly reports:', error);
      return null;
    }
  },

  getSalesTrends: async () => {
    try {
      const response = await apiClient.get('/finance/sales/trends');
      return response.data;
    } catch (error) {
      console.error('Error fetching sales trends:', error);
      return null;
    }
  },

  getSalesByChannel: async () => {
    try {
      const response = await apiClient.get('/finance/sales/by-channel');
      return response.data;
    } catch (error) {
      console.error('Error fetching sales by channel:', error);
      return null;
    }
  },

  getTopProducts: async () => {
    try {
      const response = await apiClient.get('/finance/sales/top-products');
      return response.data;
    } catch (error) {
      console.error('Error fetching top products:', error);
      return null;
    }
  }
};

export default financeService;
