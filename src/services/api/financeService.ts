
import apiClient, { handleApiError } from '@/utils/apiUtils';
import config from '@/config/config';

// Define interfaces for finance-related data
interface FinancialRecord {
  record_id: number;
  record_type: 'expense' | 'income';
  amount: number;
  description: string;
  record_date: string;
  created_at: string;
}

interface SalesMetrics {
  revenue: {
    current: number;
    previous: number;
    growth: number;
  };
  customers: {
    current: number;
    previous: number;
    growth: number;
  };
  average_deal_size: {
    current: number;
    previous: number;
    growth: number;
  };
  conversion_rate: {
    current: number;
    previous: number;
    growth: number;
  };
}

interface TeamCosts {
  department: string;
  cost: number;
  employee_count: number;
  avg_salary: number;
  productivity_score: number;
}

interface UpsellOpportunity {
  client_id: number;
  client_name: string;
  current_revenue: number;
  potential_revenue: number;
  suggested_services: string[];
  probability: number;
  last_purchase: string;
}

// Create finance service
const financeService = {
  // Invoices
  getInvoices: async (status?: string) => {
    try {
      let url = '/finance/invoices';
      if (status) {
        url += `?status=${status}`;
      }
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      return handleApiError(error, []);
    }
  },
  
  getInvoiceDetails: async (invoiceId: number) => {
    try {
      const response = await apiClient.get(`/finance/invoices/${invoiceId}`);
      return response.data;
    } catch (error) {
      return handleApiError(error, null);
    }
  },
  
  createInvoice: async (invoiceData: any) => {
    try {
      const response = await apiClient.post('/finance/invoices', invoiceData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  updateInvoiceStatus: async (invoiceId: number, status: string) => {
    try {
      const response = await apiClient.put(`/finance/invoices/${invoiceId}/status`, { status });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  sendInvoiceReminder: async (invoiceId: number) => {
    try {
      if (!config.useRealApi) {
        // Mock implementation
        return new Promise<{success: boolean, message: string}>((resolve) => {
          setTimeout(() => {
            resolve({ success: true, message: "Reminder sent successfully" });
          }, 500);
        });
      }
      
      const response = await apiClient.post(`/finance/invoices/${invoiceId}/remind`);
      return response.data;
    } catch (error) {
      return handleApiError(error, { success: false, message: "Failed to send reminder" });
    }
  },
  
  // Reports
  getRevenueReports: async (startDate?: string, endDate?: string) => {
    try {
      let url = '/finance/reports/revenue';
      const params = new URLSearchParams();
      
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      return handleApiError(error, []);
    }
  },
  
  getExpenseReports: async (startDate?: string, endDate?: string) => {
    try {
      let url = '/finance/reports/expenses';
      const params = new URLSearchParams();
      
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      return handleApiError(error, []);
    }
  },
  
  // Financial records
  getFinancialRecords: async (
    type?: 'expense' | 'income',
    startDate?: string,
    endDate?: string
  ) => {
    try {
      if (!config.useRealApi) {
        // Mock implementation
        return new Promise<FinancialRecord[]>((resolve) => {
          setTimeout(() => {
            const mockRecords: FinancialRecord[] = [
              {
                record_id: 1,
                record_type: 'income',
                amount: 5000,
                description: 'Client payment - Website redesign',
                record_date: '2023-05-15',
                created_at: '2023-05-15T10:30:00Z'
              },
              {
                record_id: 2,
                record_type: 'expense',
                amount: 1200,
                description: 'Office rent',
                record_date: '2023-05-01',
                created_at: '2023-05-01T09:00:00Z'
              },
              {
                record_id: 3,
                record_type: 'expense',
                amount: 350,
                description: 'Software subscriptions',
                record_date: '2023-05-05',
                created_at: '2023-05-05T14:20:00Z'
              },
              {
                record_id: 4,
                record_type: 'income',
                amount: 3500,
                description: 'Client payment - Logo design',
                record_date: '2023-05-20',
                created_at: '2023-05-20T11:45:00Z'
              }
            ];
            
            let filteredRecords = [...mockRecords];
            
            if (type) {
              filteredRecords = filteredRecords.filter(record => record.record_type === type);
            }
            
            if (startDate) {
              filteredRecords = filteredRecords.filter(record => 
                new Date(record.record_date) >= new Date(startDate)
              );
            }
            
            if (endDate) {
              filteredRecords = filteredRecords.filter(record => 
                new Date(record.record_date) <= new Date(endDate)
              );
            }
            
            resolve(filteredRecords);
          }, 500);
        });
      }
      
      let url = '/finance/records';
      const params = new URLSearchParams();
      
      if (type) params.append('type', type);
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      return handleApiError(error, []);
    }
  },
  
  createFinancialRecord: async (recordData: Omit<FinancialRecord, 'record_id' | 'created_at'>) => {
    try {
      if (!config.useRealApi) {
        // Mock implementation
        return new Promise<FinancialRecord>((resolve) => {
          setTimeout(() => {
            const newRecord: FinancialRecord = {
              ...recordData,
              record_id: Math.floor(Math.random() * 1000) + 5,
              created_at: new Date().toISOString()
            };
            resolve(newRecord);
          }, 500);
        });
      }
      
      const response = await apiClient.post('/finance/records', recordData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Dashboard data
  getFinancialOverview: async (period: 'month' | 'quarter' | 'year' = 'month') => {
    try {
      if (!config.useRealApi) {
        // Mock implementation
        return new Promise<any>((resolve) => {
          setTimeout(() => {
            const mockData = {
              income: 85000,
              expenses: 62000,
              profit: 23000,
              profit_margin: 27.06,
              outstanding_invoices: 15000,
              monthly_revenue: [
                { month: 'Jan', value: 65000 },
                { month: 'Feb', value: 68000 },
                { month: 'Mar', value: 72000 },
                { month: 'Apr', value: 75000 },
                { month: 'May', value: 85000 },
                { month: 'Jun', value: 0 }, // Future month
              ],
              revenue_by_client: [
                { name: 'Client A', value: 32000 },
                { name: 'Client B', value: 18000 },
                { name: 'Client C', value: 15000 },
                { name: 'Client D', value: 12000 },
                { name: 'Others', value: 8000 },
              ]
            };
            resolve(mockData);
          }, 500);
        });
      }
      
      const response = await apiClient.get(`/finance/overview?period=${period}`);
      return response.data;
    } catch (error) {
      return handleApiError(error, {
        income: 0,
        expenses: 0,
        profit: 0,
        profit_margin: 0,
        outstanding_invoices: 0,
        monthly_revenue: [],
        revenue_by_client: []
      });
    }
  },
  
  getFinancialMetrics: async () => {
    try {
      if (!config.useRealApi) {
        // Mock implementation
        return new Promise<any>((resolve) => {
          setTimeout(() => {
            const mockData = {
              current_month: {
                revenue: 85000,
                expenses: 62000,
                profit: 23000,
                profit_margin: 27.06
              },
              previous_month: {
                revenue: 75000,
                expenses: 58000,
                profit: 17000,
                profit_margin: 22.67
              },
              year_to_date: {
                revenue: 410000,
                expenses: 310000,
                profit: 100000,
                profit_margin: 24.39
              },
              metrics: {
                cash_flow: 18000,
                burn_rate: 62000,
                runway_months: 6.5,
                average_invoice_value: 4250
              }
            };
            resolve(mockData);
          }, 500);
        });
      }
      
      const response = await apiClient.get('/finance/metrics');
      return response.data;
    } catch (error) {
      return handleApiError(error, {
        current_month: {
          revenue: 0,
          expenses: 0,
          profit: 0,
          profit_margin: 0
        },
        previous_month: {
          revenue: 0,
          expenses: 0,
          profit: 0,
          profit_margin: 0
        },
        year_to_date: {
          revenue: 0,
          expenses: 0,
          profit: 0,
          profit_margin: 0
        },
        metrics: {
          cash_flow: 0,
          burn_rate: 0,
          runway_months: 0,
          average_invoice_value: 0
        }
      });
    }
  },
  
  getFinancialPlans: async () => {
    try {
      if (!config.useRealApi) {
        // Mock implementation
        return new Promise<any[]>((resolve) => {
          setTimeout(() => {
            const mockPlans = [
              {
                id: 1,
                title: 'Q3 Growth Plan',
                description: 'Strategic plan to increase revenue by 20% in Q3 2023',
                created_at: '2023-04-15T10:00:00Z',
                status: 'active',
                goals: [
                  { id: 1, title: 'Increase client base', target: '15 new clients', progress: 60 },
                  { id: 2, title: 'Optimize expenses', target: 'Reduce by 10%', progress: 40 },
                  { id: 3, title: 'Expand service offerings', target: '3 new services', progress: 30 }
                ]
              },
              {
                id: 2,
                title: '2023 Budget Plan',
                description: 'Annual budget allocation and financial forecasting',
                created_at: '2023-01-05T09:30:00Z',
                status: 'active',
                goals: [
                  { id: 4, title: 'Maintain profit margin', target: '≥ 25%', progress: 90 },
                  { id: 5, title: 'Capital investments', target: '$50,000 allocation', progress: 70 },
                  { id: 6, title: 'Emergency fund', target: '3 months runway', progress: 100 }
                ]
              }
            ];
            resolve(mockPlans);
          }, 500);
        });
      }
      
      const response = await apiClient.get('/finance/plans');
      return response.data;
    } catch (error) {
      return handleApiError(error, []);
    }
  },
  
  getUpsellOpportunities: async () => {
    try {
      if (!config.useRealApi) {
        // Mock implementation
        return new Promise<UpsellOpportunity[]>((resolve) => {
          setTimeout(() => {
            const mockOpportunities: UpsellOpportunity[] = [
              {
                client_id: 1,
                client_name: 'ABC Corporation',
                current_revenue: 15000,
                potential_revenue: 25000,
                suggested_services: ['SEO Optimization', 'Content Marketing'],
                probability: 75,
                last_purchase: '2023-04-10'
              },
              {
                client_id: 2,
                client_name: 'XYZ Industries',
                current_revenue: 8000,
                potential_revenue: 12000,
                suggested_services: ['Social Media Management', 'Email Marketing'],
                probability: 60,
                last_purchase: '2023-03-22'
              },
              {
                client_id: 3,
                client_name: 'Global Innovations',
                current_revenue: 20000,
                potential_revenue: 35000,
                suggested_services: ['Website Redesign', 'Mobile App Development'],
                probability: 80,
                last_purchase: '2023-05-05'
              }
            ];
            resolve(mockOpportunities);
          }, 500);
        });
      }
      
      const response = await apiClient.get('/finance/upsell-opportunities');
      return response.data;
    } catch (error) {
      return handleApiError(error, []);
    }
  },
  
  // Sales analytics
  getSalesMetrics: async (period: 'week' | 'month' | 'quarter' | 'year' = 'month') => {
    try {
      if (!config.useRealApi) {
        // Mock implementation
        return new Promise<SalesMetrics>((resolve) => {
          setTimeout(() => {
            const mockMetrics: SalesMetrics = {
              revenue: {
                current: 85000,
                previous: 75000,
                growth: 13.33
              },
              customers: {
                current: 15,
                previous: 12,
                growth: 25
              },
              average_deal_size: {
                current: 5667,
                previous: 6250,
                growth: -9.33
              },
              conversion_rate: {
                current: 18,
                previous: 15,
                growth: 20
              }
            };
            resolve(mockMetrics);
          }, 500);
        });
      }
      
      const response = await apiClient.get(`/finance/sales/metrics?period=${period}`);
      return response.data;
    } catch (error) {
      return handleApiError(error, {
        revenue: { current: 0, previous: 0, growth: 0 },
        customers: { current: 0, previous: 0, growth: 0 },
        average_deal_size: { current: 0, previous: 0, growth: 0 },
        conversion_rate: { current: 0, previous: 0, growth: 0 }
      });
    }
  },
  
  getSalesTrends: async () => {
    try {
      if (!config.useRealApi) {
        // Mock implementation
        return new Promise<any>((resolve) => {
          setTimeout(() => {
            const mockTrends = {
              monthly_sales: [
                { month: 'Jan', value: 65000 },
                { month: 'Feb', value: 68000 },
                { month: 'Mar', value: 72000 },
                { month: 'Apr', value: 75000 },
                { month: 'May', value: 85000 },
              ],
              quarterly_growth: [
                { quarter: 'Q1', growth: 8.5 },
                { quarter: 'Q2', growth: 13.3 },
                { quarter: 'Q3', growth: 7.2 },
                { quarter: 'Q4', growth: 15.6 },
              ]
            };
            resolve(mockTrends);
          }, 500);
        });
      }
      
      const response = await apiClient.get('/finance/sales/trends');
      return response.data;
    } catch (error) {
      return handleApiError(error, { monthly_sales: [], quarterly_growth: [] });
    }
  },
  
  getSalesByChannel: async () => {
    try {
      if (!config.useRealApi) {
        // Mock implementation
        return new Promise<any>((resolve) => {
          setTimeout(() => {
            const mockData = [
              { channel: 'Direct', value: 45000 },
              { channel: 'Referral', value: 20000 },
              { channel: 'Social Media', value: 15000 },
              { channel: 'Website', value: 12000 },
              { channel: 'Other', value: 8000 },
            ];
            resolve(mockData);
          }, 500);
        });
      }
      
      const response = await apiClient.get('/finance/sales/channels');
      return response.data;
    } catch (error) {
      return handleApiError(error, []);
    }
  },
  
  getTopProducts: async () => {
    try {
      if (!config.useRealApi) {
        // Mock implementation
        return new Promise<any>((resolve) => {
          setTimeout(() => {
            const mockData = [
              { product: 'Website Development', value: 35000 },
              { product: 'SEO Services', value: 18000 },
              { product: 'Content Marketing', value: 15000 },
              { product: 'UI/UX Design', value: 12000 },
              { product: 'Social Media Mgmt', value: 10000 },
            ];
            resolve(mockData);
          }, 500);
        });
      }
      
      const response = await apiClient.get('/finance/sales/products');
      return response.data;
    } catch (error) {
      return handleApiError(error, []);
    }
  },
  
  getSalesFollowUps: async () => {
    try {
      if (!config.useRealApi) {
        // Mock implementation
        return new Promise<any[]>((resolve) => {
          setTimeout(() => {
            const mockData = [
              {
                id: 1,
                client_name: 'Acme Corp',
                contact_name: 'John Smith',
                contact_email: 'john@acmecorp.com',
                contact_phone: '+1 555-123-4567',
                last_contact: '2023-05-10',
                next_contact_due: '2023-05-17',
                status: 'pending',
                opportunity_value: 12000,
                notes: 'Discussed website redesign, needs follow-up proposal'
              },
              {
                id: 2,
                client_name: 'TechSolutions Inc',
                contact_name: 'Sarah Jones',
                contact_email: 'sarah@techsolutions.com',
                contact_phone: '+1 555-987-6543',
                last_contact: '2023-05-05',
                next_contact_due: '2023-05-15',
                status: 'overdue',
                opportunity_value: 8500,
                notes: 'Interested in SEO services, sent initial quote'
              },
              {
                id: 3,
                client_name: 'Global Media',
                contact_name: 'Michael Brown',
                contact_email: 'michael@globalmedia.com',
                contact_phone: '+1 555-456-7890',
                last_contact: '2023-05-12',
                next_contact_due: '2023-05-19',
                status: 'pending',
                opportunity_value: 15000,
                notes: 'Needs social media management, considering our premium package'
              }
            ];
            resolve(mockData);
          }, 500);
        });
      }
      
      const response = await apiClient.get('/finance/sales/follow-ups');
      return response.data;
    } catch (error) {
      return handleApiError(error, []);
    }
  },
  
  getImprovementSuggestions: async () => {
    try {
      if (!config.useRealApi) {
        // Mock implementation
        return new Promise<any[]>((resolve) => {
          setTimeout(() => {
            const mockData = [
              {
                id: 1,
                title: 'Implement CRM Follow-up Reminders',
                description: 'Set automated reminders for sales follow-ups to reduce missed opportunities',
                impact: 'high',
                effort: 'medium',
                estimated_value: 15000,
                implementation_time: '2 weeks'
              },
              {
                id: 2,
                title: 'Optimize Pricing Tiers',
                description: 'Adjust service pricing tiers based on competitor analysis and client feedback',
                impact: 'high',
                effort: 'low',
                estimated_value: 25000,
                implementation_time: '1 week'
              },
              {
                id: 3,
                title: 'Create Case Studies',
                description: 'Develop detailed case studies for top 5 client success stories to use in sales process',
                impact: 'medium',
                effort: 'medium',
                estimated_value: 12000,
                implementation_time: '3 weeks'
              }
            ];
            resolve(mockData);
          }, 500);
        });
      }
      
      const response = await apiClient.get('/finance/sales/improvement-suggestions');
      return response.data;
    } catch (error) {
      return handleApiError(error, []);
    }
  },
  
  completeFollowUp: async (followUpId: number, notes: string) => {
    try {
      if (!config.useRealApi) {
        // Mock implementation
        return new Promise<{success: boolean}>((resolve) => {
          setTimeout(() => {
            resolve({ success: true });
          }, 500);
        });
      }
      
      const response = await apiClient.post(`/finance/sales/follow-ups/${followUpId}/complete`, { notes });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getSalesGrowthData: async (period: 'month' | 'quarter' | 'year' = 'month') => {
    try {
      if (!config.useRealApi) {
        // Mock implementation
        return new Promise<any>((resolve) => {
          setTimeout(() => {
            const mockData = {
              trends: [
                { period: 'Jan', current_year: 65000, previous_year: 58000 },
                { period: 'Feb', current_year: 68000, previous_year: 60000 },
                { period: 'Mar', current_year: 72000, previous_year: 62000 },
                { period: 'Apr', current_year: 75000, previous_year: 65000 },
                { period: 'May', current_year: 85000, previous_year: 68000 },
              ],
              growth_rate: 18.5,
              year_over_year: 15.2,
              forecast_next_period: 92000
            };
            resolve(mockData);
          }, 500);
        });
      }
      
      const response = await apiClient.get(`/finance/sales/growth?period=${period}`);
      return response.data;
    } catch (error) {
      return handleApiError(error, { trends: [], growth_rate: 0, year_over_year: 0, forecast_next_period: 0 });
    }
  },
  
  getSalesTargets: async () => {
    try {
      if (!config.useRealApi) {
        // Mock implementation
        return new Promise<any>((resolve) => {
          setTimeout(() => {
            const mockData = {
              overall: { target: 100000, actual: 85000, percentage: 85 },
              by_service: [
                { service: 'Website Development', target: 40000, actual: 35000, percentage: 87.5 },
                { service: 'SEO Services', target: 20000, actual: 18000, percentage: 90 },
                { service: 'Content Marketing', target: 20000, actual: 15000, percentage: 75 },
                { service: 'UI/UX Design', target: 15000, actual: 12000, percentage: 80 },
                { service: 'Social Media Mgmt', target: 15000, actual: 10000, percentage: 66.7 },
              ],
              team_performance: [
                { member: 'Sarah Wilson', target: 25000, actual: 28000, percentage: 112 },
                { member: 'John Davis', target: 25000, actual: 22000, percentage: 88 },
                { member: 'Emily Thompson', target: 20000, actual: 17500, percentage: 87.5 },
                { member: 'Michael Brown', target: 20000, actual: 15000, percentage: 75 },
              ]
            };
            resolve(mockData);
          }, 500);
        });
      }
      
      const response = await apiClient.get('/finance/sales/targets');
      return response.data;
    } catch (error) {
      return handleApiError(error, { overall: {}, by_service: [], team_performance: [] });
    }
  },
  
  getGrowthForecast: async () => {
    try {
      if (!config.useRealApi) {
        // Mock implementation
        return new Promise<any>((resolve) => {
          setTimeout(() => {
            const mockData = {
              forecast: [
                { month: 'Jun', value: 92000 },
                { month: 'Jul', value: 98000 },
                { month: 'Aug', value: 105000 },
                { month: 'Sep', value: 110000 },
                { month: 'Oct', value: 120000 },
                { month: 'Nov', value: 135000 },
                { month: 'Dec', value: 150000 },
              ],
              annual_growth_estimate: 22.5,
              confidence_level: 85,
              factors: [
                { factor: 'Market conditions', impact: 'positive', weight: 0.3 },
                { factor: 'Team expansion', impact: 'positive', weight: 0.25 },
                { factor: 'Competition', impact: 'neutral', weight: 0.2 },
                { factor: 'Economic outlook', impact: 'positive', weight: 0.25 },
              ]
            };
            resolve(mockData);
          }, 500);
        });
      }
      
      const response = await apiClient.get('/finance/sales/forecast');
      return response.data;
    } catch (error) {
      return handleApiError(error, { forecast: [], annual_growth_estimate: 0, confidence_level: 0, factors: [] });
    }
  },
  
  getWeeklyReports: async () => {
    try {
      if (!config.useRealApi) {
        // Mock implementation
        return new Promise<any[]>((resolve) => {
          setTimeout(() => {
            const mockData = [
              {
                id: 1,
                week: 'May 8-14, 2023',
                revenue: 21500,
                leads: 12,
                conversions: 3,
                highlights: [
                  'Closed deal with Acme Corp worth $8,500',
                  'New lead from LinkedIn campaign showing high interest',
                  'Improved conversion rate by 2.5% from previous week'
                ],
                challenges: [
                  'One client meeting postponed to next week',
                  'Website lead form had technical issues for 2 hours'
                ]
              },
              {
                id: 2,
                week: 'May 1-7, 2023',
                revenue: 18200,
                leads: 10,
                conversions: 2,
                highlights: [
                  'Renewed contract with TechSolutions Inc',
                  'Successful product demo with 3 potential clients',
                  'Social media campaign exceeded target reach by 30%'
                ],
                challenges: [
                  'One proposal rejected due to budget constraints',
                  'Sales team training took away from prospecting time'
                ]
              }
            ];
            resolve(mockData);
          }, 500);
        });
      }
      
      const response = await apiClient.get('/finance/sales/reports/weekly');
      return response.data;
    } catch (error) {
      return handleApiError(error, []);
    }
  },
  
  getMonthlyReports: async () => {
    try {
      if (!config.useRealApi) {
        // Mock implementation
        return new Promise<any[]>((resolve) => {
          setTimeout(() => {
            const mockData = [
              {
                id: 1,
                month: 'May 2023',
                revenue: 85000,
                new_clients: 3,
                leads: 45,
                conversion_rate: 6.7,
                average_deal_size: 5667,
                top_performers: [
                  { name: 'Sarah Wilson', sales: 28000 },
                  { name: 'John Davis', sales: 22000 }
                ],
                highlights: [
                  'Highest monthly revenue in 2023 so far',
                  'New service package launched successfully',
                  'Reduced sales cycle time by 15%'
                ],
                action_items: [
                  'Review pricing strategy for enterprise clients',
                  'Implement new CRM follow-up reminders',
                  'Schedule team training on new service offerings'
                ]
              },
              {
                id: 2,
                month: 'April 2023',
                revenue: 75000,
                new_clients: 2,
                leads: 38,
                conversion_rate: 5.3,
                average_deal_size: 6250,
                top_performers: [
                  { name: 'Sarah Wilson', sales: 25000 },
                  { name: 'Emily Thompson', sales: 18000 }
                ],
                highlights: [
                  'Closed major deal with Global Media',
                  'Implemented new sales process documentation',
                  'LinkedIn campaign generated 15 qualified leads'
                ],
                action_items: [
                  'Follow up with 3 prospects in final decision stage',
                  'Update case studies with recent successes',
                  'Review competitor pricing changes'
                ]
              }
            ];
            resolve(mockData);
          }, 500);
        });
      }
      
      const response = await apiClient.get('/finance/sales/reports/monthly');
      return response.data;
    } catch (error) {
      return handleApiError(error, []);
    }
  },
  
  analyzeTeamCosts: async () => {
    try {
      if (!config.useRealApi) {
        // Mock implementation
        return new Promise<{ teams: TeamCosts[], recommendations: string[] }>((resolve) => {
          setTimeout(() => {
            const mockData = {
              teams: [
                { 
                  department: 'Development', 
                  cost: 205000, 
                  employee_count: 8, 
                  avg_salary: 92500, 
                  productivity_score: 87 
                },
                { 
                  department: 'Design', 
                  cost: 180000, 
                  employee_count: 5, 
                  avg_salary: 85000, 
                  productivity_score: 92 
                },
                { 
                  department: 'Marketing', 
                  cost: 155000, 
                  employee_count: 4, 
                  avg_salary: 77500, 
                  productivity_score: 85 
                },
                { 
                  department: 'Sales', 
                  cost: 195000, 
                  employee_count: 4, 
                  avg_salary: 97500, 
                  productivity_score: 90 
                },
                { 
                  department: 'Admin', 
                  cost: 125000, 
                  employee_count: 3, 
                  avg_salary: 62500, 
                  productivity_score: 84 
                }
              ],
              recommendations: [
                "Development team productivity could improve with additional training in new technologies.",
                "Design team shows highest productivity to cost ratio - consider expanding this team.",
                "Marketing team has slightly lower productivity score but is essential for growth.",
                "Sales team compensation closely tied to performance - continue incentive program.",
                "Admin costs could be optimized through automation of routine tasks."
              ]
            };
            resolve(mockData);
          }, 500);
        });
      }
      
      const response = await apiClient.get('/finance/team-costs/analysis');
      return response.data;
    } catch (error) {
      return handleApiError(error, { teams: [], recommendations: [] });
    }
  }
};

export default financeService;
