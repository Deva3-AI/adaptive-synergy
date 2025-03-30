
import { supabase } from '@/integrations/supabase/client';
import { apiRequest } from '@/utils/apiUtils';

// Define types for finance service
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

export interface FinancialMetrics {
  total_revenue: number;
  total_expenses: number;
  profit_margin: number;
  outstanding_invoices: number;
  upcoming_payments: number;
  monthly_revenue: { month: string; amount: number }[];
  monthly_expenses: { month: string; amount: number }[];
}

export interface SalesMetrics {
  total_sales: number;
  sales_growth: number;
  conversion_rate: number;
  average_deal_size: number;
  sales_by_channel: { channel: string; amount: number }[];
  top_performers: { name: string; sales: number }[];
}

// Sample invoices
const sampleInvoices: Invoice[] = [
  {
    invoice_id: 1,
    client_id: 1,
    client_name: "Social Land",
    invoice_number: "INV-2023-001",
    amount: 2500,
    due_date: "2023-09-30",
    status: "pending",
    created_at: "2023-09-15"
  },
  {
    invoice_id: 2,
    client_id: 2,
    client_name: "Koala Digital",
    invoice_number: "INV-2023-002",
    amount: 1800,
    due_date: "2023-09-15",
    status: "paid",
    created_at: "2023-09-01"
  },
  {
    invoice_id: 3,
    client_id: 3,
    client_name: "AC Digital",
    invoice_number: "INV-2023-003",
    amount: 3200,
    due_date: "2023-08-30",
    status: "overdue",
    created_at: "2023-08-15"
  }
];

// Sample financial records
const sampleFinancialRecords: FinancialRecord[] = [
  {
    record_id: 1,
    record_type: "expense",
    amount: 650,
    description: "Office rent",
    record_date: "2023-09-01",
    created_at: "2023-09-01"
  },
  {
    record_id: 2,
    record_type: "expense",
    amount: 120,
    description: "Utilities",
    record_date: "2023-09-05",
    created_at: "2023-09-05"
  },
  {
    record_id: 3,
    record_type: "income",
    amount: 2500,
    description: "Client payment - Social Land",
    record_date: "2023-09-10",
    created_at: "2023-09-10"
  }
];

