
import axios from 'axios';
import { SalesData, GrowthForecast } from '@/interfaces/finance';
import config from '@/config/config';

// Helper function to format mock data dates
const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Create base financeService
const financeService = {
  // Original methods
  getInvoices: async (status?: string) => {
    try {
      // For now, return mock data
      return getMockInvoices(status);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      throw error;
    }
  },

  getInvoiceDetails: async (invoiceId: number) => {
    try {
      // For now, return mock data
      return getMockInvoiceDetails(invoiceId);
    } catch (error) {
      console.error('Error fetching invoice details:', error);
      throw error;
    }
  },

  createInvoice: async (invoiceData: any) => {
    try {
      // Mock API call
      return { ...invoiceData, invoice_id: Date.now(), created_at: new Date().toISOString() };
    } catch (error) {
      console.error('Error creating invoice:', error);
      throw error;
    }
  },

  updateInvoiceStatus: async (invoiceId: number, status: string) => {
    try {
      // Mock API call
      return { invoice_id: invoiceId, status, updated_at: new Date().toISOString() };
    } catch (error) {
      console.error('Error updating invoice status:', error);
      throw error;
    }
  },

  getRevenueReports: async (startDate?: string, endDate?: string) => {
    try {
      // For now, return mock data
      return getMockRevenueReports(startDate, endDate);
    } catch (error) {
      console.error('Error fetching revenue reports:', error);
      throw error;
    }
  },

  getExpenseReports: async (startDate?: string, endDate?: string) => {
    try {
      // For now, return mock data
      return getMockExpenseReports(startDate, endDate);
    } catch (error) {
      console.error('Error fetching expense reports:', error);
      throw error;
    }
  },

  // New methods to resolve errors
  getFinancialRecords: async (type?: string, startDate?: string, endDate?: string) => {
    try {
      // For now, return mock data
      return getMockFinancialRecords(type, startDate, endDate);
    } catch (error) {
      console.error('Error fetching financial records:', error);
      throw error;
    }
  },

  createFinancialRecord: async (recordData: any) => {
    try {
      // Mock API call
      return { ...recordData, record_id: Date.now(), created_at: new Date().toISOString() };
    } catch (error) {
      console.error('Error creating financial record:', error);
      throw error;
    }
  },

  sendInvoiceReminder: async (invoiceId: number) => {
    try {
      // Mock API call
      return { success: true, message: 'Reminder sent successfully', invoice_id: invoiceId };
    } catch (error) {
      console.error('Error sending invoice reminder:', error);
      throw error;
    }
  },

  getSalesMetrics: async (period: string = 'month') => {
    try {
      // For now, return mock data
      return getMockSalesMetrics(period);
    } catch (error) {
      console.error('Error fetching sales metrics:', error);
      throw error;
    }
  },

  analyzeTeamCosts: async (period: string = 'month') => {
    try {
      // For now, return mock data
      return getMockTeamCostsAnalysis(period);
    } catch (error) {
      console.error('Error analyzing team costs:', error);
      throw error;
    }
  },

  getSalesFollowUps: async () => {
    try {
      // For now, return mock data
      return getMockSalesFollowUps();
    } catch (error) {
      console.error('Error fetching sales follow-ups:', error);
      throw error;
    }
  },

  getImprovementSuggestions: async () => {
    try {
      // For now, return mock data
      return getMockImprovementSuggestions();
    } catch (error) {
      console.error('Error fetching improvement suggestions:', error);
      throw error;
    }
  },

  completeFollowUp: async (followUpId: number) => {
    try {
      // Mock API call
      return { success: true, follow_up_id: followUpId, completed_at: new Date().toISOString() };
    } catch (error) {
      console.error('Error completing follow-up:', error);
      throw error;
    }
  },

  getSalesGrowthData: async (dateRange: string) => {
    try {
      // For now, return mock data
      return getMockSalesGrowthData(dateRange);
    } catch (error) {
      console.error('Error fetching sales growth data:', error);
      throw error;
    }
  },

  getSalesTargets: async (dateRange: string) => {
    try {
      // For now, return mock data
      return getMockSalesTargets(dateRange);
    } catch (error) {
      console.error('Error fetching sales targets:', error);
      throw error;
    }
  },

  getGrowthForecast: async (dateRange: string): Promise<GrowthForecast> => {
    try {
      // For now, return mock data
      return getMockGrowthForecast(dateRange);
    } catch (error) {
      console.error('Error fetching growth forecast:', error);
      throw error as Error;
    }
  },

  getWeeklyReports: async () => {
    try {
      // For now, return mock data
      return getMockWeeklyReports();
    } catch (error) {
      console.error('Error fetching weekly reports:', error);
      throw error;
    }
  },

  getMonthlyReports: async () => {
    try {
      // For now, return mock data
      return getMockMonthlyReports();
    } catch (error) {
      console.error('Error fetching monthly reports:', error);
      throw error;
    }
  },

  getSalesTrends: async (dateRange: string) => {
    try {
      // For now, return mock data
      return getMockSalesTrends(dateRange);
    } catch (error) {
      console.error('Error fetching sales trends:', error);
      throw error;
    }
  },

  getSalesByChannel: async (dateRange: string) => {
    try {
      // For now, return mock data
      return getMockSalesByChannel(dateRange);
    } catch (error) {
      console.error('Error fetching sales by channel:', error);
      throw error;
    }
  },

  getTopProducts: async (dateRange: string) => {
    try {
      // For now, return mock data
      return getMockTopProducts(dateRange);
    } catch (error) {
      console.error('Error fetching top products:', error);
      throw error;
    }
  },

  getFinancialOverview: async () => {
    try {
      // For now, return mock data
      return getMockFinancialOverview();
    } catch (error) {
      console.error('Error fetching financial overview:', error);
      throw error;
    }
  },

  getFinancialMetrics: async (period: 'month' | 'quarter' | 'year') => {
    try {
      // For now, return mock data
      return getMockFinancialMetrics(period);
    } catch (error) {
      console.error('Error fetching financial metrics:', error);
      throw error;
    }
  },

  getUpsellOpportunities: async () => {
    try {
      // For now, return mock data
      return getMockUpsellOpportunities();
    } catch (error) {
      console.error('Error fetching upsell opportunities:', error);
      throw error;
    }
  },

  getFinancialPlans: async () => {
    try {
      // For now, return mock data
      return getMockFinancialPlans();
    } catch (error) {
      console.error('Error fetching financial plans:', error);
      throw error;
    }
  }
};

