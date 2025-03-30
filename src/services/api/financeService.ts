
import { apiRequest } from "@/utils/apiUtils";
import { 
  mockFinancialRecords, 
  mockSalesTrends, 
  mockSalesByChannel, 
  mockTopProducts,
  mockSalesGrowthData,
  mockSalesTargets,
  mockGrowthForecast,
  mockSalesFollowUps,
  mockImprovementSuggestions,
  mockWeeklyReports,
  mockMonthlyReports
} from "@/utils/mockData";

// Types
export interface Invoice {
  id: number;
  client_id: number;
  invoice_number: string;
  amount: number;
  due_date: string;
  status: 'pending' | 'paid' | 'overdue';
  created_at: string;
  client_name?: string;
}

export interface FinancialRecord {
  id: number;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  date: string;
  category: string;
}

const financeService = {
  // Get invoices
  getInvoices: async (status?: string) => {
    const url = status ? `/invoices?status=${status}` : '/invoices';
    return apiRequest(url, 'get', undefined, []);
  },

  // Get invoice details
  getInvoiceDetails: async (invoiceId: number) => {
    return apiRequest(`/invoices/${invoiceId}`, 'get', undefined, {});
  },

  // Create invoice
  createInvoice: async (invoiceData: any) => {
    return apiRequest('/invoices', 'post', invoiceData, {});
  },

  // Update invoice status
  updateInvoiceStatus: async (invoiceId: number, status: string) => {
    return apiRequest(`/invoices/${invoiceId}/status`, 'put', { status }, {});
  },

  // Get revenue reports
  getRevenueReports: async (startDate?: string, endDate?: string) => {
    const url = startDate && endDate
      ? `/reports/revenue?start=${startDate}&end=${endDate}`
      : '/reports/revenue';
    return apiRequest(url, 'get', undefined, {});
  },

  // Get expense reports
  getExpenseReports: async (startDate?: string, endDate?: string) => {
    const url = startDate && endDate
      ? `/reports/expenses?start=${startDate}&end=${endDate}`
      : '/reports/expenses';
    return apiRequest(url, 'get', undefined, {});
  },

  // Get financial records
  getFinancialRecords: async (type?: string, startDate?: string, endDate?: string) => {
    let url = '/financial-records';
    if (type || startDate || endDate) {
      url += '?';
      if (type) url += `type=${type}&`;
      if (startDate) url += `start=${startDate}&`;
      if (endDate) url += `end=${endDate}`;
    }
    return apiRequest(url, 'get', undefined, mockFinancialRecords);
  },

  // Send invoice reminder
  sendInvoiceReminder: async (invoiceId: number, customMessage?: string) => {
    return apiRequest(`/invoices/${invoiceId}/remind`, 'post', { customMessage }, { success: true });
  },

  // Analyze team costs
  analyzeTeamCosts: async (period?: string) => {
    const url = period ? `/team-costs?period=${period}` : '/team-costs';
    return apiRequest(url, 'get', undefined, {
      total_cost: 250000,
      avg_cost_per_employee: 5000,
      cost_breakdown: [
        { category: "Salaries", amount: 200000 },
        { category: "Benefits", amount: 30000 },
        { category: "Equipment", amount: 15000 },
        { category: "Training", amount: 5000 }
      ],
      cost_trends: [
        { month: "Jan", value: 240000 },
        { month: "Feb", value: 242000 },
        { month: "Mar", value: 245000 },
        { month: "Apr", value: 248000 },
        { month: "May", value: 250000 }
      ]
    });
  },

  // Get sales trends
  getSalesTrends: async (period: string) => {
    return apiRequest(`/sales/trends?period=${period}`, 'get', undefined, mockSalesTrends);
  },

  // Get sales by channel
  getSalesByChannel: async (period: string) => {
    return apiRequest(`/sales/by-channel?period=${period}`, 'get', undefined, mockSalesByChannel);
  },

  // Get top products/services
  getTopProducts: async (period: string) => {
    return apiRequest(`/sales/top-products?period=${period}`, 'get', undefined, mockTopProducts);
  },

  // Get sales growth data
  getSalesGrowthData: async (period: string) => {
    return apiRequest(`/sales/growth?period=${period}`, 'get', undefined, mockSalesGrowthData);
  },

  // Get sales targets
  getSalesTargets: async (period: string) => {
    return apiRequest(`/sales/targets?period=${period}`, 'get', undefined, mockSalesTargets);
  },

  // Get growth forecast
  getGrowthForecast: async (period: string) => {
    return apiRequest(`/sales/forecast?period=${period}`, 'get', undefined, mockGrowthForecast);
  },

  // Get sales follow-ups
  getSalesFollowUps: async () => {
    return apiRequest('/sales/follow-ups', 'get', undefined, mockSalesFollowUps);
  },

  // Get improvement suggestions
  getImprovementSuggestions: async () => {
    return apiRequest('/sales/improvements', 'get', undefined, mockImprovementSuggestions);
  },

  // Complete follow-up
  completeFollowUp: async (followUpId: number, outcome: string, notes?: string) => {
    return apiRequest(`/sales/follow-ups/${followUpId}/complete`, 'post', { outcome, notes }, { success: true });
  },

  // Get weekly reports
  getWeeklyReports: async () => {
    return apiRequest('/sales/weekly-reports', 'get', undefined, mockWeeklyReports || []);
  },

  // Get monthly reports
  getMonthlyReports: async () => {
    return apiRequest('/sales/monthly-reports', 'get', undefined, mockMonthlyReports || []);
  },

  // Get financial overview
  getFinancialOverview: async (period?: string) => {
    const url = period ? `/financial/overview?period=${period}` : '/financial/overview';
    return apiRequest(url, 'get', undefined, {
      total_revenue: 450000,
      total_expenses: 320000,
      profit: 130000,
      revenue_growth: 15,
      expense_growth: 8,
      profit_margin: 28.9,
      cash_flow: 110000
    });
  },

  // Get financial metrics
  getFinancialMetrics: async (period?: string) => {
    const url = period ? `/financial/metrics?period=${period}` : '/financial/metrics';
    return apiRequest(url, 'get', undefined, {
      revenue_per_employee: 50000,
      cost_per_acquisition: 2500,
      lifetime_value: 25000,
      burn_rate: 35000,
      runway: 12,
      roi: 175
    });
  },

  // Get upsell opportunities
  getUpsellOpportunities: async () => {
    return apiRequest('/sales/upsell-opportunities', 'get', undefined, [
      {
        client_id: 1,
        client_name: "Social Land",
        current_services: ["Web Design", "SEO"],
        recommended_services: ["Content Marketing", "Social Media Management"],
        estimated_value: 15000,
        probability: 0.7
      },
      {
        client_id: 2,
        client_name: "Koala Digital",
        current_services: ["Social Media Management"],
        recommended_services: ["Email Marketing", "PPC Advertising"],
        estimated_value: 12000,
        probability: 0.6
      }
    ]);
  },

  // Get financial plans
  getFinancialPlans: async () => {
    return apiRequest('/financial/plans', 'get', undefined, [
      {
        id: 1,
        title: "Q4 Investment Plan",
        description: "Strategy for reinvesting Q3 profits",
        created_at: "2023-09-01",
        categories: [
          { name: "Technology", percentage: 40 },
          { name: "Training", percentage: 25 },
          { name: "Marketing", percentage: 20 },
          { name: "Reserve", percentage: 15 }
        ]
      },
      {
        id: 2,
        title: "Annual Budget Forecast",
        description: "Projected budget for next fiscal year",
        created_at: "2023-08-15",
        categories: [
          { name: "Operations", percentage: 50 },
          { name: "Growth", percentage: 30 },
          { name: "R&D", percentage: 15 },
          { name: "Miscellaneous", percentage: 5 }
        ]
      }
    ]);
  },

  // Get sales metrics
  getSalesMetrics: async (period?: string) => {
    const url = period ? `/sales/metrics?period=${period}` : '/sales/metrics';
    return apiRequest(url, 'get', undefined, {
      total_sales: 450000,
      new_clients: 15,
      repeat_business: 320000,
      average_deal_size: 12500,
      conversion_rate: 25,
      sales_cycle_length: 45
    });
  }
};

export default financeService;
