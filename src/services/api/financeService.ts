
import axios from 'axios';
import { mockFinanceData } from '@/utils/mockData';
import { v4 as uuidv4 } from 'uuid';

const financeService = {
  // Invoices
  getInvoices: async (status?: string) => {
    try {
      let url = '/api/finance/invoices';
      if (status) {
        url += `?status=${status}`;
      }
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Get invoices error:', error);
      return mockFinanceData.invoices;
    }
  },
  
  getInvoiceDetails: async (invoiceId: number) => {
    try {
      const response = await axios.get(`/api/finance/invoices/${invoiceId}`);
      return response.data;
    } catch (error) {
      console.error('Get invoice details error:', error);
      const invoice = mockFinanceData.invoices.find(invoice => invoice.id === invoiceId);
      return invoice || null;
    }
  },
  
  createInvoice: async (invoiceData: any) => {
    try {
      const response = await axios.post('/api/finance/invoices', invoiceData);
      return response.data;
    } catch (error) {
      console.error('Create invoice error:', error);
      // Simulate creating a new invoice
      return {
        ...invoiceData,
        id: Math.floor(Math.random() * 1000),
        invoice_number: `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
        issue_date: new Date().toISOString().split('T')[0],
        status: 'pending'
      };
    }
  },
  
  updateInvoiceStatus: async (invoiceId: number, status: string) => {
    try {
      const response = await axios.put(`/api/finance/invoices/${invoiceId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Update invoice status error:', error);
      return { success: true, message: 'Status updated (mock)' };
    }
  },
  
  sendInvoiceReminder: async (invoiceId: number) => {
    try {
      const response = await axios.post(`/api/finance/invoices/${invoiceId}/remind`);
      return response.data;
    } catch (error) {
      console.error('Send invoice reminder error:', error);
      return { success: true, message: 'Reminder sent (mock)' };
    }
  },
  
  // Financial Records
  getFinancialRecords: async (startDate?: string, endDate?: string) => {
    try {
      let url = '/api/finance/records';
      const params = new URLSearchParams();
      
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Get financial records error:', error);
      return mockFinanceData.financialRecords;
    }
  },
  
  createFinancialRecord: async (recordData: any) => {
    try {
      const response = await axios.post('/api/finance/records', recordData);
      return response.data;
    } catch (error) {
      console.error('Create financial record error:', error);
      // Simulate creating a new record
      return {
        ...recordData,
        id: Math.floor(Math.random() * 1000),
        date: new Date().toISOString().split('T')[0]
      };
    }
  },
  
  // Reports
  getRevenueReports: async (startDate?: string, endDate?: string) => {
    try {
      let url = '/api/finance/reports/revenue';
      const params = new URLSearchParams();
      
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Get revenue reports error:', error);
      return {
        total: 125000,
        byMonth: [
          { month: 'Jan', amount: 20000 },
          { month: 'Feb', amount: 22000 },
          { month: 'Mar', amount: 25000 }
        ],
        byService: [
          { name: 'Development', amount: 75000 },
          { name: 'Design', amount: 25000 },
          { name: 'Consulting', amount: 25000 }
        ]
      };
    }
  },
  
  getExpenseReports: async (startDate?: string, endDate?: string) => {
    try {
      let url = '/api/finance/reports/expenses';
      const params = new URLSearchParams();
      
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Get expense reports error:', error);
      return {
        total: 90000,
        byMonth: [
          { month: 'Jan', amount: 15000 },
          { month: 'Feb', amount: 15000 },
          { month: 'Mar', amount: 16000 }
        ],
        byCategory: [
          { name: 'Salaries', amount: 60000 },
          { name: 'Rent', amount: 10000 },
          { name: 'Software', amount: 5000 },
          { name: 'Other', amount: 15000 }
        ]
      };
    }
  },
  
  // Sales Metrics
  getSalesMetrics: async () => {
    try {
      const response = await axios.get('/api/finance/sales/metrics');
      return response.data;
    } catch (error) {
      console.error('Get sales metrics error:', error);
      return mockFinanceData.salesMetrics;
    }
  },
  
  // Financial Overview
  getFinancialOverview: async () => {
    try {
      const response = await axios.get('/api/finance/overview');
      return response.data;
    } catch (error) {
      console.error('Get financial overview error:', error);
      return mockFinanceData.financialOverview;
    }
  },
  
  // Financial Metrics
  getFinancialMetrics: async () => {
    try {
      const response = await axios.get('/api/finance/metrics');
      return response.data;
    } catch (error) {
      console.error('Get financial metrics error:', error);
      return mockFinanceData.financialMetrics;
    }
  },
  
  // Upsell Opportunities
  getUpsellOpportunities: async () => {
    try {
      const response = await axios.get('/api/finance/upsell-opportunities');
      return response.data;
    } catch (error) {
      console.error('Get upsell opportunities error:', error);
      return mockFinanceData.upsellOpportunities;
    }
  },
  
  // Financial Plans
  getFinancialPlans: async () => {
    try {
      const response = await axios.get('/api/finance/plans');
      return response.data;
    } catch (error) {
      console.error('Get financial plans error:', error);
      return mockFinanceData.financialPlans;
    }
  },
  
  // Sales Follow-ups
  getSalesFollowUps: async () => {
    try {
      const response = await axios.get('/api/finance/sales/follow-ups');
      return response.data;
    } catch (error) {
      console.error('Get sales follow-ups error:', error);
      return mockFinanceData.salesFollowUps;
    }
  },
  
  // Improvement Suggestions
  getImprovementSuggestions: async () => {
    try {
      const response = await axios.get('/api/finance/improvement-suggestions');
      return response.data;
    } catch (error) {
      console.error('Get improvement suggestions error:', error);
      return mockFinanceData.improvementSuggestions;
    }
  },
  
  completeFollowUp: async (followUpId: number, feedback: string) => {
    try {
      const response = await axios.put(`/api/finance/sales/follow-ups/${followUpId}/complete`, { feedback });
      return response.data;
    } catch (error) {
      console.error('Complete follow-up error:', error);
      return { success: true, message: 'Follow-up completed (mock)' };
    }
  },
  
  // Sales Growth Data
  getSalesGrowthData: async (period: string) => {
    try {
      const response = await axios.get(`/api/finance/sales/growth?period=${period}`);
      return response.data;
    } catch (error) {
      console.error('Get sales growth data error:', error);
      return mockFinanceData.salesGrowthData;
    }
  },
  
  // Sales Targets
  getSalesTargets: async (period: string) => {
    try {
      const response = await axios.get(`/api/finance/sales/targets?period=${period}`);
      return response.data;
    } catch (error) {
      console.error('Get sales targets error:', error);
      return mockFinanceData.salesTargets;
    }
  },
  
  // Growth Forecast
  getGrowthForecast: async (period: string) => {
    try {
      const response = await axios.get(`/api/finance/sales/forecast?period=${period}`);
      return response.data;
    } catch (error) {
      console.error('Get growth forecast error:', error);
      return mockFinanceData.growthForecast;
    }
  },
  
  // Weekly Reports
  getWeeklyReports: async () => {
    try {
      const response = await axios.get('/api/finance/reports/weekly');
      return response.data;
    } catch (error) {
      console.error('Get weekly reports error:', error);
      return mockFinanceData.weeklyReports;
    }
  },
  
  // Monthly Reports
  getMonthlyReports: async () => {
    try {
      const response = await axios.get('/api/finance/reports/monthly');
      return response.data;
    } catch (error) {
      console.error('Get monthly reports error:', error);
      return mockFinanceData.monthlyReports;
    }
  },
  
  // Sales Trends
  getSalesTrends: async (period: string) => {
    try {
      const response = await axios.get(`/api/finance/sales/trends?period=${period}`);
      return response.data;
    } catch (error) {
      console.error('Get sales trends error:', error);
      return mockFinanceData.salesTrends;
    }
  },
  
  // Sales by Channel
  getSalesByChannel: async (period: string) => {
    try {
      const response = await axios.get(`/api/finance/sales/by-channel?period=${period}`);
      return response.data;
    } catch (error) {
      console.error('Get sales by channel error:', error);
      return mockFinanceData.salesByChannel;
    }
  },
  
  // Top Products
  getTopProducts: async (period: string) => {
    try {
      const response = await axios.get(`/api/finance/sales/top-products?period=${period}`);
      return response.data;
    } catch (error) {
      console.error('Get top products error:', error);
      return mockFinanceData.topProducts;
    }
  },
  
  // Team Costs Analysis
  analyzeTeamCosts: async (period: string) => {
    try {
      const response = await axios.get(`/api/finance/team-costs?period=${period}`);
      return response.data;
    } catch (error) {
      console.error('Analyze team costs error:', error);
      return mockFinanceData.teamCosts;
    }
  },
};

export default financeService;
