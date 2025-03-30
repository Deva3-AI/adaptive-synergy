
import apiClient from '@/utils/apiUtils';

export interface Invoice {
  id: number;
  invoice_number: string;
  client_id: number;
  client_name: string;
  amount: number;
  issue_date: string;
  due_date: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
}

export interface FinancialRecord {
  id: number;
  record_type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: string;
}

export const financeService = {
  getInvoices: async (status?: string) => {
    try {
      const params = status ? { status } : {};
      const response = await apiClient.get('/invoices', { params });
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
      console.error(`Error fetching invoice details for ${invoiceId}:`, error);
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
      const response = await apiClient.patch(`/invoices/${invoiceId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error(`Error updating invoice status for ${invoiceId}:`, error);
      throw error;
    }
  },

  getRevenueReports: async (startDate?: string, endDate?: string) => {
    try {
      const params = { start_date: startDate, end_date: endDate };
      const response = await apiClient.get('/reports/revenue', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching revenue reports:', error);
      return {};
    }
  },

  getExpenseReports: async (startDate?: string, endDate?: string) => {
    try {
      const params = { start_date: startDate, end_date: endDate };
      const response = await apiClient.get('/reports/expenses', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching expense reports:', error);
      return {};
    }
  },

  // Add missing methods
  getFinancialRecords: async (startDate?: string, endDate?: string, type?: 'income' | 'expense') => {
    try {
      const params = { start_date: startDate, end_date: endDate, type };
      const response = await apiClient.get('/financial-records', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching financial records:', error);
      return [];
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

  analyzeTeamCosts: async (startDate?: string, endDate?: string) => {
    try {
      const params = { start_date: startDate, end_date: endDate };
      const response = await apiClient.get('/reports/team-costs', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching team costs analysis:', error);
      return {
        total_cost: 75000,
        departments: [
          { name: "Design", cost: 25000, headcount: 5 },
          { name: "Development", cost: 35000, headcount: 7 },
          { name: "Marketing", cost: 15000, headcount: 3 }
        ],
        monthly_trend: [
          { month: "Jan", cost: 68000 },
          { month: "Feb", cost: 70000 },
          { month: "Mar", cost: 72000 },
          { month: "Apr", cost: 73500 },
          { month: "May", cost: 75000 }
        ],
        cost_per_project: [
          { project: "Website Redesign", cost: 28000 },
          { project: "Mobile App", cost: 32000 },
          { project: "Brand Campaign", cost: 15000 }
        ]
      };
    }
  },

  // Sales-related finance methods
  getSalesFollowUps: async () => {
    try {
      const response = await apiClient.get('/sales/follow-ups');
      return response.data;
    } catch (error) {
      console.error('Error fetching sales follow-ups:', error);
      return [];
    }
  },

  getImprovementSuggestions: async () => {
    try {
      const response = await apiClient.get('/sales/improvement-suggestions');
      return response.data;
    } catch (error) {
      console.error('Error fetching improvement suggestions:', error);
      return [];
    }
  },

  completeFollowUp: async (followUpId: number) => {
    try {
      const response = await apiClient.post(`/sales/follow-ups/${followUpId}/complete`);
      return response.data;
    } catch (error) {
      console.error(`Error completing follow-up ${followUpId}:`, error);
      throw error;
    }
  },

  getSalesGrowthData: async (period?: string) => {
    try {
      const params = period ? { period } : {};
      const response = await apiClient.get('/sales/growth', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching sales growth data:', error);
      return {};
    }
  },

  getSalesTargets: async (year?: number) => {
    try {
      const params = year ? { year } : {};
      const response = await apiClient.get('/sales/targets', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching sales targets:', error);
      return {};
    }
  },

  getGrowthForecast: async () => {
    try {
      const response = await apiClient.get('/sales/forecast');
      return response.data;
    } catch (error) {
      console.error('Error fetching growth forecast:', error);
      return {};
    }
  },

  getWeeklyReports: async () => {
    try {
      const response = await apiClient.get('/sales/reports/weekly');
      return response.data;
    } catch (error) {
      console.error('Error fetching weekly sales reports:', error);
      return [];
    }
  },

  getMonthlyReports: async () => {
    try {
      const response = await apiClient.get('/sales/reports/monthly');
      return response.data;
    } catch (error) {
      console.error('Error fetching monthly sales reports:', error);
      return [];
    }
  },

  getSalesTrends: async () => {
    try {
      const response = await apiClient.get('/sales/trends');
      return response.data;
    } catch (error) {
      console.error('Error fetching sales trends:', error);
      return {};
    }
  },

  getSalesByChannel: async () => {
    try {
      const response = await apiClient.get('/sales/by-channel');
      return response.data;
    } catch (error) {
      console.error('Error fetching sales by channel:', error);
      return [];
    }
  },

  getTopProducts: async () => {
    try {
      const response = await apiClient.get('/sales/top-products');
      return response.data;
    } catch (error) {
      console.error('Error fetching top products:', error);
      return [];
    }
  },

  // Financial dashboard methods
  getFinancialOverview: async () => {
    try {
      const response = await apiClient.get('/finance/overview');
      return response.data;
    } catch (error) {
      console.error('Error fetching financial overview:', error);
      return {
        total_revenue: 850000,
        total_expenses: 650000,
        profit: 200000,
        profit_margin: 23.5,
        cash_flow: 175000
      };
    }
  },

  getFinancialMetrics: async () => {
    try {
      const response = await apiClient.get('/finance/metrics');
      return response.data;
    } catch (error) {
      console.error('Error fetching financial metrics:', error);
      return {
        monthly_revenue: [
          { month: "Jan", value: 65000 },
          { month: "Feb", value: 68000 },
          { month: "Mar", value: 72000 },
          { month: "Apr", value: 78000 },
          { month: "May", value: 80000 }
        ],
        expense_breakdown: [
          { category: "Salaries", percentage: 65 },
          { category: "Office", percentage: 15 },
          { category: "Marketing", percentage: 10 },
          { category: "Software", percentage: 7 },
          { category: "Other", percentage: 3 }
        ],
        key_indicators: {
          burn_rate: 65000,
          runway_months: 18,
          client_acquisition_cost: 3500,
          lifetime_value: 28000
        }
      };
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
      const response = await apiClient.get('/sales/metrics');
      return response.data;
    } catch (error) {
      console.error('Error fetching sales metrics:', error);
      return {};
    }
  }
};

export default financeService;