// Mock data functions
const getMockInvoices = (status?: string) => {
  const invoices = [
    {
      invoice_id: 1,
      client_id: 1,
      client_name: 'Acme Corp',
      invoice_number: 'INV-001',
      amount: 1500.00,
      due_date: '2023-04-15',
      status: 'paid',
      created_at: '2023-03-15T10:00:00Z',
    },
    {
      invoice_id: 2,
      client_id: 2,
      client_name: 'TechStart Inc',
      invoice_number: 'INV-002',
      amount: 2200.00,
      due_date: '2023-04-30',
      status: 'pending',
      created_at: '2023-03-30T11:30:00Z',
    },
    {
      invoice_id: 3,
      client_id: 3,
      client_name: 'Global Services',
      invoice_number: 'INV-003',
      amount: 3100.00,
      due_date: '2023-04-10',
      status: 'overdue',
      created_at: '2023-03-10T09:45:00Z',
    }
  ];

  if (status) {
    return invoices.filter(inv => inv.status === status);
  }
  
  return invoices;
};

const getMockInvoiceDetails = (invoiceId: number) => {
  const invoices = getMockInvoices();
  const invoice = invoices.find(inv => inv.invoice_id === invoiceId);
  
  if (!invoice) {
    throw new Error('Invoice not found');
  }
  
  return {
    ...invoice,
    items: [
      { 
        item_id: 1, 
        description: 'Web Development', 
        quantity: 20, 
        unit_price: 75.00, 
        total: 1500.00 
      }
    ],
    notes: 'Thank you for your business!',
    payment_terms: 'Net 30',
    subtotal: 1500.00,
    tax: 0.00,
    total: 1500.00
  };
};

