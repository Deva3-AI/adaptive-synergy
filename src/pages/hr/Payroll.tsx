
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, DollarSign, Clock, Download, FileText, Filter, CreditCard, Briefcase } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DashboardCard from "@/components/dashboard/DashboardCard";
import AnalyticsChart from "@/components/dashboard/AnalyticsChart";

// Sample data for charts
const payrollTrendsData = [
  { name: "Jan", base: 92500, overtime: 4800, bonus: 10000 },
  { name: "Feb", base: 92500, overtime: 5200, bonus: 8000 },
  { name: "Mar", base: 95000, overtime: 4500, bonus: 7500 },
  { name: "Apr", base: 95000, overtime: 6100, bonus: 8500 },
  { name: "May", base: 97500, overtime: 5400, bonus: 9000 },
  { name: "Jun", base: 97500, overtime: 6800, bonus: 12000 },
];

const departmentExpenseData = [
  { name: "Engineering", value: 180000 },
  { name: "Marketing", value: 120000 },
  { name: "Sales", value: 150000 },
  { name: "Design", value: 90000 },
  { name: "Operations", value: 110000 },
  { name: "HR", value: 70000 },
];

const HrPayroll = () => {
  return (
    <div className="space-y-8 animate-blur-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payroll Management</h1>
          <p className="text-muted-foreground">
            Manage employee compensation and process payroll
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            June 2023
          </Button>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payroll</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$425,780</div>
            <p className="text-xs text-muted-foreground">For June 2023</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overtime Pay</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$27,520</div>
            <p className="text-xs text-muted-foreground">6.5% of total payroll</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bonus Payouts</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$42,000</div>
            <p className="text-xs text-muted-foreground">9.9% of total payroll</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Payroll</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">June 30, 2023</div>
            <p className="text-xs text-muted-foreground">Approval due in 5 days</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <DashboardCard
          title="Payroll Expense Breakdown"
          icon={<DollarSign className="h-5 w-5" />}
          className="md:col-span-4"
        >
          <AnalyticsChart 
            data={payrollTrendsData} 
            height={300}
            defaultType="bar"
          />
        </DashboardCard>

        <DashboardCard
          title="Department Expenses"
          icon={<Briefcase className="h-5 w-5" />}
          className="md:col-span-3"
        >
          <AnalyticsChart 
            data={departmentExpenseData} 
            height={300}
            defaultType="pie"
          />
        </DashboardCard>
      </div>

      <DashboardCard
        title="Employee Payroll Details"
        icon={<FileText className="h-5 w-5" />}
      >
        <div className="overflow-auto">
          <table className="min-w-full divide-y divide-border">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Employee</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Department</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Position</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Base Salary</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Overtime</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Bonus</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Total</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                { 
                  name: "Alex Johnson", 
                  image: null, 
                  department: "Engineering", 
                  position: "Sr. Developer",
                  baseSalary: "$9,500",
                  overtime: "$850",
                  bonus: "$1,500",
                  total: "$11,850"
                },
                { 
                  name: "Sarah Brown", 
                  image: null, 
                  department: "Design", 
                  position: "UX Designer",
                  baseSalary: "$8,200",
                  overtime: "$420",
                  bonus: "$1,000",
                  total: "$9,620"
                },
                { 
                  name: "Michael Wilson", 
                  image: null, 
                  department: "Marketing", 
                  position: "Marketing Lead",
                  baseSalary: "$8,800",
                  overtime: "$650",
                  bonus: "$1,200",
                  total: "$10,650"
                },
                { 
                  name: "Emily Davis", 
                  image: null, 
                  department: "Product", 
                  position: "Product Manager",
                  baseSalary: "$9,800",
                  overtime: "$0",
                  bonus: "$2,000",
                  total: "$11,800"
                },
                { 
                  name: "Robert Lee", 
                  image: null, 
                  department: "Sales", 
                  position: "Account Executive",
                  baseSalary: "$7,500",
                  overtime: "$320",
                  bonus: "$3,500",
                  total: "$11,320"
                }
              ].map((employee, index) => (
                <tr key={index}>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarFallback>{employee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-sm">{employee.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    {employee.department}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    {employee.position}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    {employee.baseSalary}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    {employee.overtime}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    {employee.bonus}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                    {employee.total}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <Button variant="outline" size="sm">
                      <FileText className="h-3.5 w-3.5 mr-1.5" />
                      Payslip
                    </Button>
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

export default HrPayroll;