const financeService = {
  // Get all invoices or filter by status
  getInvoices: async (status?: 'pending' | 'paid' | 'overdue') => {
    try {
      let query = supabase.from('invoices').select(`
        *,
        clients (client_name)
      `);
      
      if (status) {
        query = query.eq('status', status);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Format the data to match our interface
      const formattedData = data.map(invoice => ({
        ...invoice,
        client_name: invoice.clients?.client_name
      }));
      
      return formattedData;
    } catch (error) {
      console.error('Error fetching invoices:', error);
      return status 
        ? sampleInvoices.filter(inv => inv.status === status)
        : sampleInvoices;
    }
  },
  
  // Get invoice details by ID
  getInvoiceDetails: async (invoiceId: number) => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          clients (client_name)
        `)
        .eq('invoice_id', invoiceId)
        .single();
      
      if (error) throw error;
      
      // Format the data
      const formattedInvoice = {
        ...data,
        client_name: data.clients?.client_name
      };
      
      return formattedInvoice;
    } catch (error) {
      console.error('Error fetching invoice details:', error);
      return sampleInvoices.find(inv => inv.invoice_id === invoiceId) || null;
    }
  },
  
  // Create a new invoice
  createInvoice: async (invoiceData: any) => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .insert(invoiceData)
        .select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error creating invoice:', error);
      return { ...invoiceData, invoice_id: Date.now(), created_at: new Date().toISOString() };
    }
  },
  
  // Update invoice status
  updateInvoiceStatus: async (invoiceId: number, status: 'pending' | 'paid' | 'overdue') => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .update({ status })
        .eq('invoice_id', invoiceId)
        .select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error updating invoice status:', error);
      const invoice = sampleInvoices.find(inv => inv.invoice_id === invoiceId);
      if (invoice) {
        invoice.status = status;
      }
      return invoice;
    }
  },
  
  // Get revenue reports
  getRevenueReports: async (startDate?: string, endDate?: string) => {
    // Implementation would query financial_records for income records
    // For demo, return mock data
    return {
      total_revenue: 12500,
      monthly_breakdown: [
        { month: "Jan", amount: 1200 },
        { month: "Feb", amount: 980 },
        { month: "Mar", amount: 1450 },
        { month: "Apr", amount: 1300 },
        { month: "May", amount: 2100 },
        { month: "Jun", amount: 1890 }
      ],
      top_clients: [
        { client_id: 1, client_name: "Social Land", total: 4500 },
        { client_id: 3, client_name: "AC Digital", total: 3200 },
        { client_id: 2, client_name: "Koala Digital", total: 2800 }
      ]
    };
  },
  
  // Get expense reports
  getExpenseReports: async (startDate?: string, endDate?: string) => {
    // Implementation would query financial_records for expense records
    // For demo, return mock data
    return {
      total_expenses: 5830,
      monthly_breakdown: [
        { month: "Jan", amount: 780 },
        { month: "Feb", amount: 920 },
        { month: "Mar", amount: 850 },
        { month: "Apr", amount: 1100 },
        { month: "May", amount: 1080 },
        { month: "Jun", amount: 1100 }
      ],
      categories: [
        { category: "Rent", amount: 3900 },
        { category: "Utilities", amount: 720 },
        { category: "Supplies", amount: 450 },
        { category: "Subscriptions", amount: 760 }
      ]
    };
  },
  
  // Get financial records
  getFinancialRecords: async (type?: 'expense' | 'income') => {
    try {
      let query = supabase.from('financial_records').select('*');
      
      if (type) {
        query = query.eq('record_type', type);
      }
      
      const { data, error } = await query.order('record_date', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching financial records:', error);
      return type 
        ? sampleFinancialRecords.filter(record => record.record_type === type)
        : sampleFinancialRecords;
    }
  },
  
  // Create a financial record
  createFinancialRecord: async (recordData: Omit<FinancialRecord, 'record_id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('financial_records')
        .insert(recordData)
        .select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error creating financial record:', error);
      return { 
        ...recordData, 
        record_id: Date.now(), 
        created_at: new Date().toISOString() 
      };
    }
  },
  
  // Get financial metrics
  getFinancialMetrics: async (): Promise<FinancialMetrics> => {
    // Implementation would aggregate data from multiple tables
    // For demo, return mock data
    return {
      total_revenue: 12500,
      total_expenses: 5830,
      profit_margin: 53.4,
      outstanding_invoices: 5700,
      upcoming_payments: 3200,
      monthly_revenue: [
        { month: "Jan", amount: 1200 },
        { month: "Feb", amount: 980 },
        { month: "Mar", amount: 1450 },
        { month: "Apr", amount: 1300 },
        { month: "May", amount: 2100 },
        { month: "Jun", amount: 1890 }
      ],
      monthly_expenses: [
        { month: "Jan", amount: 780 },
        { month: "Feb", amount: 920 },
        { month: "Mar", amount: 850 },
        { month: "Apr", amount: 1100 },
        { month: "May", amount: 1080 },
        { month: "Jun", amount: 1100 }
      ]
    };
  },
  
  // Get sales metrics
  getSalesMetrics: async (): Promise<SalesMetrics> => {
    // Implementation would aggregate data from multiple tables
    // For demo, return mock data
    return {
      total_sales: 92500,
      sales_growth: 15.3,
      conversion_rate: 12.5,
      average_deal_size: 2300,
      sales_by_channel: [
        { channel: "Direct", amount: 45000 },
        { channel: "Referral", amount: 28000 },
        { channel: "Website", amount: 19500 }
      ],
      top_performers: [
        { name: "John Doe", sales: 35000 },
        { name: "Jane Smith", sales: 28000 },
        { name: "Mike Johnson", sales: 21000 }
      ]
    };
  },
  
  // Get upsell opportunities
  getUpsellOpportunities: async () => {
    // Implementation would analyze client data and identify opportunities
    // For demo, return mock data
    return [
      {
        client_id: 1,
        client_name: "Social Land",
        current_services: ["Web Development", "SEO"],
        suggested_services: ["Content Marketing", "Social Media Management"],
        potential_value: 1800
      },
      {
        client_id: 2,
        client_name: "Koala Digital",
        current_services: ["Logo Design", "Brand Identity"],
        suggested_services: ["Website Redesign", "Marketing Collateral"],
        potential_value: 2500
      }
    ];
  },
  
  // Send invoice reminder
  sendInvoiceReminder: async (invoiceId: number) => {
    // Implementation would send an email reminder
    // For demo, return mock response
    return {
      success: true,
      message: "Reminder sent successfully",
      sent_at: new Date().toISOString()
    };
  },
  
  // Analyze team costs
  analyzeTeamCosts: async () => {
    // Implementation would analyze employee costs vs. revenue
    // For demo, return mock data
    return {
      total_employee_cost: 28500,
      revenue_per_employee: 9250,
      department_breakdown: [
        { department: "Development", cost: 12000, revenue: 42000 },
        { department: "Design", cost: 8500, revenue: 31000 },
        { department: "Marketing", cost: 6000, revenue: 18000 },
        { department: "Sales", cost: 2000, revenue: 1500 }
      ],
      optimization_suggestions: [
        "Increase utilization in the Marketing department",
        "Consider expanding the Development team due to high ROI"
      ]
    };
  },
  
  // Get financial plans
  getFinancialPlans: async () => {
    // Implementation would retrieve saved financial plans
    // For demo, return mock data
    return [
      {
        id: 1,
        title: "Q4 Growth Plan",
        description: "Financial strategy for Q4 2023",
        targets: {
          revenue: 55000,
          expenses: 32000,
          profit: 23000
        },
        created_at: "2023-09-10"
      },
      {
        id: 2,
        title: "2024 Annual Budget",
        description: "Projected budget for 2024 fiscal year",
        targets: {
          revenue: 220000,
          expenses: 140000,
          profit: 80000
        },
        created_at: "2023-09-01"
      }
    ];
  },
  
  // Sales tracking functions
  getSalesFollowUps: async () => {
    return [
      {
        id: 1,
        client_name: "Potential Client A",
        follow_up_date: "2023-09-25",
        status: "pending",
        notes: "Discuss proposal details"
      },
      {
        id: 2,
        client_name: "Potential Client B",
        follow_up_date: "2023-09-26",
        status: "pending",
        notes: "Send updated quote"
      }
    ];
  },
  
  getImprovementSuggestions: async () => {
    return [
      "Follow up with leads within 24 hours to increase conversion by 30%",
      "Offer tiered pricing options to increase average deal size",
      "Implement a referral program to boost lead generation"
    ];
  },
  
  completeFollowUp: async (followUpId: number, notes: string) => {
    return {
      success: true,
      message: "Follow-up marked as completed",
      completed_at: new Date().toISOString()
    };
  },
  
  getSalesGrowthData: async () => {
    return {
      periods: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      data: [12500, 13800, 15200, 14500, 17200, 18500]
    };
  },
  
  getSalesTargets: async () => {
    return {
      current: 18500,
      target: 22000,
      previous_period: 14500,
      growth_rate: 27.6
    };
  },
  
  getGrowthForecast: async () => {
    return {
      next_month: 19800,
      next_quarter: 65000,
      next_year: 275000,
      growth_factors: [
        "New product launches",
        "Expanded sales team",
        "Increased market presence"
      ]
    };
  },
  
  getWeeklyReports: async () => {
    return {
      current_week: {
        total_sales: 5200,
        new_leads: 18,
        conversion_rate: 22,
        top_performer: "Jane Smith"
      },
      previous_week: {
        total_sales: 4800,
        new_leads: 15,
        conversion_rate: 20,
        top_performer: "John Doe"
      },
      growth: {
        total_sales: 8.3,
        new_leads: 20,
        conversion_rate: 10
      }
    };
  },
  
  getMonthlyReports: async () => {
    return {
      current_month: {
        total_sales: 18500,
        new_clients: 3,
        recurring_revenue: 12000,
        one_time_sales: 6500
      },
      previous_month: {
        total_sales: 17200,
        new_clients: 2,
        recurring_revenue: 11500,
        one_time_sales: 5700
      },
      growth: {
        total_sales: 7.6,
        new_clients: 50,
        recurring_revenue: 4.3,
        one_time_sales: 14
      }
    };
  },
  
  getSalesTrends: async () => {
    return {
      periods: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      sales: [12500, 13800, 15200, 14500, 17200, 18500],
      leads: [42, 38, 45, 48, 52, 56],
      conversions: [12, 15, 14, 13, 18, 21]
    };
  },
  
  getSalesByChannel: async () => {
    return [
      { channel: "Direct", amount: 45000, percentage: 48.6 },
      { channel: "Referral", amount: 28000, percentage: 30.3 },
      { channel: "Website", amount: 19500, percentage: 21.1 }
    ];
  },
  
  getTopProducts: async () => {
    return [
      { product: "Web Development", revenue: 38500, units: 15 },
      { product: "Brand Identity", revenue: 22000, units: 12 },
      { product: "Digital Marketing", revenue: 18000, units: 8 },
      { product: "SEO Services", revenue: 14000, units: 6 }
    ];
  }
};

export default financeService;