const getMockRevenueReports = (startDate?: string, endDate?: string) => {
  // Mock revenue data - in a real implementation, this would be filtered by date
  return {
    total_revenue: 25000.00,
    comparison_to_previous: {
      percentage: 15,
      amount: 3750.00
    },
    by_client: [
      { client_id: 1, client_name: 'Acme Corp', amount: 12000.00 },
      { client_id: 2, client_name: 'TechStart Inc', amount: 8000.00 },
      { client_id: 3, client_name: 'Global Services', amount: 5000.00 }
    ],
    by_month: [
      { month: 'Jan', amount: 18000.00 },
      { month: 'Feb', amount: 21000.00 },
      { month: 'Mar', amount: 25000.00 }
    ]
  };
};

const getMockExpenseReports = (startDate?: string, endDate?: string) => {
  // Mock expense data - in a real implementation, this would be filtered by date
  return {
    total_expenses: 15000.00,
    comparison_to_previous: {
      percentage: 5,
      amount: 750.00
    },
    by_category: [
      { category: 'Salaries', amount: 10000.00 },
      { category: 'Tools & Software', amount: 3000.00 },
      { category: 'Office', amount: 2000.00 }
    ],
    by_month: [
      { month: 'Jan', amount: 14000.00 },
      { month: 'Feb', amount: 14500.00 },
      { month: 'Mar', amount: 15000.00 }
    ]
  };
};

const getMockFinancialRecords = (type?: string, startDate?: string, endDate?: string) => {
  // Mock financial records - in a real implementation, this would be filtered by type and date
  const records = [
    {
      record_id: 1,
      record_type: 'expense',
      amount: 1200.00,
      description: 'Software Subscriptions',
      record_date: '2023-03-05',
      created_at: '2023-03-05T14:00:00Z'
    },
    {
      record_id: 2,
      record_type: 'income',
      amount: 3500.00,
      description: 'Web Development Services',
      record_date: '2023-03-10',
      created_at: '2023-03-10T11:30:00Z'
    },
    {
      record_id: 3,
      record_type: 'expense',
      amount: 800.00,
      description: 'Office Supplies',
      record_date: '2023-03-15',
      created_at: '2023-03-15T16:45:00Z'
    }
  ];

  if (type) {
    return records.filter(rec => rec.record_type === type);
  }
  
  return records;
};

const getMockSalesMetrics = (period: string = 'month'): SalesData => {
  // Prepare mock data
  const data: SalesData = {
    monthly_revenue: 45000,
    annual_target: 500000,
    growth_rate: 15,
    client_acquisition: 5,
    conversion_rate: 25,
    avg_deal_size: 8500,
    top_clients: [
      { client_id: 1, client_name: 'TechCorp', revenue: 12500, growth: 8 },
      { client_id: 2, client_name: 'Innovate Inc', revenue: 9800, growth: 15 },
      { client_id: 3, client_name: 'Global Solutions', revenue: 7200, growth: 5 }
    ],
    monthly_trend: [
      { month: 'Jan', revenue: 35000, target: 40000 },
      { month: 'Feb', revenue: 38000, target: 40000 },
      { month: 'Mar', revenue: 42000, target: 40000 },
      { month: 'Apr', revenue: 45000, target: 42000 },
      { month: 'May', revenue: 0, target: 45000 },
    ],
    sales_by_service: [
      { service: 'Web Development', value: 25000 },
      { service: 'Digital Marketing', value: 12000 },
      { service: 'UI/UX Design', value: 8000 }
    ]
  };

  // Adjust data based on period (simplified for mock)
  if (period === 'quarter') {
    data.monthly_revenue *= 3;
    data.client_acquisition *= 3;
  } else if (period === 'year') {
    data.monthly_revenue *= 12;
    data.client_acquisition *= 12;
  }

  return data;
};

