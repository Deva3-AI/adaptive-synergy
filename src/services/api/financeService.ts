
import { mockFinanceData } from '@/utils/mockData';

// Define finance service methods
const financeService = {
  // Invoices
  getInvoices: async (status?: string) => {
    // This would be an API call in a real app
    return new Promise((resolve) => {
      setTimeout(() => {
        let invoices = mockFinanceData.invoices;
        
        if (status) {
          invoices = invoices.filter(invoice => invoice.status === status);
        }
        
        resolve(invoices);
      }, 500);
    });
  },
  
  getInvoiceDetails: async (invoiceId: number) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const invoice = mockFinanceData.invoices.find(inv => 
          // Handle client_id access safely
          (typeof inv === 'object' && 'id' in inv) ? inv.id === invoiceId : false
        );
        
        if (invoice) {
          // Safe object spread for invoices
          const invoiceWithClient = {
            ...invoice,
            // Additional details could be added here
          };
          resolve(invoiceWithClient);
        } else {
          resolve(null);
        }
      }, 500);
    });
  },
  
  createInvoice: async (invoiceData: any) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real app, this would create an invoice in the database
        resolve({
          success: true,
          data: {
            id: Math.floor(Math.random() * 1000),
            ...invoiceData,
            created_at: new Date().toISOString()
          }
        });
      }, 500);
    });
  },
  
  updateInvoice: async (invoiceId: number, invoiceData: any) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real app, this would update an invoice in the database
        resolve({
          success: true,
          data: {
            id: invoiceId,
            ...invoiceData,
            updated_at: new Date().toISOString()
          }
        });
      }, 500);
    });
  },
  
  deleteInvoice: async (invoiceId: number) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real app, this would delete an invoice from the database
        resolve({ success: true });
      }, 500);
    });
  },
  
  // Financial metrics and overviews
  getFinancialOverview: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockFinanceData.financialOverview);
      }, 500);
    });
  },
  
  getFinancialMetrics: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockFinanceData.financialMetrics);
      }, 500);
    });
  },
  
  // Financial records
  getFinancialRecords: async (recordType?: string) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let records = mockFinanceData.financialRecords || [];
        
        if (recordType) {
          records = records.filter(record => record.record_type === recordType);
        }
        
        resolve(records);
      }, 500);
    });
  },
  
  createFinancialRecord: async (recordData: any) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real app, this would create a record in the database
        resolve({
          success: true,
          data: {
            record_id: Math.floor(Math.random() * 1000),
            ...recordData,
            created_at: new Date().toISOString()
          }
        });
      }, 500);
    });
  },
  
  updateFinancialRecord: async (recordId: number, recordData: any) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real app, this would update a record in the database
        resolve({
          success: true,
          data: {
            record_id: recordId,
            ...recordData,
            updated_at: new Date().toISOString()
          }
        });
      }, 500);
    });
  },
  
  deleteFinancialRecord: async (recordId: number) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real app, this would delete a record from the database
        resolve({ success: true });
      }, 500);
    });
  },
  
  // Sales analytics methods
  getSalesMetrics: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockFinanceData.salesMetrics);
      }, 500);
    });
  },
  
  getSalesTrends: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockFinanceData.salesTrends);
      }, 500);
    });
  },
  
  getSalesByChannel: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockFinanceData.salesByChannel);
      }, 500);
    });
  },
  
  getTopProducts: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockFinanceData.topProducts);
      }, 500);
    });
  },
  
  getSalesGrowthData: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockFinanceData.salesGrowth);
      }, 500);
    });
  },
  
  getSalesTargets: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockFinanceData.salesTargets);
      }, 500);
    });
  },
  
  getGrowthForecast: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockFinanceData.growthForecast);
      }, 500);
    });
  },
  
  getSalesFollowUps: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockFinanceData.salesFollowUps);
      }, 500);
    });
  },
  
  getImprovementSuggestions: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockFinanceData.improvementSuggestions);
      }, 500);
    });
  },
  
  completeFollowUp: async (followUpId: number) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real app, this would update a database
        resolve({ success: true });
      }, 500);
    });
  },
  
  // Team costs and analysis
  getTeamCosts: async (startDate?: string, endDate?: string) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockFinanceData.teamCostsAnalysis);
      }, 500);
    });
  },
  
  // Weekly and Monthly Reports
  getWeeklyReports: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockFinanceData.weeklyReports);
      }, 500);
    });
  },
  
  getMonthlyReports: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockFinanceData.monthlyReports);
      }, 500);
    });
  },
  
  // Invoice status and reminders
  updateInvoiceStatus: async (invoiceId: number, status: string) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            id: invoiceId,
            status,
            updated_at: new Date().toISOString()
          }
        });
      }, 500);
    });
  },
  
  sendInvoiceReminder: async (invoiceId: number) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: `Reminder sent for invoice #${invoiceId}`
        });
      }, 500);
    });
  },
  
  // Financial planning
  getFinancialPlans: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockFinanceData.financialPlans);
      }, 500);
    });
  },
  
  // Upsell opportunities
  getUpsellOpportunities: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockFinanceData.upsellOpportunities);
      }, 500);
    });
  }
};

export default financeService;
