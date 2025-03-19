
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle, AlertTriangle, Plus, FileText, Download, Filter, DollarSign } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import DashboardCard from "@/components/dashboard/DashboardCard";
import AnalyticsChart from "@/components/dashboard/AnalyticsChart";

// Sample data for charts
const invoiceStatusData = [
  { name: "Paid", value: 38 },
  { name: "Pending", value: 12 },
  { name: "Overdue", value: 6 }
];

const FinanceInvoices = () => {
  return (
    <div className="space-y-8 animate-blur-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Invoice Management</h1>
          <p className="text-muted-foreground">
            Track, create, and manage client invoices
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Invoice
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">56</div>
            <p className="text-xs text-muted-foreground">In the last 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">38</div>
            <p className="text-xs text-muted-foreground">$285,420 received</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">$42,800 pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6</div>
            <p className="text-xs text-muted-foreground">$14,280 overdue</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <DashboardCard
          title="Payment Status"
          icon={<DollarSign className="h-5 w-5" />}
          className="md:col-span-3"
        >
          <AnalyticsChart 
            data={invoiceStatusData} 
            height={300}
            defaultType="pie"
          />
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="text-center">
              <div className="text-lg font-bold text-green-500">68%</div>
              <div className="text-sm">Payment Rate</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold">18 days</div>
              <div className="text-sm">Avg. Payment Time</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-red-500">11%</div>
              <div className="text-sm">Overdue Rate</div>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard
          title="Recent Invoices"
          icon={<FileText className="h-5 w-5" />}
          className="md:col-span-4"
        >
          <div className="space-y-4">
            {[
              { 
                id: "INV-2023-0538", 
                client: "Acme Corp", 
                amount: "$12,400", 
                issueDate: "Jun 15, 2023", 
                dueDate: "Jun 30, 2023", 
                status: "pending" 
              },
              { 
                id: "INV-2023-0537", 
                client: "TechNova Inc", 
                amount: "$8,750", 
                issueDate: "Jun 12, 2023", 
                dueDate: "Jun 27, 2023", 
                status: "pending" 
              },
              { 
                id: "INV-2023-0536", 
                client: "Global Media", 
                amount: "$15,200", 
                issueDate: "Jun 10, 2023", 
                dueDate: "Jun 25, 2023", 
                status: "paid" 
              },
              { 
                id: "INV-2023-0535", 
                client: "Bright Innovations", 
                amount: "$5,800", 
                issueDate: "Jun 5, 2023", 
                dueDate: "Jun 20, 2023", 
                status: "paid" 
              },
              { 
                id: "INV-2023-0534", 
                client: "Summit Industries", 
                amount: "$9,300", 
                issueDate: "Jun 1, 2023", 
                dueDate: "Jun 16, 2023", 
                status: "overdue" 
              }
            ].map((invoice, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    invoice.status === 'paid' ? 'bg-green-100 text-green-600 dark:bg-green-900/30' : 
                    invoice.status === 'pending' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30' : 
                    'bg-red-100 text-red-600 dark:bg-red-900/30'
                  }`}>
                    {invoice.status === 'paid' ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : invoice.status === 'pending' ? (
                      <Clock className="h-5 w-5" />
                    ) : (
                      <AlertTriangle className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{invoice.id}</div>
                    <div className="text-sm text-muted-foreground">{invoice.client}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{invoice.amount}</div>
                  <div className="text-sm text-muted-foreground">Due: {invoice.dueDate}</div>
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>

      <DashboardCard
        title="All Invoices"
        icon={<FileText className="h-5 w-5" />}
      >
        <div className="overflow-auto">
          <table className="min-w-full divide-y divide-border">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Invoice #</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Client</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Issue Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Due Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                { 
                  id: "INV-2023-0538", 
                  client: "Acme Corp", 
                  amount: "$12,400", 
                  issueDate: "Jun 15, 2023", 
                  dueDate: "Jun 30, 2023", 
                  status: "pending" 
                },
                { 
                  id: "INV-2023-0537", 
                  client: "TechNova Inc", 
                  amount: "$8,750", 
                  issueDate: "Jun 12, 2023", 
                  dueDate: "Jun 27, 2023", 
                  status: "pending" 
                },
                { 
                  id: "INV-2023-0536", 
                  client: "Global Media", 
                  amount: "$15,200", 
                  issueDate: "Jun 10, 2023", 
                  dueDate: "Jun 25, 2023", 
                  status: "paid" 
                },
                { 
                  id: "INV-2023-0535", 
                  client: "Bright Innovations", 
                  amount: "$5,800", 
                  issueDate: "Jun 5, 2023", 
                  dueDate: "Jun 20, 2023", 
                  status: "paid" 
                },
                { 
                  id: "INV-2023-0534", 
                  client: "Summit Industries", 
                  amount: "$9,300", 
                  issueDate: "Jun 1, 2023", 
                  dueDate: "Jun 16, 2023", 
                  status: "overdue" 
                },
                { 
                  id: "INV-2023-0533", 
                  client: "Vertex Solutions", 
                  amount: "$7,600", 
                  issueDate: "May 28, 2023", 
                  dueDate: "Jun 12, 2023", 
                  status: "paid" 
                },
                { 
                  id: "INV-2023-0532", 
                  client: "Creative Design Co", 
                  amount: "$4,250", 
                  issueDate: "May 25, 2023", 
                  dueDate: "Jun 9, 2023", 
                  status: "paid" 
                },
                { 
                  id: "INV-2023-0531", 
                  client: "EcoSmart Technologies", 
                  amount: "$11,800", 
                  issueDate: "May 22, 2023", 
                  dueDate: "Jun 6, 2023", 
                  status: "overdue" 
                }
              ].map((invoice, index) => (
                <tr key={index}>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="font-medium">{invoice.id}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {invoice.client}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {invoice.issueDate}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {invoice.dueDate}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="font-medium">{invoice.amount}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      invoice.status === 'paid' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                      invoice.status === 'pending' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' :
                      'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right">
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Download className="h-3.5 w-3.5 mr-1.5" />
                        PDF
                      </Button>
                      <Button variant="outline" size="sm">
                        <FileText className="h-3.5 w-3.5 mr-1.5" />
                        View
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DashboardCard>
    </div>
  );
};

export default FinanceInvoices;