const getMockTeamCostsAnalysis = (period: string = 'month') => {
  return {
    total_cost: 85000,
    average_cost_per_employee: 8500,
    cost_by_department: [
      { department: 'Engineering', cost: 35000, headcount: 4 },
      { department: 'Design', cost: 20000, headcount: 2 },
      { department: 'Marketing', cost: 15000, headcount: 2 },
      { department: 'Management', cost: 15000, headcount: 2 }
    ],
    trend: [
      { month: 'Jan', cost: 80000 },
      { month: 'Feb', cost: 82000 },
      { month: 'Mar', cost: 85000 }
    ],
    efficiency_metrics: {
      revenue_per_employee: 18500,
      profit_per_employee: 10000,
      cost_to_revenue_ratio: 0.46
    }
  };
};

const getMockSalesFollowUps = () => {
  return [
    {
      id: 1,
      client_name: 'TechCorp',
      client_id: 1,
      contact_name: 'John Smith',
      contact_email: 'john@techcorp.com',
      contact_phone: '555-123-4567',
      followup_date: '2023-04-15',
      last_contact_date: '2023-03-30',
      notes: 'Discussed proposal, waiting for budget approval',
      priority: 'high',
      type: 'proposal_followup',
      status: 'pending'
    },
    {
      id: 2,
      client_name: 'Innovate Inc',
      client_id: 2,
      contact_name: 'Sarah Johnson',
      contact_email: 'sarah@innovate.com',
      contact_phone: '555-765-4321',
      followup_date: '2023-04-10',
      last_contact_date: '2023-03-25',
      notes: 'Sent initial proposal, schedule call to discuss details',
      priority: 'medium',
      type: 'initial_contact',
      status: 'pending'
    }
  ];
};

const getMockImprovementSuggestions = () => {
  return [
    {
      id: 1,
      area: 'Sales Process',
      suggestion: 'Reduce time between initial contact and proposal from 7 days to 3 days',
      potential_impact: 'Could increase closing rate by 15%',
      implementation_difficulty: 'medium',
      required_resources: 'Updated proposal templates, sales process automation'
    },
    {
      id: 2,
      area: 'Client Onboarding',
      suggestion: 'Create detailed onboarding checklist for new clients',
      potential_impact: 'Improved client satisfaction, faster project starts',
      implementation_difficulty: 'low',
      required_resources: 'Documentation time, client feedback collection'
    }
  ];
};

const getMockSalesGrowthData = (dateRange: string) => {
  return {
    trends: [
      { month: 'Jan', revenue: 40000 },
      { month: 'Feb', revenue: 42000 },
      { month: 'Mar', revenue: 45000 },
      { month: 'Apr', revenue: 48000 },
      { month: 'May', revenue: 52000 }
    ],
    currentPeriod: {
      revenueGrowth: 15.5,
      customerGrowth: 8.3
    },
    growthDrivers: [
      { factor: 'New client acquisition', impact: 8.2, performance: 'positive' },
      { factor: 'Upselling to existing clients', impact: 5.6, performance: 'positive' },
      { factor: 'Price increases', impact: 1.7, performance: 'neutral' }
    ]
  };
};

const getMockSalesTargets = (dateRange: string) => {
  return [
    { 
      id: 1, 
      category: 'Total Revenue', 
      target: 250000, 
      current: 225000, 
      percentage: 90 
    },
    { 
      id: 2, 
      category: 'New Clients', 
      target: 15, 
      current: 12, 
      percentage: 80 
    },
    { 
      id: 3, 
      category: 'Avg Deal Size', 
      target: 10000, 
      current: 11200, 
      percentage: 112 
    },
    { 
      id: 4, 
      category: 'Retention Rate', 
      target: 85, 
      current: 88, 
      percentage: 103.5 
    }
  ];
};

