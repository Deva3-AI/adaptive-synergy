
// Financial Service API functions

const financeService = {
  // Invoice related functions
  getInvoices: async (status?: string) => {
    try {
      // Mock API call - in a real app, this would call your backend API
      const allInvoices = [
        {
          id: 1,
          invoice_number: 'INV-2023-001',
          client_id: 1,
          client_name: 'ABC Corporation',
          amount: 5000,
          issue_date: '2023-06-01',
          due_date: '2023-06-15',
          status: 'paid',
          payment_date: '2023-06-10'
        },
        {
          id: 2,
          invoice_number: 'INV-2023-002',
          client_id: 2,
          client_name: 'XYZ Inc',
          amount: 7500,
          issue_date: '2023-06-05',
          due_date: '2023-06-20',
          status: 'pending',
          payment_date: null
        },
        {
          id: 3,
          invoice_number: 'INV-2023-003',
          client_id: 3,
          client_name: 'Acme Ltd',
          amount: 3000,
          issue_date: '2023-05-20',
          due_date: '2023-06-04',
          status: 'overdue',
          payment_date: null
        }
      ];
      
      if (status) {
        return allInvoices.filter(inv => inv.status === status);
      }
      
      return allInvoices;
    } catch (error) {
      console.error('Error getting invoices:', error);
      throw error;
    }
  },
  
  getInvoiceDetails: async (invoiceId: number) => {
    try {
      // Mock API call - in a real app, this would call your backend API
      return {
        id: invoiceId,
        invoice_number: 'INV-2023-001',
        client_id: 1,
        client_name: 'ABC Corporation',
        client_email: 'billing@abccorp.com',
        client_address: '123 Business St, City, Country',
        amount: 5000,
        tax: 500,
        total: 5500,
        issue_date: '2023-06-01',
        due_date: '2023-06-15',
        status: 'paid',
        payment_date: '2023-06-10',
        payment_method: 'bank_transfer',
        items: [
          {
            id: 1,
            description: 'Web Development Services',
            quantity: 1,
            unit_price: 3000,
            amount: 3000
          },
          {
            id: 2,
            description: 'UI/UX Design',
            quantity: 1,
            unit_price: 2000,
            amount: 2000
          }
        ],
        notes: 'Thank you for your business!'
      };
    } catch (error) {
      console.error('Error getting invoice details:', error);
      throw error;
    }
  },
  
  createInvoice: async (invoiceData: any) => {
    try {
      // Mock API call - in a real app, this would call your backend API
      return {
        id: 4,
        invoice_number: 'INV-2023-004',
        ...invoiceData,
        created_at: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error creating invoice:', error);
      throw error;
    }
  },
  
  updateInvoiceStatus: async (invoiceId: number, status: string) => {
    try {
      // Mock API call - in a real app, this would call your backend API
      return {
        id: invoiceId,
        status,
        updated_at: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error updating invoice status:', error);
      throw error;
    }
  },
  
  // Report related functions
  getRevenueReports: async (startDate?: string, endDate?: string) => {
    try {
      // Mock API call - in a real app, this would call your backend API
      return {
        total_revenue: 85000,
        period: {
          start_date: startDate || '2023-01-01',
          end_date: endDate || '2023-06-30'
        },
        monthly_breakdown: [
          { month: 'January', revenue: 12000 },
          { month: 'February', revenue: 14000 },
          { month: 'March', revenue: 15000 },
          { month: 'April', revenue: 13500 },
          { month: 'May', revenue: 16500 },
          { month: 'June', revenue: 14000 }
        ],
        client_breakdown: [
          { client_name: 'ABC Corporation', revenue: 25000 },
          { client_name: 'XYZ Inc', revenue: 20000 },
          { client_name: 'Acme Ltd', revenue: 15000 },
          { client_name: 'Others', revenue: 25000 }
        ],
        service_breakdown: [
          { service: 'Web Development', revenue: 35000 },
          { service: 'UI/UX Design', revenue: 25000 },
          { service: 'Content Creation', revenue: 15000 },
          { service: 'Maintenance', revenue: 10000 }
        ]
      };
    } catch (error) {
      console.error('Error getting revenue reports:', error);
      throw error;
    }
  },
  
  getExpenseReports: async (startDate?: string, endDate?: string) => {
    try {
      // Mock API call - in a real app, this would call your backend API
      return {
        total_expenses: 65000,
        period: {
          start_date: startDate || '2023-01-01',
          end_date: endDate || '2023-06-30'
        },
        monthly_breakdown: [
          { month: 'January', expenses: 10000 },
          { month: 'February', expenses: 11000 },
          { month: 'March', expenses: 10500 },
          { month: 'April', expenses: 11500 },
          { month: 'May', expenses: 11000 },
          { month: 'June', expenses: 11000 }
        ],
        category_breakdown: [
          { category: 'Salaries', expenses: 45000 },
          { category: 'Office Rent', expenses: 12000 },
          { category: 'Software Subscriptions', expenses: 5000 },
          { category: 'Marketing', expenses: 3000 }
        ]
      };
    } catch (error) {
      console.error('Error getting expense reports:', error);
      throw error;
    }
  },
  
  // Additional functions to address the missing methods
  getFinancialOverview: async () => {
    try {
      // Mock API call - in a real app, this would call your backend API
      return {
        monthly_revenue: 25000,
        monthly_expenses: 18000,
        monthly_profit: 7000,
        growth_rate: 0.15,
        cash_flow: 'positive',
        accounts_receivable: 45000,
        accounts_payable: 15000,
        cash_on_hand: 80000
      };
    } catch (error) {
      console.error('Error getting financial overview:', error);
      throw error;
    }
  },
  
  getFinancialMetrics: async () => {
    try {
      // Mock API call - in a real app, this would call your backend API
      return {
        profitability: {
          gross_margin: 0.65,
          net_margin: 0.22,
          operating_margin: 0.28
        },
        liquidity: {
          current_ratio: 2.5,
          quick_ratio: 2.0,
          cash_ratio: 1.2
        },
        efficiency: {
          asset_turnover: 1.8,
          inventory_turnover: 12,
          receivables_turnover: 8.5
        },
        growth: {
          revenue_growth: 0.18,
          profit_growth: 0.22,
          client_growth: 0.15
        },
        projections: {
          revenue_next_quarter: 85000,
          expenses_next_quarter: 65000,
          profit_next_quarter: 20000
        }
      };
    } catch (error) {
      console.error('Error getting financial metrics:', error);
      throw error;
    }
  },
  
  getFinancialRecords: async () => {
    try {
      // Mock API call - in a real app, this would call your backend API
      return [
        {
          id: 1,
          record_type: 'income',
          amount: 15000,
          description: 'Client payment - ABC Corp',
          category: 'services',
          date: '2023-06-10',
          recorded_by: 'Finance Team'
        },
        {
          id: 2,
          record_type: 'expense',
          amount: 5000,
          description: 'Office rent',
          category: 'facilities',
          date: '2023-06-01',
          recorded_by: 'Finance Team'
        },
        {
          id: 3,
          record_type: 'expense',
          amount: 2500,
          description: 'Software subscriptions',
          category: 'software',
          date: '2023-06-05',
          recorded_by: 'Finance Team'
        },
        {
          id: 4,
          record_type: 'income',
          amount: 8000,
          description: 'Client payment - XYZ Inc',
          category: 'services',
          date: '2023-06-15',
          recorded_by: 'Finance Team'
        }
      ];
    } catch (error) {
      console.error('Error getting financial records:', error);
      throw error;
    }
  },
  
  getUpsellOpportunities: async () => {
    try {
      // Mock API call - in a real app, this would call your backend API
      return [
        {
          client_id: 1,
          client_name: 'ABC Corporation',
          current_services: ['Web Development', 'UI/UX Design'],
          potential_services: ['Maintenance Plan', 'SEO Services'],
          estimated_value: 10000,
          probability: 'high'
        },
        {
          client_id: 2,
          client_name: 'XYZ Inc',
          current_services: ['Content Creation'],
          potential_services: ['Social Media Management', 'Email Marketing'],
          estimated_value: 8000,
          probability: 'medium'
        }
      ];
    } catch (error) {
      console.error('Error getting upsell opportunities:', error);
      throw error;
    }
  },
  
  getFinancialPlans: async () => {
    try {
      // Mock API call - in a real app, this would call your backend API
      return [
        {
          id: 1,
          title: 'Q3 Financial Plan',
          description: 'Financial strategy for Q3 2023',
          status: 'active',
          period: {
            start_date: '2023-07-01',
            end_date: '2023-09-30'
          },
          targets: {
            revenue: 100000,
            expenses: 70000,
            profit: 30000
          },
          initiatives: [
            {
              title: 'Implement new invoicing system',
              status: 'in_progress',
              impact: 'Reduce invoicing time by 50%'
            },
            {
              title: 'Review subscription costs',
              status: 'not_started',
              impact: 'Reduce monthly expenses by 10%'
            }
          ]
        },
        {
          id: 2,
          title: 'Annual Budget Plan',
          description: 'Budget planning for fiscal year 2023',
          status: 'active',
          period: {
            start_date: '2023-01-01',
            end_date: '2023-12-31'
          },
          targets: {
            revenue: 400000,
            expenses: 280000,
            profit: 120000
          },
          initiatives: [
            {
              title: 'Diversify client portfolio',
              status: 'in_progress',
              impact: 'Reduce dependency on top 3 clients from 60% to 40%'
            },
            {
              title: 'Implement profit-sharing program',
              status: 'completed',
              impact: 'Improve employee retention and performance'
            }
          ]
        }
      ];
    } catch (error) {
      console.error('Error getting financial plans:', error);
      throw error;
    }
  },
  
  sendInvoiceReminder: async (invoiceId: number) => {
    try {
      // Mock API call - in a real app, this would call your backend API
      return {
        success: true,
        message: 'Reminder sent successfully',
        sent_at: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error sending invoice reminder:', error);
      throw error;
    }
  },
  
  analyzeTeamCosts: async (startDate?: string, endDate?: string) => {
    try {
      // Mock API call - in a real app, this would call your backend API
      return {
        total_costs: 150000,
        period: {
          start_date: startDate || '2023-01-01',
          end_date: endDate || '2023-06-30'
        },
        departments: [
          {
            name: 'Development',
            headcount: 5,
            cost: 75000,
            productivity: {
              hours_logged: 4000,
              tasks_completed: 120,
              cost_per_hour: 18.75
            }
          },
          {
            name: 'Design',
            headcount: 3,
            cost: 45000,
            productivity: {
              hours_logged: 2400,
              tasks_completed: 80,
              cost_per_hour: 18.75
            }
          },
          {
            name: 'Marketing',
            headcount: 2,
            cost: 30000,
            productivity: {
              hours_logged: 1600,
              tasks_completed: 60,
              cost_per_hour: 18.75
            }
          }
        ],
        insights: [
          'Development team has the highest efficiency rate',
          'Design team shows consistent performance',
          'Marketing team has the highest cost per task'
        ],
        recommendations: [
          'Consider additional training for marketing team',
          'Development team capacity could be increased',
          'Implement time tracking improvements for better analysis'
        ]
      };
    } catch (error) {
      console.error('Error analyzing team costs:', error);
      throw error;
    }
  }
};

export default financeService;
