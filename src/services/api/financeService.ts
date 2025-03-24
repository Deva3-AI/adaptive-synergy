
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

export interface TeamCost {
  user_id: number;
  name: string;
  hours_worked: number;
  task_hours: number;
  productivity_ratio: number;
  cost: number;
}

export interface ClientCost {
  client_id: number;
  client_name: string;
  hours: number;
  cost: number;
  task_count: number;
}

export interface FinancialMetrics {
  total_revenue: number;
  total_expenses: number;
  net_profit: number;
  profit_margin: number;
  collection_rate: number;
  average_invoice_value: number;
  monthly_growth_rate: number;
  cash_flow: number;
  outstanding_invoices: number;
  health_status: 'excellent' | 'good' | 'satisfactory' | 'concerning' | 'critical';
}

export interface FinancialOverview {
  monthly_revenue: number;
  annual_target: number;
  growth_rate: number;
  client_acquisition: number;
  profit_margin: number;
  cash_flow_status: 'positive' | 'negative' | 'neutral';
  top_clients: Array<{client_name: string, revenue: number}>;
  monthly_trend: Array<{month: string, revenue: number, expenses?: number}>;
  sales_by_service: Array<{service: string, value: number}>;
}

export interface UpsellOpportunity {
  client_id: number;
  client_name: string;
  current_services: string[];
  suggested_services: string[];
  potential_value: number;
  confidence_score: number;
  last_purchase_date: string;
}

export interface FinancialPlan {
  plan_id: number;
  title: string;
  description: string;
  goals: {
    revenue_increase: number;
    cost_reduction: number;
    profit_margin_target: number;
  };
  strategies: Array<{
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    estimated_impact: number;
  }>;
  timeline: string;
  created_at: string;
  status: 'draft' | 'active' | 'completed';
}