const getMockGrowthForecast = (dateRange: string): GrowthForecast => {
  return {
    chart: [
      { month: 'Jun', projected: 55000, best_case: 58000, worst_case: 52000 },
      { month: 'Jul', projected: 58000, best_case: 62000, worst_case: 54000 },
      { month: 'Aug', projected: 61000, best_case: 66000, worst_case: 56000 },
      { month: 'Sep', projected: 64000, best_case: 70000, worst_case: 58000 }
    ],
    predictions: [
      { 
        period: 'Next Quarter', 
        expected_growth: 12.5, 
        confidence: 85 
      },
      { 
        period: 'Next Year', 
        expected_growth: 25.0, 
        confidence: 70 
      }
    ],
    recommendations: [
      'Focus on expanding digital marketing services - highest growth potential',
      'Implement new client retention program - could increase LTV by 20%',
      'Explore partnerships with complementary service providers'
    ]
  };
};

const getMockWeeklyReports = () => {
  return {
    week_number: 15,
    start_date: '2023-04-10',
    end_date: '2023-04-16',
    highlights: [
      { metric: 'Revenue', value: 12500, change: 5 },
      { metric: 'Deals Closed', value: 3, change: 1 },
      { metric: 'New Leads', value: 12, change: -2 }
    ],
    top_performers: [
      { name: 'Sarah Johnson', deals: 2, revenue: 5500 },
      { name: 'Mike Chen', deals: 1, revenue: 4800 }
    ],
    upcoming_opportunities: [
      { client: 'TechWave Inc', potential_value: 12000, probability: 75, expected_close: '2023-04-28' },
      { client: 'FinServe Group', potential_value: 8500, probability: 60, expected_close: '2023-05-05' }
    ]
  };
};

const getMockMonthlyReports = () => {
  return {
    month: 'April',
    year: 2023,
    highlights: [
      { metric: 'Revenue', value: 48000, change: 8 },
      { metric: 'Deals Closed', value: 11, change: 2 },
      { metric: 'New Leads', value: 45, change: 5 }
    ],
    performance_by_service: [
      { service: 'Web Development', revenue: 25000, growth: 12 },
      { service: 'Digital Marketing', revenue: 15000, growth: 8 },
      { service: 'UI/UX Design', revenue: 8000, growth: 5 }
    ],
    client_acquisition_cost: {
      current: 850,
      previous: 920,
      change_percentage: -7.6
    },
    forecast: {
      next_month_revenue: 52000,
      quarterly_target_progress: 65
    }
  };
};

const getMockSalesTrends = (dateRange: string) => {
  return {
    trends: [
      { month: 'Jan', value: 40000 },
      { month: 'Feb', value: 42000 },
      { month: 'Mar', value: 45000 },
      { month: 'Apr', value: 48000 },
      { month: 'May', value: 52000 }
    ],
    insights: [
      "Revenue showed consistent month-over-month growth of 7-10%",
      "Q1 outperformed targets by 15%, driven by increased client acquisition",
      "Average deal size increased from $7,500 to $8,500 over the period",
      "Service expansion to existing clients accounts for 35% of growth"
    ],
    activities: [
      { id: 1, title: "Pipeline Review Meeting", date: "May 05", time: "10:00 AM" },
      { id: 2, title: "Q2 Strategy Planning", date: "May 08", time: "2:00 PM" },
      { id: 3, title: "Sales Team Training", date: "May 10", time: "9:00 AM" }
    ]
  };
};

const getMockSalesByChannel = (dateRange: string) => {
  return [
    { name: 'Referrals', value: 35, color: '#4f46e5' },
    { name: 'Website', value: 25, color: '#06b6d4' },
    { name: 'Social Media', value: 15, color: '#8b5cf6' },
    { name: 'Direct Outreach', value: 20, color: '#10b981' },
    { name: 'Events', value: 5, color: '#f59e0b' }
  ];
};

