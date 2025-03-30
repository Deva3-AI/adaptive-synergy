import apiClient from '@/utils/apiUtils';

// Define the interfaces for finance-related data
export interface Invoice {
  id: number;
  invoice_id: number;
  clientId: number;
  client_id: number;
  clientName: string;
  client_name: string;
  invoiceNumber: string;
  invoice_number: string;
  amount: number;
  dueDate: string;
  due_date: string;
  status: 'pending' | 'paid' | 'overdue';
  createdAt: string;
}

export interface FinancialRecord {
  id: number;
  record_id: number;
  recordType: 'expense' | 'income';
  amount: number;
  description: string;
  recordDate: string;
  record_date: string;
  createdAt: string;
}

export const financeService = {
  // Invoice methods
  getInvoices: async (status?: string) => {
    try {
      const params = status ? { status } : {};
      const response = await apiClient.get('/invoices', { params });
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
      const response = await apiClient.patch(`/invoices/${invoiceId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Update invoice status error:', error);
      throw error;
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
  },

  // Financial reporting methods
  getRevenueReports: async (startDate?: string, endDate?: string) => {
    try {
      const params = { start_date: startDate, end_date: endDate };
      const response = await apiClient.get('/financial-summary', { params });
      return response.data;
    } catch (error) {
      console.error('Get revenue reports error:', error);
      return null;
    }
  },

  getExpenseReports: async (startDate?: string, endDate?: string) => {
    try {
      const params = { start_date: startDate, end_date: endDate, type: 'expense' };
      const response = await apiClient.get('/financial-records', { params });
      return response.data;
    } catch (error) {
      console.error('Get expense reports error:', error);
      return [];
    }
  },

  // Financial records methods
  getFinancialRecords: async (recordType?: string, startDate?: string, endDate?: string) => {
    try {
      const params = { 
        record_type: recordType, 
        start_date: startDate, 
        end_date: endDate 
      };
      const response = await apiClient.get('/financial-records', { params });
      return response.data;
    } catch (error) {
      console.error('Get financial records error:', error);
      // Return mock data for development
      return [
        { id: 1, record_id: 1, recordType: 'income', amount: 12500, description: 'Client payment - Project A', recordDate: '2023-09-15', record_date: '2023-09-15', createdAt: '2023-09-15T12:00:00Z' },
        { id: 2, record_id: 2, recordType: 'expense', amount: 4300, description: 'Software licenses', recordDate: '2023-09-10', record_date: '2023-09-10', createdAt: '2023-09-10T15:30:00Z' },
        { id: 3, record_id: 3, recordType: 'income', amount: 8750, description: 'Client payment - Project B', recordDate: '2023-09-05', record_date: '2023-09-05', createdAt: '2023-09-05T09:45:00Z' },
      ];
    }
  },

  // Financial analysis methods
  getFinancialOverview: async () => {
    try {
      const response = await apiClient.get('/financial-summary');
      return response.data;
    } catch (error) {
      console.error('Get financial overview error:', error);
      // Return mock data for development
      return {
        total_revenue: 145000,
        total_expenses: 98000,
        profit: 47000,
        profit_margin: 32.4,
        monthly_growth: 8.2,
        outstanding_invoices: 28000,
        balance: 76500
      };
    }
  },

  getFinancialMetrics: async (period: string) => {
    try {
      const response = await apiClient.get('/financial-summary', { params: { period } });
      return response.data;
    } catch (error) {
      console.error('Get financial metrics error:', error);
      // Return mock data for development
      return {
        revenue: { 
          label: 'Revenue', 
          value: 145000, 
          formatted_value: '$145,000', 
          growth_rate: 8.2 
        },
        expenses: { 
          label: 'Expenses', 
          value: 98000, 
          formatted_value: '$98,000', 
          growth_rate: 5.7 
        },
        profit: { 
          label: 'Profit', 
          value: 47000, 
          formatted_value: '$47,000', 
          growth_rate: 12.4 
        },
        cash_flow: { 
          label: 'Cash Flow', 
          value: 38500, 
          formatted_value: '$38,500', 
          growth_rate: -2.3 
        }
      };
    }
  },

  getUpsellOpportunities: async () => {
    try {
      // In a production environment, this would be a real API endpoint
      // Mocking data for development purposes
      return [
        { id: 1, clientId: 1, description: 'Add Premium Support Package', potentialRevenue: 1200 },
        { id: 2, clientId: 2, description: 'Upgrade to Advanced Analytics', potentialRevenue: 2400 },
        { id: 3, clientId: 3, description: 'Add Additional User Licenses', potentialRevenue: 800 }
      ];
    } catch (error) {
      console.error('Get upsell opportunities error:', error);
      return [];
    }
  },

  analyzeTeamCosts: async (period: string) => {
    try {
      const response = await apiClient.post('/analyze-cost', { period });
      return response.data;
    } catch (error) {
      console.error('Analyze team costs error:', error);
      // Return mock data for development
      return {
        total_cost: 125000,
        avg_cost_per_employee: 6250,
        total_employees: 20,
        trend_percentage: 5.2,
        departments: [
          { name: 'Development', headcount: 8, cost: 56000, percentage: 44.8, yoy_change: 3.2 },
          { name: 'Design', headcount: 4, cost: 28000, percentage: 22.4, yoy_change: -1.5 },
          { name: 'Marketing', headcount: 3, cost: 18000, percentage: 14.4, yoy_change: 8.7 },
          { name: 'Management', headcount: 2, cost: 16000, percentage: 12.8, yoy_change: 0 },
          { name: 'HR', headcount: 1, cost: 7000, percentage: 5.6, yoy_change: 0 }
        ],
        trend: [
          { period: 'Jan', total_cost: 120000, avg_cost: 6000 },
          { period: 'Feb', total_cost: 122000, avg_cost: 6100 },
          { period: 'Mar', total_cost: 121500, avg_cost: 6075 },
          { period: 'Apr', total_cost: 123000, avg_cost: 6150 },
          { period: 'May', total_cost: 124000, avg_cost: 6200 },
          { period: 'Jun', total_cost: 125000, avg_cost: 6250 }
        ],
        efficiency: [
          { name: 'Development', efficiency: 93.2 },
          { name: 'Design', efficiency: 88.7 },
          { name: 'Marketing', efficiency: 79.5 },
          { name: 'Management', efficiency: 95.0 },
          { name: 'HR', efficiency: 82.3 }
        ],
        optimization_opportunities: [
          { department: 'Marketing', description: 'Consolidate marketing tools and subscriptions', potential_savings: 2500 },
          { department: 'Design', description: 'Transition to more cost-effective design software', potential_savings: 1800 }
        ],
        insights: [
          'Development team has the highest efficiency score and represents the largest share of team costs',
          'Marketing costs have increased 8.7% compared to last year',
          'Design team costs have decreased by 1.5% while maintaining high efficiency',
          'Implementing the identified optimization opportunities could save $4,300 annually'
        ]
      };
    }
  },

  // Sales finance methods
  getSalesMetrics: async (period: string) => {
    try {
      const response = await apiClient.get('/sales/metrics', { params: { period } });
      return response.data;
    } catch (error) {
      console.error('Get sales metrics error:', error);
      return {
        totalSales: 324500,
        salesGrowth: 7.5,
        newCustomers: 36,
        customerGrowth: 12.3,
        conversionRate: 3.8,
        conversionGrowth: 0.5,
        averageSale: 9000,
        averageSaleGrowth: 4.2
      };
    }
  },

  getSalesFollowUps: async () => {
    try {
      const response = await apiClient.get('/sales/follow-ups');
      return response.data;
    } catch (error) {
      console.error('Get sales follow-ups error:', error);
      return [
        {
          id: 1,
          clientName: "Acme Corp",
          contactPerson: "John Smith",
          type: "call",
          dueDate: "2023-10-15",
          phone: "555-123-4567",
          email: "john@acmecorp.com",
          notes: "Follow up about expanding their current package with additional analytics",
          status: "pending"
        },
        {
          id: 2,
          clientName: "TechNova",
          contactPerson: "Sarah Jones",
          type: "email",
          dueDate: "2023-10-12",
          email: "sarah@technova.com",
          notes: "Send proposal for redesign project",
          status: "pending"
        }
      ];
    }
  },

  getImprovementSuggestions: async () => {
    try {
      const response = await apiClient.get('/sales/improvement-suggestions');
      return response.data;
    } catch (error) {
      console.error('Get improvement suggestions error:', error);
      return [
        {
          id: 1,
          title: "Optimize Follow-up Schedule",
          description: "Data shows clients are more responsive when contacted 3-5 days after initial meeting",
          priority: "high"
        },
        {
          id: 2,
          title: "Enhance Proposal Templates",
          description: "Including case studies has increased conversion rates by 15% in similar industries",
          priority: "medium"
        }
      ];
    }
  },

  completeFollowUp: async (followUpId: number, feedback?: string) => {
    try {
      const response = await apiClient.post(`/sales/follow-ups/${followUpId}/complete`, { feedback });
      return response.data;
    } catch (error) {
      console.error('Complete follow-up error:', error);
      return { success: true };
    }
  },

  getSalesGrowthData: async (period: string) => {
    try {
      const response = await apiClient.get('/sales/growth', { params: { period } });
      return response.data;
    } catch (error) {
      console.error('Get sales growth data error:', error);
      return {
        currentPeriod: {
          revenueGrowth: 12.5,
          customerGrowth: 8.3
        },
        growthDrivers: [
          { factor: "New Product Line", impact: 45, performance: "positive" },
          { factor: "Marketing Campaign", impact: 30, performance: "positive" },
          { factor: "Market Expansion", impact: 15, performance: "neutral" },
          { factor: "Pricing Strategy", impact: 10, performance: "negative" }
        ],
        trends: [
          { period: "Jan", value: 35000 },
          { period: "Feb", value: 42000 },
          { period: "Mar", value: 38000 },
          { period: "Apr", value: 40000 },
          { period: "May", value: 45000 },
          { period: "Jun", value: 52000 }
        ]
      };
    }
  },

  getSalesTargets: async (period: string) => {
    try {
      const response = await apiClient.get('/sales/targets', { params: { period } });
      return response.data;
    } catch (error) {
      console.error('Get sales targets error:', error);
      return [
        { id: 1, category: "Total Revenue", current: 285000, target: 350000, percentage: 81 },
        { id: 2, category: "New Customers", current: 32, target: 40, percentage: 80 },
        { id: 3, category: "Upsells", current: 95000, target: 120000, percentage: 79 },
        { id: 4, category: "Retention Rate", current: 92, target: 95, percentage: 97 }
      ];
    }
  },

  getGrowthForecast: async (period: string) => {
    try {
      const response = await apiClient.get('/sales/forecast', { params: { period } });
      return response.data;
    } catch (error) {
      console.error('Get growth forecast error:', error);
      return {
        chart: [
          { month: "Jul", predicted: 57000, target: 60000 },
          { month: "Aug", predicted: 62000, target: 65000 },
          { month: "Sep", predicted: 68000, target: 70000 },
          { month: "Oct", predicted: 72000, target: 75000 },
          { month: "Nov", predicted: 78000, target: 80000 },
          { month: "Dec", predicted: 85000, target: 90000 }
        ],
        insights: [
          { 
            type: "trend", 
            text: "Revenue is projected to grow by 15% in the next quarter based on current trends" 
          },
          { 
            type: "warning", 
            text: "Q4 projections may be impacted by seasonal fluctuations in the industry" 
          },
          { 
            type: "trend", 
            text: "Customer acquisition cost is expected to decrease as marketing efficiency improves" 
          }
        ]
      };
    }
  },

  getSalesTrends: async (period: string) => {
    try {
      const response = await apiClient.get('/sales/trends', { params: { period } });
      return response.data;
    } catch (error) {
      console.error('Get sales trends error:', error);
      return {
        data: [
          { month: "Jan", value: 35000 },
          { month: "Feb", value: 42000 },
          { month: "Mar", value: 38000 },
          { month: "Apr", value: 40000 },
          { month: "May", value: 45000 },
          { month: "Jun", value: 52000 }
        ],
        insights: [
          "Sales have consistently grown month-over-month with an average increase of 8.2%",
          "The new product line launched in February contributed to a 20% spike in revenue",
          "Enterprise client segment has shown the highest growth at 15% compared to SMB at 6%",
          "Average deal size has increased by 12% from $8,000 to $9,000"
        ],
        activities: [
          { id: 1, title: "Quarterly Business Review - Acme Corp", date: "Jul 15, 2023", time: "10:00 AM" },
          { id: 2, title: "New Product Demo - TechNova", date: "Jul 18, 2023", time: "2:30 PM" },
          { id: 3, title: "Contract Renewal - Global Media", date: "Jul 21, 2023", time: "11:00 AM" }
        ]
      };
    }
  },

  getSalesByChannel: async (period: string) => {
    try {
      const response = await apiClient.get('/sales/channels', { params: { period } });
      return response.data;
    } catch (error) {
      console.error('Get sales by channel error:', error);
      return [
        { name: "Direct Sales", value: 45 },
        { name: "Partner Network", value: 25 },
        { name: "Online", value: 15 },
        { name: "Referrals", value: 10 },
        { name: "Events", value: 5 }
      ];
    }
  },

  getTopProducts: async (period: string) => {
    try {
      const response = await apiClient.get('/sales/top-products', { params: { period } });
      return response.data;
    } catch (error) {
      console.error('Get top products error:', error);
      return [
        { id: 1, name: "Enterprise Suite", sales: 125, units: 25, revenue: 125000, growth: 12.5 },
        { id: 2, name: "Analytics Platform", sales: 85, units: 85, revenue: 85000, growth: 18.3 },
        { id: 3, name: "Support Package", sales: 65, units: 65, revenue: 32500, growth: 5.2 },
        { id: 4, name: "Training Services", sales: 45, units: 45, revenue: 27000, growth: -2.1 },
        { id: 5, name: "Custom Integration", sales: 25, units: 10, revenue: 50000, growth: 22.7 }
      ];
    }
  },

  getWeeklyReports: async () => {
    try {
      const response = await apiClient.get('/sales/reports/weekly');
      return response.data;
    } catch (error) {
      console.error('Get weekly reports error:', error);
      return [
        {
          id: 1,
          title: "Weekly Sales Report",
          period: "Jul 3-9, 2023",
          sales: 82500,
          target: 80000,
          progress: 103,
          performanceData: [
            { day: "Mon", sales: 12000, target: 12000 },
            { day: "Tue", sales: 15500, target: 12000 },
            { day: "Wed", sales: 11000, target: 12000 },
            { day: "Thu", sales: 16500, target: 12000 },
            { day: "Fri", sales: 18500, target: 12000 },
            { day: "Sat", sales: 5000, target: 10000 },
            { day: "Sun", sales: 4000, target: 10000 }
          ],
          metrics: {
            conversionRate: 3.8,
            prevConversionRate: 3.5,
            avgSaleValue: 9500,
            prevAvgSaleValue: 9000,
            newLeads: 48,
            prevNewLeads: 42,
            closedDeals: 12,
            prevClosedDeals: 10
          }
        },
        {
          id: 2,
          title: "Weekly Sales Report",
          period: "Jun 26-Jul 2, 2023",
          sales: 78000,
          target: 80000,
          progress: 97,
          performanceData: [
            { day: "Mon", sales: 11000, target: 12000 },
            { day: "Tue", sales: 13500, target: 12000 },
            { day: "Wed", sales: 12000, target: 12000 },
            { day: "Thu", sales: 14500, target: 12000 },
            { day: "Fri", sales: 16000, target: 12000 },
            { day: "Sat", sales: 6000, target: 10000 },
            { day: "Sun", sales: 5000, target: 10000 }
          ]
        }
      ];
    }
  },

  getMonthlyReports: async () => {
    try {
      const response = await apiClient.get('/sales/reports/monthly');
      return response.data;
    } catch (error) {
      console.error('Get monthly reports error:', error);
      return [
        {
          id: 1,
          title: "Monthly Sales Report",
          period: "June 2023",
          sales: 342000,
          target: 320000,
          progress: 107,
          yearlyTrend: [
            { month: "Jan", sales: 290000, target: 300000 },
            { month: "Feb", sales: 310000, target: 300000 },
            { month: "Mar", sales: 295000, target: 300000 },
            { month: "Apr", sales: 315000, target: 310000 },
            { month: "May", sales: 330000, target: 310000 },
            { month: "Jun", sales: 342000, target: 320000 },
            { month: "Jul", sales: 0, target: 320000 },
            { month: "Aug", sales: 0, target: 330000 },
            { month: "Sep", sales: 0, target: 330000 },
            { month: "Oct", sales: 0, target: 340000 },
            { month: "Nov", sales: 0, target: 340000 },
            { month: "Dec", sales: 0, target: 350000 }
          ]
        },
        {
          id: 2,
          title: "Monthly Sales Report",
          period: "May 2023",
          sales: 330000,
          target: 310000,
          progress: 106
        }
      ];
    }
  },

  getFinancialPlans: async () => {
    try {
      const response = await apiClient.get('/financial-plans');
      return response.data;
    } catch (error) {
      console.error('Get financial plans error:', error);
      return [
        {
          id: 1,
          title: "Q3 Financial Strategy",
          description: "Optimizing resource allocation and improving cash flow management",
          goals: [
            "Increase profit margin by 2%",
            "Reduce operational expenses by 5%",
            "Improve invoice payment time by 15%"
          ],
          createdAt: "2023-06-28T10:00:00Z"
        },
        {
          id: 2,
          title: "Annual Budget Planning",
          description: "Comprehensive budget allocation for the next fiscal year",
          goals: [
            "Establish department budgets with 10% growth factor",
            "Allocate 15% of revenue to R&D initiatives",
            "Set aside contingency fund of 8% of total budget"
          ],
          createdAt: "2023-06-15T14:30:00Z"
        }
      ];
    }
  }
};
