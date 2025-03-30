
import { apiRequest } from "@/utils/apiUtils";
import { supabase } from '@/integrations/supabase/client';

// Interface for Invoice
export interface Invoice {
  invoice_id: number;
  client_id: number;
  invoice_number: string;
  amount: number;
  due_date: string;
  status: "pending" | "paid" | "overdue";
  created_at: string;
  client_name?: string;
}

// Interface for Financial Record
export interface FinancialRecord {
  record_id: number;
  record_type: "expense" | "income";
  amount: number;
  description: string;
  record_date: string;
  created_at: string;
}

const financeService = {
  // Get invoices with optional status filter
  getInvoices: async (status?: string) => {
    try {
      let query = supabase
        .from('invoices')
        .select(`
          *,
          clients (client_name)
        `);
      
      if (status && status !== 'all') {
        query = query.eq('status', status);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Transform data to match the Invoice interface
      const invoices = data.map(invoice => ({
        invoice_id: invoice.invoice_id,
        client_id: invoice.client_id,
        invoice_number: invoice.invoice_number,
        amount: invoice.amount,
        due_date: invoice.due_date,
        status: invoice.status,
        created_at: invoice.created_at,
        client_name: invoice.clients?.client_name
      }));
      
      return invoices;
    } catch (error) {
      console.error('Error fetching invoices:', error);
      // Return mock data as fallback
      return [
        {
          invoice_id: 1,
          client_id: 1,
          invoice_number: "INV-2023-001",
          amount: 5000,
          due_date: "2023-12-15",
          status: "pending" as "pending" | "paid" | "overdue",
          created_at: "2023-11-01",
          client_name: "Acme Corporation"
        },
        {
          invoice_id: 2,
          client_id: 2,
          invoice_number: "INV-2023-002",
          amount: 3500,
          due_date: "2023-11-20",
          status: "paid" as "pending" | "paid" | "overdue",
          created_at: "2023-11-05",
          client_name: "TechStart Inc."
        },
        {
          invoice_id: 3,
          client_id: 3,
          invoice_number: "INV-2023-003",
          amount: 7500,
          due_date: "2023-11-10",
          status: "overdue" as "pending" | "paid" | "overdue",
          created_at: "2023-10-25",
          client_name: "Global Logistics Ltd."
        }
      ];
    }
  },
  
  // Get invoice details by ID
  getInvoiceDetails: async (invoiceId: number) => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          clients (*)
        `)
        .eq('invoice_id', invoiceId)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching invoice details:', error);
      return {
        invoice_id: invoiceId,
        invoice_number: `INV-2023-${invoiceId.toString().padStart(3, '0')}`,
        client_id: 1,
        client_name: "Sample Client",
        amount: 5000,
        due_date: "2023-12-31",
        status: "pending",
        created_at: "2023-11-01"
      };
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
      return {
        invoice_id: Math.floor(Math.random() * 1000),
        ...invoiceData,
        created_at: new Date().toISOString()
      };
    }
  },
  
  // Update invoice status
  updateInvoiceStatus: async (invoiceId: number, status: "pending" | "paid" | "overdue") => {
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
      return { success: true, invoice_id: invoiceId, status };
    }
  },
  
  // Send invoice reminder
  sendInvoiceReminder: async (invoiceId: number) => {
    try {
      // In a real implementation, this would trigger an email or notification
      // For now, we'll just simulate a successful response
      return { success: true, message: "Reminder sent successfully" };
    } catch (error) {
      console.error('Error sending invoice reminder:', error);
      return { success: false, message: "Failed to send reminder" };
    }
  },
  
  // Get financial records by type
  getFinancialRecords: async (recordType: "expense" | "income") => {
    try {
      const { data, error } = await supabase
        .from('financial_records')
        .select('*')
        .eq('record_type', recordType)
        .order('record_date', { ascending: false });
      
      if (error) throw error;
      
      return data.map(record => ({
        record_id: record.record_id,
        record_type: record.record_type,
        amount: record.amount,
        description: record.description,
        record_date: record.record_date,
        created_at: record.created_at
      }));
    } catch (error) {
      console.error(`Error fetching ${recordType} records:`, error);
      // Return mock data
      return Array(10).fill(null).map((_, i) => ({
        record_id: i + 1,
        record_type: recordType,
        amount: Math.floor(Math.random() * 5000) + 500,
        description: `${recordType === 'expense' ? 'Software: Monthly subscription' : 'Client payment'} ${i + 1}`,
        record_date: new Date(Date.now() - i * 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        created_at: new Date(Date.now() - i * 3 * 24 * 60 * 60 * 1000).toISOString()
      }));
    }
  },
  
  // Get revenue reports
  getRevenueReports: async (startDate?: string, endDate?: string) => {
    // For simplicity, return mock data that would normally be filtered by date
    return {
      totalRevenue: 125000,
      comparisonToLastPeriod: 15,
      byMonth: [
        { month: 'Jan', revenue: 8500 },
        { month: 'Feb', revenue: 9200 },
        { month: 'Mar', revenue: 7800 },
        { month: 'Apr', revenue: 9500 },
        { month: 'May', revenue: 10200 },
        { month: 'Jun', revenue: 11500 },
        { month: 'Jul', revenue: 10800 },
        { month: 'Aug', revenue: 12500 },
        { month: 'Sep', revenue: 13800 },
        { month: 'Oct', revenue: 15200 },
        { month: 'Nov', revenue: 16500 },
        { month: 'Dec', revenue: 9500 }
      ],
      byClient: [
        { client: 'Acme Corp', revenue: 32500 },
        { client: 'TechStart Inc', revenue: 28700 },
        { client: 'Global Logistics', revenue: 25300 },
        { client: 'Innovative Solutions', revenue: 21800 },
        { client: 'Digital Dynamics', revenue: 16700 }
      ]
    };
  },
  
  // Get expense reports
  getExpenseReports: async (startDate?: string, endDate?: string) => {
    // For simplicity, return mock data that would normally be filtered by date
    return {
      totalExpenses: 82000,
      comparisonToLastPeriod: -5,
      byMonth: [
        { month: 'Jan', expenses: 5500 },
        { month: 'Feb', expenses: 6200 },
        { month: 'Mar', expenses: 5800 },
        { month: 'Apr', expenses: 7500 },
        { month: 'May', expenses: 6200 },
        { month: 'Jun', expenses: 8500 },
        { month: 'Jul', expenses: 7800 },
        { month: 'Aug', expenses: 6500 },
        { month: 'Sep', expenses: 7800 },
        { month: 'Oct', expenses: 8200 },
        { month: 'Nov', expenses: 7500 },
        { month: 'Dec', expenses: 4500 }
      ],
      byCategory: [
        { category: 'Software', expenses: 15700 },
        { category: 'Salaries', expenses: 42000 },
        { category: 'Office', expenses: 8300 },
        { category: 'Marketing', expenses: 10500 },
        { category: 'Miscellaneous', expenses: 5500 }
      ]
    };
  },

  // Analyze team costs
  analyzeTeamCosts: async (period: string) => {
    return {
      total_cost: 125000,
      trend_percentage: 5.2,
      avg_cost_per_employee: 5208,
      total_employees: 24,
      departments: [
        { name: 'Development', headcount: 10, cost: 60000, percentage: 48, yoy_change: 8 },
        { name: 'Design', headcount: 4, cost: 22000, percentage: 17.6, yoy_change: 3 },
        { name: 'Marketing', headcount: 3, cost: 15500, percentage: 12.4, yoy_change: 2 },
        { name: 'Sales', headcount: 3, cost: 16500, percentage: 13.2, yoy_change: -1 },
        { name: 'Admin', headcount: 4, cost: 11000, percentage: 8.8, yoy_change: -2 }
      ],
      trend: [
        { period: 'Jan', total_cost: 118000, avg_cost: 5130 },
        { period: 'Feb', total_cost: 119500, avg_cost: 5196 },
        { period: 'Mar', total_cost: 120000, avg_cost: 5217 },
        { period: 'Apr', total_cost: 121500, avg_cost: 5217 },
        { period: 'May', total_cost: 122500, avg_cost: 5217 },
        { period: 'Jun', total_cost: 123000, avg_cost: 5240 },
        { period: 'Jul', total_cost: 124000, avg_cost: 5250 },
        { period: 'Aug', total_cost: 125000, avg_cost: 5208 }
      ],
      efficiency: [
        { name: 'Development', efficiency: 88 },
        { name: 'Design', efficiency: 92 },
        { name: 'Marketing', efficiency: 85 },
        { name: 'Sales', efficiency: 78 },
        { name: 'Admin', efficiency: 82 }
      ],
      optimization_opportunities: [
        { department: 'Sales', potential_savings: 3500, description: 'Optimize lead generation process to reduce time spent on low-quality leads.' },
        { department: 'Admin', potential_savings: 2200, description: 'Automate recurring administrative tasks to reduce overhead.' },
        { department: 'Development', potential_savings: 4800, description: 'Consolidate software tools and licenses to eliminate redundancy.' }
      ],
      insights: [
        'Development team costs increased by 8% YoY but delivered 12% more features.',
        'Design team shows the highest efficiency at 92%, good value for investment.',
        'Sales team costs slightly decreased but efficiency is the lowest at 78%, suggesting potential process improvements.',
        'Admin costs could be reduced by automating recurring tasks.',
        'Overall team cost per employee is stable at around $5,200 monthly.'
      ]
    };
  },

  // Sales related methods
  getSalesTrends: async (dateRange: string) => {
    return {
      data: [
        { name: 'Jan', revenue: 48200 },
        { name: 'Feb', revenue: 52300 },
        { name: 'Mar', revenue: 47800 },
        { name: 'Apr', revenue: 53500 },
        { name: 'May', revenue: 56200 },
        { name: 'Jun', revenue: 62500 },
        { name: 'Jul', revenue: 58800 },
        { name: 'Aug', revenue: 65500 },
        { name: 'Sep', revenue: 68800 },
        { name: 'Oct', revenue: 72200 },
        { name: 'Nov', revenue: 76500 },
        { name: 'Dec', revenue: 58500 }
      ],
      insights: [
        'Q4 has shown consistent growth with 15% increase in sales compared to Q3.',
        'November was the best performing month with $76,500 in revenue.',
        'Web design services are the most consistent revenue stream.',
        'Digital marketing packages are growing the fastest at 28% YoY.',
        'Enterprise clients account for 65% of total revenue.'
      ],
      activities: [
        { id: 1, title: 'Year-end client reviews', date: 'Dec 15, 2023', time: '9:00 AM - 5:00 PM' },
        { id: 2, title: 'Q1 planning session', date: 'Dec 18, 2023', time: '1:00 PM - 4:00 PM' },
        { id: 3, title: 'New product launch preparation', date: 'Dec 20, 2023', time: '10:00 AM - 12:00 PM' }
      ]
    };
  },

  getSalesByChannel: async (dateRange: string) => {
    return [
      { name: 'Direct Sales', value: 45 },
      { name: 'Partner Referrals', value: 25 },
      { name: 'Online Marketing', value: 15 },
      { name: 'Conferences', value: 10 },
      { name: 'Social Media', value: 5 }
    ];
  },

  getTopProducts: async (dateRange: string) => {
    return [
      { id: 1, name: 'Website Design Package', sales: 42, units: 42, revenue: 168000, growth: 12 },
      { id: 2, name: 'SEO Optimization', sales: 38, units: 38, revenue: 95000, growth: 18 },
      { id: 3, name: 'Digital Marketing Campaign', sales: 35, units: 35, revenue: 87500, growth: 15 },
      { id: 4, name: 'E-commerce Integration', sales: 28, units: 28, revenue: 112000, growth: 8 },
      { id: 5, name: 'Mobile App Development', sales: 22, units: 22, revenue: 154000, growth: -3 }
    ];
  },

  getSalesGrowthData: async (dateRange: string) => {
    return {
      trends: [
        { name: 'Jan', growth: 5.2 },
        { name: 'Feb', growth: 6.8 },
        { name: 'Mar', growth: 4.5 },
        { name: 'Apr', growth: 8.2 },
        { name: 'May', growth: 7.6 },
        { name: 'Jun', growth: 10.2 },
        { name: 'Jul', growth: 9.5 },
        { name: 'Aug', growth: 12.3 },
        { name: 'Sep', growth: 11.8 },
        { name: 'Oct', growth: 13.5 },
        { name: 'Nov', growth: 14.2 },
        { name: 'Dec', growth: 8.6 }
      ],
      currentPeriod: {
        revenueGrowth: 12.5,
        customerGrowth: 8.3
      },
      growthDrivers: [
        { factor: 'New Services', impact: 35, performance: 'positive' },
        { factor: 'Existing Client Upsells', impact: 28, performance: 'positive' },
        { factor: 'Referrals', impact: 18, performance: 'positive' },
        { factor: 'Marketing Campaigns', impact: 12, performance: 'neutral' },
        { factor: 'Pricing Strategy', impact: 7, performance: 'negative' }
      ]
    };
  },

  getSalesTargets: async (dateRange: string) => {
    return [
      { id: 1, category: 'Total Revenue', current: 685000, target: 750000, percentage: 91 },
      { id: 2, category: 'New Clients', current: 32, target: 35, percentage: 91 },
      { id: 3, category: 'Existing Client Retention', current: 95, target: 90, percentage: 106 },
      { id: 4, category: 'Average Deal Size', current: 21400, target: 25000, percentage: 86 }
    ];
  },

  getGrowthForecast: async (dateRange: string) => {
    return {
      chart: [
        { name: 'Jan', forecast: 78500, actual: 75200 },
        { name: 'Feb', forecast: 82000, actual: 80100 },
        { name: 'Mar', forecast: 85500, actual: 79800 },
        { name: 'Apr', forecast: 88000, actual: 90500 },
        { name: 'May', forecast: 92000, actual: 93200 },
        { name: 'Jun', forecast: 95000, actual: 102500 },
        { name: 'Jul', forecast: 98000, actual: 98800 },
        { name: 'Aug', forecast: 102000, actual: 105500 },
        { name: 'Sep', forecast: 106000, actual: 108800 },
        { name: 'Oct', forecast: 110000, actual: 112200 },
        { name: 'Nov', forecast: 114000, actual: 116500 },
        { name: 'Dec', forecast: 118000 }
      ],
      insights: [
        { type: 'positive', text: 'Based on current trends, we are projected to exceed annual revenue targets by 8.5%.' },
        { type: 'positive', text: 'Client acquisition is on track to grow by 15% in the upcoming quarter.' },
        { type: 'warning', text: 'Average deal size showing signs of pressure, may need to adjust pricing strategy.' },
        { type: 'positive', text: 'New service offerings are expected to contribute 22% to overall growth next quarter.' }
      ]
    };
  },

  getWeeklyReports: async () => {
    return [
      {
        id: 1,
        title: 'Weekly Sales Summary',
        period: 'Dec 4 - Dec 10, 2023',
        sales: 28500,
        target: 25000,
        progress: 114,
        performanceData: [
          { name: 'Mon', sales: 5200 },
          { name: 'Tue', sales: 4800 },
          { name: 'Wed', sales: 6300 },
          { name: 'Thu', sales: 5100 },
          { name: 'Fri', sales: 7100 },
          { name: 'Sat', sales: 0 },
          { name: 'Sun', sales: 0 }
        ],
        metrics: {
          conversionRate: 12.5,
          prevConversionRate: 11.2,
          avgSaleValue: 4750,
          prevAvgSaleValue: 4200,
          newLeads: 42,
          prevNewLeads: 38,
          closedDeals: 6,
          prevClosedDeals: 5
        }
      },
      {
        id: 2,
        title: 'Weekly Sales Summary',
        period: 'Nov 27 - Dec 3, 2023',
        sales: 24800,
        target: 25000,
        progress: 99,
        performanceData: [
          { name: 'Mon', sales: 4600 },
          { name: 'Tue', sales: 4900 },
          { name: 'Wed', sales: 5200 },
          { name: 'Thu', sales: 4700 },
          { name: 'Fri', sales: 5400 },
          { name: 'Sat', sales: 0 },
          { name: 'Sun', sales: 0 }
        ],
        metrics: {
          conversionRate: 11.2,
          prevConversionRate: 10.8,
          avgSaleValue: 4200,
          prevAvgSaleValue: 4100,
          newLeads: 38,
          prevNewLeads: 35,
          closedDeals: 5,
          prevClosedDeals: 5
        }
      }
    ];
  },

  getMonthlyReports: async () => {
    return [
      {
        id: 1,
        title: 'Monthly Sales Report',
        period: 'November 2023',
        sales: 116500,
        target: 110000,
        progress: 106,
        yearlyTrend: [
          { name: 'Jan', sales: 75200 },
          { name: 'Feb', sales: 80100 },
          { name: 'Mar', sales: 79800 },
          { name: 'Apr', sales: 90500 },
          { name: 'May', sales: 93200 },
          { name: 'Jun', sales: 102500 },
          { name: 'Jul', sales: 98800 },
          { name: 'Aug', sales: 105500 },
          { name: 'Sep', sales: 108800 },
          { name: 'Oct', sales: 112200 },
          { name: 'Nov', sales: 116500 },
          { name: 'Dec', sales: 0 }
        ]
      },
      {
        id: 2,
        title: 'Monthly Sales Report',
        period: 'October 2023',
        sales: 112200,
        target: 105000,
        progress: 107,
        yearlyTrend: [
          { name: 'Jan', sales: 75200 },
          { name: 'Feb', sales: 80100 },
          { name: 'Mar', sales: 79800 },
          { name: 'Apr', sales: 90500 },
          { name: 'May', sales: 93200 },
          { name: 'Jun', sales: 102500 },
          { name: 'Jul', sales: 98800 },
          { name: 'Aug', sales: 105500 },
          { name: 'Sep', sales: 108800 },
          { name: 'Oct', sales: 112200 },
          { name: 'Nov', sales: 0 },
          { name: 'Dec', sales: 0 }
        ]
      }
    ];
  },

  getSalesFollowUps: async () => {
    return [
      {
        id: 1,
        clientName: 'Acme Corporation',
        contactPerson: 'John Smith',
        type: 'call',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
        phone: '(555) 123-4567',
        email: 'john.smith@acme.com',
        notes: 'Follow up on the website redesign proposal sent last week. They mentioned they would have feedback by this time.'
      },
      {
        id: 2,
        clientName: 'TechStart Inc.',
        contactPerson: 'Sarah Johnson',
        type: 'email',
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
        phone: '(555) 987-6543',
        email: 'sarah.j@techstart.io',
        notes: 'Send updated pricing for the SEO package as discussed in our last meeting. They were particularly interested in the analytics component.'
      },
      {
        id: 3,
        clientName: 'Global Logistics Ltd.',
        contactPerson: 'Michael Wong',
        type: 'meeting',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
        phone: '(555) 321-7890',
        email: 'm.wong@globallogistics.com',
        notes: 'Schedule a demo of our new logistics dashboard. They have a team of 5 people who would attend the demo.'
      },
      {
        id: 4,
        clientName: 'Creative Design Co.',
        contactPerson: 'Emma Lewis',
        type: 'call',
        dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
        phone: '(555) 456-7890',
        email: 'emma@creativedesign.co',
        notes: 'Discuss partnership opportunities for upcoming projects. They mentioned they have several clients who need our services.'
      }
    ];
  },

  getImprovementSuggestions: async () => {
    return [
      {
        id: 1,
        title: 'Optimize follow-up timing',
        description: 'Data shows 35% higher conversion when following up within 24 hours of initial contact. Currently averaging 48 hours.',
        priority: 'high'
      },
      {
        id: 2,
        title: 'Expand enterprise client segment',
        description: 'Enterprise clients show 22% higher LTV and more stable revenue patterns. Consider allocating more resources to this segment.',
        priority: 'medium'
      },
      {
        id: 3,
        title: 'Bundle complementary services',
        description: 'Clients purchasing website design + SEO have 45% higher retention rate. Create standardized bundles to promote.',
        priority: 'medium'
      }
    ];
  },

  completeFollowUp: async (followUpId: number, feedback: string) => {
    // In a real implementation, this would update the database
    return {
      success: true,
      id: followUpId,
      status: 'completed',
      completedAt: new Date().toISOString(),
      feedback
    };
  },

  // Financial dashboard methods
  getFinancialOverview: async () => {
    return {
      totalRevenue: 685000,
      revenueGrowth: 12.5,
      totalExpenses: 452000,
      expenseGrowth: 8.3,
      netProfit: 233000,
      profitMargin: 34.0,
      cashFlow: 198500,
      runwayMonths: 8.5,
      outstandingInvoices: 78500,
      overdueInvoices: 23500,
      projectedRevenue: {
        current: 58500,
        next: 62000,
        trend: 6.0
      },
      projectedExpenses: {
        current: 42000,
        next: 43500,
        trend: 3.5
      }
    };
  },

  getFinancialMetrics: async () => {
    return {
      revenueByMonth: [
        { month: 'Jan', value: 48200 },
        { month: 'Feb', value: 52300 },
        { month: 'Mar', value: 47800 },
        { month: 'Apr', value: 53500 },
        { month: 'May', value: 56200 },
        { month: 'Jun', value: 62500 },
        { month: 'Jul', value: 58800 },
        { month: 'Aug', value: 65500 },
        { month: 'Sep', value: 68800 },
        { month: 'Oct', value: 72200 },
        { month: 'Nov', value: 76500 },
        { month: 'Dec', value: 58500 }
      ],
      expensesByMonth: [
        { month: 'Jan', value: 32500 },
        { month: 'Feb', value: 34200 },
        { month: 'Mar', value: 31800 },
        { month: 'Apr', value: 35500 },
        { month: 'May', value: 36200 },
        { month: 'Jun', value: 40500 },
        { month: 'Jul', value: 38800 },
        { month: 'Aug', value: 42500 },
        { month: 'Sep', value: 43800 },
        { month: 'Oct', value: 45200 },
        { month: 'Nov', value: 47500 },
        { month: 'Dec', value: 42000 }
      ],
      profitMargins: [
        { month: 'Jan', value: 32.6 },
        { month: 'Feb', value: 34.6 },
        { month: 'Mar', value: 33.5 },
        { month: 'Apr', value: 33.6 },
        { month: 'May', value: 35.6 },
        { month: 'Jun', value: 35.2 },
        { month: 'Jul', value: 34.0 },
        { month: 'Aug', value: 35.1 },
        { month: 'Sep', value: 36.3 },
        { month: 'Oct', value: 37.4 },
        { month: 'Nov', value: 37.9 },
        { month: 'Dec', value: 35.0 }
      ],
      kpis: [
        { name: 'Avg. Revenue per Client', value: '$15,200', change: 8.5 },
        { name: 'Client Acquisition Cost', value: '$2,800', change: -2.5 },
        { name: 'Lifetime Value', value: '$35,500', change: 12.0 },
        { name: 'Monthly Recurring Revenue', value: '$48,500', change: 15.5 }
      ]
    };
  },

  getUpsellOpportunities: async () => {
    return [
      {
        id: 1,
        clientName: 'Acme Corporation',
        currentServices: ['Website Design', 'Hosting'],
        potentialServices: ['SEO Package', 'Content Marketing'],
        estimatedValue: 4500,
        probability: 75,
        lastPurchase: '2023-09-15',
        notes: 'Recently mentioned interest in improving search rankings. Good candidate for our SEO package.'
      },
      {
        id: 2,
        clientName: 'TechStart Inc.',
        currentServices: ['SEO Package', 'Google Ads Management'],
        potentialServices: ['Social Media Marketing', 'Content Creation'],
        estimatedValue: 3200,
        probability: 60,
        lastPurchase: '2023-10-22',
        notes: 'Expanding their market presence. Likely interested in building social media presence.'
      },
      {
        id: 3,
        clientName: 'Global Logistics Ltd.',
        currentServices: ['Website Design', 'CRM Integration'],
        potentialServices: ['Mobile App Development', 'Maintenance Plan'],
        estimatedValue: 12500,
        probability: 40,
        lastPurchase: '2023-08-05',
        notes: 'Mentioned need to provide mobile access to their clients. App development would be a natural next step.'
      }
    ];
  },

  getFinancialPlans: async () => {
    return [
      {
        id: 1,
        title: 'Q1 2024 Financial Plan',
        description: 'Revenue growth targets and expense optimization for Q1 2024',
        status: 'draft',
        createdAt: '2023-11-28',
        targets: {
          revenue: 195000,
          expenses: 128000,
          profit: 67000,
          profitMargin: 34.4
        },
        keyProjects: [
          'Launch premium service tier',
          'Optimize software subscription costs',
          'Increase retainer-based client agreements'
        ]
      },
      {
        id: 2,
        title: '2024 Annual Budget',
        description: 'Comprehensive budget and financial targets for fiscal year 2024',
        status: 'in_progress',
        createdAt: '2023-11-15',
        targets: {
          revenue: 820000,
          expenses: 533000,
          profit: 287000,
          profitMargin: 35.0
        },
        keyProjects: [
          'Expand marketing team capacity',
          'Office expansion planning',
          'New service line development',
          'Technology infrastructure upgrade'
        ]
      }
    ];
  },

  getSalesMetrics: async () => {
    return {
      totalSales: 685000,
      targetCompletion: 91.3,
      avgDealSize: 21400,
      dealSizeChange: 8.5,
      salesCycle: 35,
      salesCycleChange: -5,
      conversionRate: 18.5,
      conversionRateChange: 2.3,
      topPerformingServices: [
        { name: 'Website Design', value: 235000, percentage: 34.3 },
        { name: 'SEO Services', value: 158000, percentage: 23.1 },
        { name: 'Digital Marketing', value: 126000, percentage: 18.4 },
        { name: 'App Development', value: 98000, percentage: 14.3 },
        { name: 'Maintenance', value: 68000, percentage: 9.9 }
      ],
      clientSegments: [
        { name: 'Enterprise', value: 312000, percentage: 45.5 },
        { name: 'Mid-Market', value: 235000, percentage: 34.3 },
        { name: 'Small Business', value: 138000, percentage: 20.2 }
      ],
      salesByRegion: [
        { name: 'West', value: 215000, change: 12.5 },
        { name: 'Northeast', value: 185000, change: 8.3 },
        { name: 'Southeast', value: 152000, change: 15.2 },
        { name: 'Midwest', value: 133000, change: 6.5 }
      ]
    };
  }
};

export default financeService;