const getMockTopProducts = (dateRange: string) => {
  return [
    { id: 1, name: 'Web Development', sales: 12, units: 8, revenue: 120000, growth: 15 },
    { id: 2, name: 'SEO Services', sales: 18, units: 18, revenue: 90000, growth: 8 },
    { id: 3, name: 'UI/UX Design', sales: 10, units: 10, revenue: 65000, growth: 12 },
    { id: 4, name: 'Content Creation', sales: 15, units: 45, revenue: 45000, growth: 20 },
    { id: 5, name: 'Social Media Management', sales: 8, units: 8, revenue: 32000, growth: -5 }
  ];
};

const getMockFinancialOverview = () => {
  return {
    current_month_revenue: 45000,
    previous_month_revenue: 42000,
    revenue_growth: 7.14,
    current_month_expenses: 32000,
    previous_month_expenses: 30000,
    expense_growth: 6.67,
    current_month_profit: 13000,
    previous_month_profit: 12000,
    profit_growth: 8.33,
    cash_flow: 8500,
    accounts_receivable: 28000,
    accounts_payable: 15000
  };
};

const getMockFinancialMetrics = (period: 'month' | 'quarter' | 'year') => {
  const baseMetrics = {
    revenue: { 
      label: 'Revenue', 
      value: 45000, 
      formatted_value: '$45,000', 
      growth_rate: 7.14 
    },
    expenses: { 
      label: 'Expenses', 
      value: 32000, 
      formatted_value: '$32,000', 
      growth_rate: 6.67 
    },
    profit: { 
      label: 'Profit', 
      value: 13000, 
      formatted_value: '$13,000', 
      growth_rate: 8.33 
    },
    margin: { 
      label: 'Profit Margin', 
      value: 28.89, 
      formatted_value: '28.9%', 
      growth_rate: 1.12 
    }
  };

  // Adjust values based on period
  if (period === 'quarter') {
    Object.keys(baseMetrics).forEach(key => {
      const metric = baseMetrics[key as keyof typeof baseMetrics];
      if (typeof metric.value === 'number') {
        metric.value *= 3;
        metric.formatted_value = `$${(metric.value).toLocaleString()}`;
      }
    });
  } else if (period === 'year') {
    Object.keys(baseMetrics).forEach(key => {
      const metric = baseMetrics[key as keyof typeof baseMetrics];
      if (typeof metric.value === 'number' && key !== 'margin') {
        metric.value *= 12;
        metric.formatted_value = `$${(metric.value).toLocaleString()}`;
      }
    });
  }

  return baseMetrics;
};

const getMockUpsellOpportunities = () => {
  return [
    {
      clientId: 1,
      clientName: 'TechCorp',
      currentServices: ['Web Development', 'SEO'],
      recommendedServices: ['Social Media Management', 'Content Creation'],
      potentialRevenue: 12000,
      reason: 'Strong online presence could be expanded with content strategy'
    },
    {
      clientId: 2,
      clientName: 'Innovate Inc',
      currentServices: ['UI/UX Design'],
      recommendedServices: ['Web Development', 'Mobile App Development'],
      potentialRevenue: 25000,
      reason: 'Designs are ready for implementation, client has mentioned future app plans'
    }
  ];
};

const getMockFinancialPlans = () => {
  return [
    {
      id: 1,
      title: 'Q2 Expense Reduction',
      description: 'Identify and reduce non-essential expenses across departments',
      target_amount: 15000,
      current_progress: 6000,
      progress_percentage: 40,
      start_date: '2023-04-01',
      end_date: '2023-06-30',
      status: 'in_progress'
    },
    {
      id: 2,
      title: '2023 Revenue Growth',
      description: 'Increase overall revenue through new client acquisition and upselling',
      target_amount: 150000,
      current_progress: 45000,
      progress_percentage: 30,
      start_date: '2023-01-01',
      end_date: '2023-12-31',
      status: 'in_progress'
    }
  ];
};

export default financeService;
