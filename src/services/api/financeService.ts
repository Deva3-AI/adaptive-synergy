
import apiClient from '@/utils/apiUtils';

export interface Invoice {
  id: number;
  invoiceNumber: string;
  clientId: number;
  clientName: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue';
  createdAt: string;
}

export interface FinancialRecord {
  id: number;
  type: 'expense' | 'income';
  amount: number;
  description: string;
  date: string;
  category?: string;
}

export const financeService = {
  getInvoices: async (status?: string) => {
    try {
      const url = status ? `/invoices?status=${status}` : '/invoices';
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Get invoices error:', error);
      return [];
    }
  },
  
  getInvoiceDetails: async (invoiceId: number) => {
    try {
      const response = await apiClient.get(`/invoices/${invoiceId}`);
      return response.data;
    } catch (error) {
      console.error('Get invoice details error:', error);
      return null;
    }
  },
  
  createInvoice: async (invoiceData: any) => {
    try {
      const response = await apiClient.post('/invoices', invoiceData);
      return response.data;
    } catch (error) {
      console.error('Create invoice error:', error);
      throw error;
    }
  },
  
  updateInvoiceStatus: async (invoiceId: number, status: string) => {
    try {
      const response = await apiClient.put(`/invoices/${invoiceId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Update invoice status error:', error);
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
      console.error('Get revenue reports error:', error);
      return [];
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
      console.error('Get expense reports error:', error);
      return [];
    }
  },
  
  // Add missing methods
  getFinancialOverview: async () => {
    try {
      const response = await apiClient.get('/finance/overview');
      return response.data;
    } catch (error) {
      console.error('Get financial overview error:', error);
      return null;
    }
  },
  
  getFinancialMetrics: async (period?: string) => {
    try {
      const url = period ? `/finance/metrics?period=${period}` : '/finance/metrics';
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Get financial metrics error:', error);
      return {};
    }
  },
  
  getFinancialRecords: async (recordType?: string, startDate?: string, endDate?: string) => {
    try {
      let url = '/finance/records';
      const params = [];
      if (recordType) params.push(`type=${recordType}`);
      if (startDate) params.push(`startDate=${startDate}`);
      if (endDate) params.push(`endDate=${endDate}`);
      
      if (params.length > 0) {
        url += `?${params.join('&')}`;
      }
      
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Get financial records error:', error);
      return [];
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
  
  // Sales methods
  getSalesMetrics: async (dateRange: string) => {
    try {
      const response = await apiClient.get(`/finance/sales/metrics?range=${dateRange}`);
      return response.data;
    } catch (error) {
      console.error('Get sales metrics error:', error);
      return { 
        totalSales: 0, 
        salesGrowth: 0, 
        newCustomers: 0, 
        customerGrowth: 0,
        conversionRate: 0,
        averageOrderValue: 0
      };
    }
  },
  
  getSalesTrends: async (dateRange: string) => {
    try {
      const response = await apiClient.get(`/finance/sales/trends?range=${dateRange}`);
      return response.data;
    } catch (error) {
      console.error('Get sales trends error:', error);
      return [];
    }
  },
  
  getSalesByChannel: async (dateRange: string) => {
    try {
      const response = await apiClient.get(`/finance/sales/channels?range=${dateRange}`);
      return response.data;
    } catch (error) {
      console.error('Get sales by channel error:', error);
      return [];
    }
  },
  
  getTopProducts: async (dateRange: string) => {
    try {
      const response = await apiClient.get(`/finance/sales/top-products?range=${dateRange}`);
      return response.data;
    } catch (error) {
      console.error('Get top products error:', error);
      return [];
    }
  },
  
  getSalesGrowthData: async (dateRange: string) => {
    try {
      const response = await apiClient.get(`/finance/sales/growth?range=${dateRange}`);
      return response.data;
    } catch (error) {
      console.error('Get sales growth data error:', error);
      return { trends: [], currentPeriod: {}, growthDrivers: [] };
    }
  },
  
  getSalesTargets: async (dateRange: string) => {
    try {
      const response = await apiClient.get(`/finance/sales/targets?range=${dateRange}`);
      return response.data;
    } catch (error) {
      console.error('Get sales targets error:', error);
      return [];
    }
  },
  
  getGrowthForecast: async (dateRange: string) => {
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
      const response = await apiClient.get('/finance/reports/weekly');
      return response.data;
    } catch (error) {
      console.error('Get weekly reports error:', error);
      return [];
    }
  },
  
  getMonthlyReports: async () => {
    try {
      const response = await apiClient.get('/finance/reports/monthly');
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
      const response = await apiClient.put(`/finance/sales/follow-ups/${followUpId}/complete`, { feedback });
      return response.data;
    } catch (error) {
      console.error('Complete follow-up error:', error);
      throw error;
    }
  },
  
  analyzeTeamCosts: async (period: string) => {
    try {
      const response = await apiClient.get(`/finance/team-costs?period=${period}`);
      return response.data;
    } catch (error) {
      console.error('Analyze team costs error:', error);
      return { 
        costBreakdown: [], 
        teamUtilization: [], 
        costTrends: [], 
        optimizationOpportunities: [] 
      };
    }
  },
  
  sendInvoiceReminder: async (invoiceId: number) => {
    try {
      const response = await apiClient.post(`/invoices/${invoiceId}/remind`);
      return response.data;
    } catch (error) {
      console.error('Send invoice reminder error:', error);
      throw error;
    }
  }
};

export default financeService;
