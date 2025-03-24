
import apiClient from '@/utils/apiUtils';

export interface Invoice {
  invoice_id: number;
  client_id: number;
  client_name?: string;
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
  // Invoice methods
  getInvoices: async (status?: string) => {
    try {
      const params = status && status !== 'all' ? `?status=${status}` : '';
      const response = await apiClient.get(`/finance/invoices${params}`);
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
      const response = await apiClient.patch(`/finance/invoices/${invoiceId}`, { status });
      return response.data;
    } catch (error) {
      console.error('Update invoice status error:', error);
      throw error;
    }
  },

  sendInvoiceReminder: async (invoiceId: number) => {
    try {
      const response = await apiClient.post(`/finance/invoices/${invoiceId}/send-reminder`);
      return response.data;
    } catch (error) {
      console.error('Send invoice reminder error:', error);
      throw error;
    }
  },
  
  // Reports methods
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

  // Financial records
  getFinancialRecords: async (type?: 'expense' | 'income') => {
    try {
      const params = type ? `?type=${type}` : '';
      const response = await apiClient.get(`/finance/records${params}`);
      return response.data;
    } catch (error) {
      console.error('Get financial records error:', error);
      return [];
    }
  },

  // Financial overview and metrics
  getFinancialOverview: async () => {
    try {
      const response = await apiClient.get('/finance/overview');
      return response.data;
    } catch (error) {
      console.error('Get financial overview error:', error);
      return {
        monthly_revenue: 0,
        growth_rate: 0,
        expenses: 0,
        profit: 0
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

  // Team costs analysis
  analyzeTeamCosts: async (period: string = 'month') => {
    try {
      const response = await apiClient.get(`/finance/team-costs?period=${period}`);
      return response.data;
    } catch (error) {
      console.error('Analyze team costs error:', error);
      return {
        total_cost: 0,
        by_department: [],
        by_employee: [],
        trends: []
      };
    }
  },

  // Sales related methods
  getSalesMetrics: async (period: string = 'month') => {
    try {
      const response = await apiClient.get(`/finance/sales/metrics?period=${period}`);
      return response.data;
    } catch (error) {
      console.error('Get sales metrics error:', error);
      return {
        totalSales: 0,
        salesGrowth: 0,
        newCustomers: 0,
        customerGrowth: 0,
        conversionRate: 0,
        conversionGrowth: 0,
        averageSale: 0,
        averageSaleGrowth: 0
      };
    }
  },

  getSalesTrends: async (period: string = 'month') => {
    try {
      const response = await apiClient.get(`/finance/sales/trends?period=${period}`);
      return response.data;
    } catch (error) {
      console.error('Get sales trends error:', error);
      return [];
    }
  },

  getSalesByChannel: async (period: string = 'month') => {
    try {
      const response = await apiClient.get(`/finance/sales/by-channel?period=${period}`);
      return response.data;
    } catch (error) {
      console.error('Get sales by channel error:', error);
      return [];
    }
  },

  getTopProducts: async (period: string = 'month') => {
    try {
      const response = await apiClient.get(`/finance/sales/top-products?period=${period}`);
      return response.data;
    } catch (error) {
      console.error('Get top products error:', error);
      return [];
    }
  },

  getSalesGrowthData: async (period: string = 'month') => {
    try {
      const response = await apiClient.get(`/finance/sales/growth?period=${period}`);
      return response.data;
    } catch (error) {
      console.error('Get sales growth data error:', error);
      return {
        trends: [],
        currentPeriod: { revenueGrowth: 0, customerGrowth: 0 },
        growthDrivers: []
      };
    }
  },

  getSalesTargets: async (period: string = 'month') => {
    try {
      const response = await apiClient.get(`/finance/sales/targets?period=${period}`);
      return response.data;
    } catch (error) {
      console.error('Get sales targets error:', error);
      return [];
    }
  },

  getGrowthForecast: async (period: string = 'month') => {
    try {
      const response = await apiClient.get(`/finance/sales/forecast?period=${period}`);
      return response.data;
    } catch (error) {
      console.error('Get growth forecast error:', error);
      return {
        chart: [],
        insights: []
      };
    }
  },

  getSalesFollowUps: async () => {
    try {
      const response = await apiClient.get('/finance/sales/followups');
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
      const response = await apiClient.post(`/finance/sales/followups/${followUpId}/complete`, { feedback });
      return response.data;
    } catch (error) {
      console.error('Complete follow-up error:', error);
      throw error;
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
  }
};

export default financeService;
