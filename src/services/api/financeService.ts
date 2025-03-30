
import apiClient from '@/utils/apiUtils';

export interface Invoice {
  id: number;
  client_id: number;
  client_name: string;
  invoice_number: string;
  amount: number;
  due_date: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  created_at: string;
}

export interface FinancialRecord {
  id: number;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  recordDate: string;
  date: string;
  created_at: string;
}

const financeService = {
  getInvoices: async (status?: string) => {
    try {
      const url = status ? `/invoices?status=${status}` : '/invoices';
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching invoices:', error);
      return [];
    }
  },

  getInvoiceDetails: async (invoiceId: number) => {
    try {
      const response = await apiClient.get(`/invoices/${invoiceId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching invoice ${invoiceId}:`, error);
      return null;
    }
  },

  createInvoice: async (invoiceData: any) => {
    try {
      const response = await apiClient.post('/invoices', invoiceData);
      return response.data;
    } catch (error) {
      console.error('Error creating invoice:', error);
      throw error;
    }
  },

  updateInvoiceStatus: async (invoiceId: number, status: string) => {
    try {
      const response = await apiClient.put(`/invoices/${invoiceId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error(`Error updating invoice ${invoiceId} status:`, error);
      throw error;
    }
  },

  getRevenueReports: async (startDate?: string, endDate?: string) => {
    try {
      let url = '/finance/revenue';
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
      let url = '/finance/expenses';
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

  sendInvoiceReminder: async (invoiceId: number) => {
    try {
      const response = await apiClient.post(`/invoices/${invoiceId}/reminder`);
      return response.data;
    } catch (error) {
      console.error(`Error sending reminder for invoice ${invoiceId}:`, error);
      throw error;
    }
  },

  getFinancialRecords: async (type?: string, startDate?: string, endDate?: string) => {
    try {
      let url = '/finance/records';
      const params = [];
      if (type) params.push(`type=${type}`);
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
      const response = await apiClient.get('/finance/improvement-suggestions');
      return response.data;
    } catch (error) {
      console.error('Error fetching improvement suggestions:', error);
      return [];
    }
  },

  completeFollowUp: async (followUpId: number, feedback?: string) => {
    try {
      const response = await apiClient.put(`/finance/sales/follow-ups/${followUpId}/complete`, { feedback });
      return response.data;
    } catch (error) {
      console.error(`Error completing follow-up ${followUpId}:`, error);
      throw error;
    }
  },

  getSalesGrowthData: async (period?: string) => {
    try {
      const url = period ? `/finance/sales/growth?period=${period}` : '/finance/sales/growth';
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching sales growth data:', error);
      return null;
    }
  },

  getSalesTargets: async (period?: string) => {
    try {
      const url = period ? `/finance/sales/targets?period=${period}` : '/finance/sales/targets';
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching sales targets:', error);
      return null;
    }
  },

  getGrowthForecast: async (period?: string) => {
    try {
      const url = period ? `/finance/sales/forecast?period=${period}` : '/finance/sales/forecast';
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching growth forecast:', error);
      return null;
    }
  },

  getWeeklyReports: async (startDate?: string, endDate?: string) => {
    try {
      let url = '/finance/sales/weekly';
      if (startDate && endDate) {
        url += `?startDate=${startDate}&endDate=${endDate}`;
      }
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching weekly reports:', error);
      return null;
    }
  },

  getMonthlyReports: async (year?: number) => {
    try {
      const url = year ? `/finance/sales/monthly?year=${year}` : '/finance/sales/monthly';
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching monthly reports:', error);
      return null;
    }
  },

  getSalesTrends: async (period?: string) => {
    try {
      const url = period ? `/finance/sales/trends?period=${period}` : '/finance/sales/trends';
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching sales trends:', error);
      return null;
    }
  },

  getSalesByChannel: async (period?: string) => {
    try {
      const url = period ? `/finance/sales/by-channel?period=${period}` : '/finance/sales/by-channel';
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching sales by channel:', error);
      return null;
    }
  },

  getTopProducts: async (period?: string) => {
    try {
      const url = period ? `/finance/sales/top-products?period=${period}` : '/finance/sales/top-products';
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching top products:', error);
      return null;
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
      const url = period ? `/finance/metrics?period=${period}` : '/finance/metrics';
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

  getSalesMetrics: async (period?: string) => {
    try {
      const url = period ? `/finance/sales/metrics?period=${period}` : '/finance/sales/metrics';
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching sales metrics:', error);
      return null;
    }
  }
};

export default financeService;
