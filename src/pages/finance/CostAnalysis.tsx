
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, PieChart, LineChart, Calendar, Download, Clock, UserCog, DollarSign, Users, ChevronDown } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import DashboardCard from "@/components/dashboard/DashboardCard";
import AnalyticsChart from "@/components/dashboard/AnalyticsChart";

// Sample data for charts
const monthlyExpensesData = [
  { name: "Jan", amount: 35000 },
  { name: "Feb", amount: 38000 },
  { name: "Mar", amount: 40000 },
  { name: "Apr", amount: 44000 },
  { name: "May", amount: 42000 },
  { name: "Jun", amount: 45000 },
  { name: "Jul", amount: 48000 },
  { name: "Aug", amount: 52000 },
  { name: "Sep", amount: 56000 },
];

const expenseCategoryData = [
  { name: "Salaries", value: 245000 },
  { name: "Marketing", value: 85000 },
  { name: "Tools & Software", value: 42000 },
  { name: "Office & Utilities", value: 28000 },
  { name: "Travel", value: 15000 },
  { name: "Miscellaneous", value: 10000 },
];

const departmentCostData = [
  { name: "Engineering", value: 140000 },
  { name: "Design", value: 80000 },
  { name: "Marketing", value: 65000 },
  { name: "Sales", value: 40000 },
  { name: "HR", value: 15000 },
  { name: "Finance", value: 15000 },
];

const hourlyRateData = [
  { name: "Engineering", rate: 85 },
  { name: "Design", rate: 75 },
  { name: "Marketing", rate: 65 },
  { name: "Sales", rate: 60 },
  { name: "HR", rate: 50 },
  { name: "Finance", rate: 55 },
];

const teamHoursData = [
  { name: "John S.", department: "Engineering", hours: 168, cost: 14280 },
  { name: "Sarah J.", department: "Design", hours: 160, cost: 12000 },
  { name: "Michael B.", department: "Engineering", hours: 176, cost: 14960 },
  { name: "Emily D.", department: "Marketing", hours: 152, cost: 9880 },
  { name: "David W.", department: "Design", hours: 160, cost: 12000 },
  { name: "Jennifer L.", department: "Marketing", hours: 160, cost: 10400 },
  { name: "Robert T.", department: "Engineering", hours: 168, cost: 14280 },
  { name: "Lisa M.", department: "HR", hours: 152, cost: 7600 },
];

const FinanceCostAnalysis = () => {
  return (
    <div className="space-y-8 animate-blur-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cost Analysis</h1>
          <p className="text-muted-foreground">
            Analyze and optimize company expenses
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="month">
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$425,000</div>
            <p className="text-xs text-muted-foreground">YTD (Jan-Sep 2023)</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,296</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Size</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">52</div>
            <p className="text-xs text-muted-foreground">Across 6 departments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Cost per Employee</CardTitle>
            <UserCog className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$8,173</div>
            <p className="text-xs text-muted-foreground">Per month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <DashboardCard
          title="Monthly Expenses"
          icon={<LineChart className="h-5 w-5" />}
        >
          <AnalyticsChart 
            data={monthlyExpensesData} 
            height={250}
            defaultType="line"
          />
        </DashboardCard>

        <DashboardCard
          title="Expense Categories"
          icon={<PieChart className="h-5 w-5" />}
        >
          <AnalyticsChart 
            data={expenseCategoryData} 
            height={250}
            defaultType="pie"
          />
        </DashboardCard>
      </div>

      <DashboardCard
        title="Cost by Department"
        icon={<BarChart className="h-5 w-5" />}
      >
        <AnalyticsChart 
          data={departmentCostData} 
          height={300}
          defaultType="bar"
        />
      </DashboardCard>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Hourly Rates by Department</CardTitle>
              <CardDescription>Average hourly cost for each department</CardDescription>
            </div>
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Custom Date Range
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {hourlyRateData.map((dept) => (
              <div key={dept.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">{dept.name}</h4>
                  <span className="text-sm font-medium">${dept.rate}/hr</span>
                </div>
                <Progress value={dept.rate} max={100} className="h-2" />
                <div className="flex justify-end text-xs text-muted-foreground">
                  <span>Monthly cost: ~${(dept.rate * 160).toLocaleString()} per employee</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Team Hours & Cost Analysis</CardTitle>
              <CardDescription>Hours worked and associated costs this month</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="hr">HR</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <ChevronDown className="h-4 w-4 mr-2" />
                Sort by
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="table">
            <TabsList className="mb-4">
              <TabsTrigger value="table">Table View</TabsTrigger>
              <TabsTrigger value="chart">Chart View</TabsTrigger>
            </TabsList>
            <TabsContent value="table">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="p-3 text-left text-sm font-medium text-muted-foreground">Employee</th>
                      <th className="p-3 text-left text-sm font-medium text-muted-foreground">Department</th>
                      <th className="p-3 text-left text-sm font-medium text-muted-foreground">Hours Worked</th>
                      <th className="p-3 text-left text-sm font-medium text-muted-foreground">Hourly Rate</th>
                      <th className="p-3 text-left text-sm font-medium text-muted-foreground">Total Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamHoursData.map((employee, index) => (
                      <tr 
                        key={employee.name} 
                        className={index % 2 === 0 ? "" : "bg-muted/30"}
                      >
                        <td className="p-3 text-sm">{employee.name}</td>
                        <td className="p-3 text-sm">{employee.department}</td>
                        <td className="p-3 text-sm">{employee.hours} hrs</td>
                        <td className="p-3 text-sm">
                          ${hourlyRateData.find(d => d.name === employee.department)?.rate || 0}
                        </td>
                        <td className="p-3 text-sm font-medium">${employee.cost.toLocaleString()}</td>
                      </tr>
                    ))}
                    <tr className="bg-muted/50">
                      <td className="p-3 text-sm font-medium" colSpan={2}>Total</td>
                      <td className="p-3 text-sm font-medium">
                        {teamHoursData.reduce((sum, employee) => sum + employee.hours, 0)} hrs
                      </td>
                      <td className="p-3 text-sm font-medium">-</td>
                      <td className="p-3 text-sm font-medium">
                        ${teamHoursData.reduce((sum, employee) => sum + employee.cost, 0).toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </TabsContent>
            <TabsContent value="chart">
              <div className="rounded-md border p-8 text-center">
                <h3 className="font-medium">Team Hours Chart</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Visual representation of team hours would appear here
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinanceCostAnalysis;
