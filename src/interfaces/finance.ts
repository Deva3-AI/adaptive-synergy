
export interface Invoice {
  invoice_id: number;
  client_id: number;
  invoice_number: string;
  amount: number;
  due_date?: string;
  status: 'pending' | 'paid' | 'overdue';
  created_at: string;
  client_name?: string;
}

export interface FinancialRecord {
  record_id: number;
  record_type: 'expense' | 'income';
  amount: number;
  description?: string;
  record_date: string;
  created_at: string;
  category?: string;
}

export interface FinancialMetrics {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number;
  monthlyGrowth: number;
  averageInvoiceValue: number;
  outstandingInvoices: number;
  cashFlow: {
    month: string;
    income: number;
    expense: number;
    net: number;
  }[];
}

export interface SalesMetrics {
  totalSales: number;
  salesGrowth: number;
  conversionRate: number;
  customerAcquisitionCost: number;
  averageSaleValue: number;
  salesByChannel: {
    channel: string;
    amount: number;
    percentage: number;
  }[];
  topProducts: {
    name: string;
    sales: number;
    revenue: number;
  }[];
}

export interface SalesFollowUp {
  id: number;
  clientName: string;
  contactPerson: string;
  email?: string;
  phone?: string;
  type: 'call' | 'email' | 'meeting';
  dueDate: string;
  notes?: string;
  status: 'pending' | 'completed' | 'cancelled';
}

export interface SalesTrend {
  date: string;
  sales: number;
  target?: number;
}

export interface SalesTarget {
  id: number;
  category: string;
  current: number;
  target: number;
  percentage: number;
}

export interface GrowthForecast {
  chart: {
    month: string;
    projected: number;
    target: number;
  }[];
  insights: {
    type: 'trend' | 'warning';
    text: string;
  }[];
}

export interface SalesReport {
  id: number;
  title: string;
  period: string;
  sales: number;
  target: number;
  progress: number;
  performanceData?: any[];
  metrics?: any;
  yearlyTrend?: any[];
}

export interface FinancialOverview {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number;
  revenueGrowth: number;
  expenseGrowth: number;
  topExpenseCategories: {
    category: string;
    amount: number;
    percentage: number;
  }[];
  revenueByClient: {
    client: string;
    amount: number;
    percentage: number;
  }[];
  cashflow: {
    month: string;
    income: number;
    expense: number;
    net: number;
  }[];
}

export interface UpsellOpportunity {
  clientId: number;
  clientName: string;
  currentServices: string[];
  recommendedServices: string[];
  potentialRevenue: number;
  probability: number;
}

export interface TeamCostAnalysis {
  totalCost: number;
  breakdown: {
    department: string;
    cost: number;
    percentage: number;
  }[];
  trends: {
    month: string;
    cost: number;
  }[];
}