const financeService = {
  // Invoice management
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
  
  sendInvoiceReminder: async (invoiceId: number) => {
    try {
      const response = await apiClient.post(`/finance/invoices/${invoiceId}/reminder`);
      return response.data;
    } catch (error) {
      console.error('Send invoice reminder error:', error);
      throw error;
    }
  },
  
  // Financial records
  getFinancialRecords: async (recordType?: string, startDate?: string, endDate?: string) => {
    try {
      let url = '/finance/financial-records';
      const params = new URLSearchParams();
      
      if (recordType) params.append('record_type', recordType);
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
  
  createFinancialRecord: async (recordData: Omit<FinancialRecord, 'record_id' | 'created_at'>) => {
    try {
      const response = await apiClient.post('/finance/financial-records', recordData);
      return response.data;
    } catch (error) {
      console.error('Create financial record error:', error);
      throw error;
    }
  },
  
  // Team cost analysis
  analyzeTeamCosts: async (startDate?: string, endDate?: string) => {
    try {
      let url = '/finance/analyze-cost';
      const params = new URLSearchParams();
      
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await apiClient.post(url);
      return response.data;
    } catch (error) {
      console.error('Analyze team costs error:', error);
      // Return mock data as fallback
      return {
        period: {
          start_date: startDate || '2023-06-01',
          end_date: endDate || '2023-06-30'
        },
        summary: {
          total_employees: 5,
          total_hours: 840,
          total_cost: 21000,
          total_task_hours: 756,
          productivity_ratio: 0.9
        },
        employee_data: [
          {
            user_id: 1,
            name: "John Doe",
            hours_worked: 168,
            task_hours: 150,
            productivity_ratio: 0.89,
            cost: 4200
          },
          {
            user_id: 2,
            name: "Jane Smith",
            hours_worked: 160,
            task_hours: 152,
            productivity_ratio: 0.95,
            cost: 4000
          }
        ],
        role_distribution: [
          {
            role: "Developer",
            count: 2,
            hours: 328,
            cost: 8200
          },
          {
            role: "Designer",
            count: 1,
            hours: 160,
            cost: 4000
          }
        ],
        client_costs: [
          {
            client_id: 1,
            client_name: "Social Land",
            hours: 320,
            cost: 8000,
            task_count: 15
          },
          {
            client_id: 2,
            client_name: "Koala Digital",
            hours: 280,
            cost: 7000,
            task_count: 12
          }
        ]
      };
    }
  },
  
  // Financial metrics and health
  getFinancialMetrics: async (timeframe: 'month' | 'quarter' | 'year' = 'month') => {
    try {
      const response = await apiClient.get(`/finance/financial-summary?timeframe=${timeframe}`);
      return response.data;
    } catch (error) {
      console.error('Get financial metrics error:', error);
      // Return mock data as fallback
      return {
        period: {
          start_date: '2023-04-01',
          end_date: '2023-06-30'
        },
        summary: {
          total_revenue: 85000,
          total_expenses: 52000,
          net_profit: 33000,
          profit_margin: 38.8
        },
        invoices: {
          total_invoiced: 95000,
          paid_invoices: 85000,
          pending_invoices: 8000,
          overdue_invoices: 2000,
          collection_rate: 89.5
        },
        monthly_breakdown: [
          {
            month: '2023-04',
            income: 28000,
            expense: 17000,
            profit: 11000
          },
          {
            month: '2023-05',
            income: 27000,
            expense: 16500,
            profit: 10500
          },
          {
            month: '2023-06',
            income: 30000,
            expense: 18500,
            profit: 11500
          }
        ],
        analysis: {
          financial_health: {
            status: 'good',
            explanation: 'Overall financial health is good with positive trends in revenue and profitability.'
          },
          key_insights: [
            'Revenue has increased by 7.1% in the last month',
            'Expenses have slightly increased but at a slower rate than revenue',
            'Collection rate is solid at 89.5%',
            'Overdue invoices are at a manageable level'
          ],
          areas_of_concern: [
            'Cash flow could be improved by reducing pending invoices'
          ],
          recommendations: [
            {
              area: 'Invoicing',
              action: 'Send reminders for pending invoices over 15 days old'
            },
            {
              area: 'Expenses',
              action: 'Review recurring software subscriptions for possible consolidation'
            }
          ]
        }
      };
    }
  },
  
  getFinancialOverview: async () => {
    try {
      const response = await apiClient.get('/finance/data');
      return response.data;
    } catch (error) {
      console.error('Get financial overview error:', error);
      // Return sample data as fallback
      return {
        monthly_revenue: 42500,
        annual_target: 500000,
        growth_rate: 8.5,
        client_acquisition: 3,
        profit_margin: 38.5,
        cash_flow_status: 'positive',
        top_clients: [
          { client_name: "Social Land", revenue: 12500 },
          { client_name: "Koala Digital", revenue: 9800 },
          { client_name: "Website Architect", revenue: 8750 },
          { client_name: "AC Digital", revenue: 7200 },
          { client_name: "Muse Digital", revenue: 4250 }
        ],
        monthly_trend: [
          { month: "Jan", revenue: 38000, expenses: 23000 },
          { month: "Feb", revenue: 39500, expenses: 24000 },
          { month: "Mar", revenue: 37800, expenses: 23500 },
          { month: "Apr", revenue: 40200, expenses: 24500 },
          { month: "May", revenue: 41100, expenses: 25000 },
          { month: "Jun", revenue: 42500, expenses: 26000 }
        ],
        sales_by_service: [
          { service: "Web Development", value: 35 },
          { service: "Graphic Design", value: 25 },
          { service: "SEO", value: 20 },
          { service: "Social Media", value: 15 },
          { service: "Content Writing", value: 5 }
        ]
      };
    }
  },
  
  // Upsell opportunities
  getUpsellOpportunities: async () => {
    try {
      const response = await apiClient.get('/finance/upsell-opportunities');
      return response.data;
    } catch (error) {
      console.error('Get upsell opportunities error:', error);
      // Return mock data as fallback
      return [
        {
          client_id: 1,
          client_name: "Social Land",
          current_services: ["Web Development", "SEO"],
          suggested_services: ["Social Media Management", "Content Creation"],
          potential_value: 2800,
          confidence_score: 0.85,
          last_purchase_date: "2023-05-15"
        },
        {
          client_id: 2,
          client_name: "Koala Digital",
          current_services: ["Graphic Design", "Web Development"],
          suggested_services: ["SEO", "PPC Advertising"],
          potential_value: 3500,
          confidence_score: 0.78,
          last_purchase_date: "2023-06-01"
        },
        {
          client_id: 3,
          client_name: "AC Digital",
          current_services: ["Web Development"],
          suggested_services: ["Maintenance Package", "SEO"],
          potential_value: 1800,
          confidence_score: 0.92,
          last_purchase_date: "2023-04-22"
        }
      ];
    }
  },
  
  // Financial improvement plans
  getFinancialPlans: async (status?: 'draft' | 'active' | 'completed') => {
    try {
      let url = '/finance/plans';
      if (status) {
        url += `?status=${status}`;
      }
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Get financial plans error:', error);
      // Return mock data as fallback
      return [
        {
          plan_id: 1,
          title: "Q3 Profitability Improvement",
          description: "Plan to increase profitability through cost optimization and revenue growth in Q3 2023",
          goals: {
            revenue_increase: 15,
            cost_reduction: 8,
            profit_margin_target: 45
          },
          strategies: [
            {
              title: "Optimize Service Delivery",
              description: "Streamline workflows to reduce hours spent on recurring tasks",
              priority: "high",
              estimated_impact: 5000
            },
            {
              title: "Focus on Upsell Opportunities",
              description: "Target existing clients for additional services",
              priority: "medium",
              estimated_impact: 8000
            },
            {
              title: "Review Software Subscriptions",
              description: "Audit and consolidate software tools",
              priority: "low",
              estimated_impact: 1200
            }
          ],
          timeline: "July - September 2023",
          created_at: "2023-06-15",
          status: "active"
        }
      ];
    }
  },
  
  createFinancialPlan: async (planData: Omit<FinancialPlan, 'plan_id' | 'created_at'>) => {
    try {
      const response = await apiClient.post('/finance/plans', planData);
      return response.data;
    } catch (error) {
      console.error('Create financial plan error:', error);
      throw error;
    }
  }
};

export default financeService;
