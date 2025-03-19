
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, FileSpreadsheet, Download, ArrowDown, Users, Wallet, Calculator, CheckCircle, AlertCircle, BanknoteIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import AnalyticsChart from "@/components/dashboard/AnalyticsChart";

// Sample data for payroll history
const payrollHistory = [
  {
    id: 1,
    period: "September 2023",
    startDate: "2023-09-01",
    endDate: "2023-09-30",
    employees: 52,
    totalAmount: 245000,
    status: "processed",
    processedDate: "2023-09-30",
  },
  {
    id: 2,
    period: "August 2023",
    startDate: "2023-08-01",
    endDate: "2023-08-31",
    employees: 50,
    totalAmount: 235000,
    status: "processed",
    processedDate: "2023-08-31",
  },
  {
    id: 3,
    period: "July 2023",
    startDate: "2023-07-01",
    endDate: "2023-07-31",
    employees: 48,
    totalAmount: 228000,
    status: "processed",
    processedDate: "2023-07-31",
  },
  {
    id: 4,
    period: "June 2023",
    startDate: "2023-06-01",
    endDate: "2023-06-30",
    employees: 46,
    totalAmount: 218000,
    status: "processed",
    processedDate: "2023-06-30",
  },
  {
    id: 5,
    period: "May 2023",
    startDate: "2023-05-01",
    endDate: "2023-05-31",
    employees: 45,
    totalAmount: 215000,
    status: "processed",
    processedDate: "2023-05-31",
  },
];

// Sample data for employee payslips
const employeePayslips = [
  {
    id: 1,
    name: "John Smith",
    position: "Senior Developer",
    department: "Engineering",
    salary: 8500,
    bonus: 1000,
    overtime: 320,
    deductions: 1840,
    netPay: 7980,
    status: "processed",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    position: "Senior Designer",
    department: "Design",
    salary: 7800,
    bonus: 800,
    overtime: 0,
    deductions: 1650,
    netPay: 6950,
    status: "processed",
  },
  {
    id: 3,
    name: "Michael Brown",
    position: "Project Manager",
    department: "Engineering",
    salary: 9200,
    bonus: 1200,
    overtime: 0,
    deductions: 1980,
    netPay: 8420,
    status: "processed",
  },
  {
    id: 4,
    name: "Emily Davis",
    position: "Marketing Specialist",
    department: "Marketing",
    salary: 6500,
    bonus: 500,
    overtime: 150,
    deductions: 1460,
    netPay: 5690,
    status: "processing",
  },
  {
    id: 5,
    name: "David Wilson",
    position: "UI/UX Designer",
    department: "Design",
    salary: 7200,
    bonus: 600,
    overtime: 0,
    deductions: 1560,
    netPay: 6240,
    status: "issue",
    issue: "Tax calculation error",
  },
  {
    id: 6,
    name: "Jennifer Lee",
    position: "Content Writer",
    department: "Marketing",
    salary: 5800,
    bonus: 0,
    overtime: 210,
    deductions: 1280,
    netPay: 4730,
    status: "processed",
  },
  {
    id: 7,
    name: "Robert Taylor",
    position: "Backend Developer",
    department: "Engineering",
    salary: 8200,
    bonus: 900,
    overtime: 0,
    deductions: 1760,
    netPay: 7340,
    status: "processed",
  },
  {
    id: 8,
    name: "Lisa Martinez",
    position: "HR Specialist",
    department: "HR",
    salary: 6300,
    bonus: 400,
    overtime: 0,
    deductions: 1350,
    netPay: 5350,
    status: "processed",
  },
];

// Sample data for monthly cost chart
const monthlyCostData = [
  { name: "Jan", amount: 198000 },
  { name: "Feb", amount: 205000 },
  { name: "Mar", amount: 210000 },
  { name: "Apr", amount: 215000 },
  { name: "May", amount: 215000 },
  { name: "Jun", amount: 218000 },
  { name: "Jul", amount: 228000 },
  { name: "Aug", amount: 235000 },
  { name: "Sep", amount: 245000 },
];

const departmentCostData = [
  { name: "Engineering", value: 104000 },
  { name: "Design", value: 58000 },
  { name: "Marketing", value: 42000 },
  { name: "Sales", value: 25000 },
  { name: "HR", value: 10000 },
  { name: "Finance", value: 6000 },
];

// Status badge variant
const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "processed":
      return "success";
    case "processing":
      return "warning";
    case "issue":
      return "destructive";
    case "pending":
      return "outline";
    default:
      return "secondary";
  }
};

const HrPayroll = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  return (
    <div className="space-y-8 animate-blur-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payroll Management</h1>
          <p className="text-muted-foreground">
            Process employee payments and generate payslips
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <CalendarIcon className="h-4 w-4 mr-2" />
                {date ? format(date, "MMMM yyyy") : "Select month"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Button>
            <Calculator className="h-4 w-4 mr-2" />
            Process Payroll
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Budget</CardTitle>
            <BanknoteIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$245,000</div>
            <p className="text-xs text-muted-foreground">September 2023</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">52</div>
            <p className="text-xs text-muted-foreground">+2 since last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Salary</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$7,250</div>
            <p className="text-xs text-muted-foreground">+3.5% this year</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payroll Status</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Badge className="mr-2" variant="success">Processed</Badge>
              <span className="text-muted-foreground text-sm">Last run: Sep 30</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Next: Oct 31</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Monthly Payroll Costs</CardTitle>
            <CardDescription>Total payroll expenses over time</CardDescription>
          </CardHeader>
          <CardContent>
            <AnalyticsChart 
              data={monthlyCostData} 
              height={250}
              defaultType="bar"
            />
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Costs by Department</CardTitle>
            <CardDescription>September 2023 breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <AnalyticsChart 
              data={departmentCostData} 
              height={250}
              defaultType="pie"
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Payroll History</CardTitle>
              <CardDescription>Past payroll processing records</CardDescription>
            </div>
            <Button variant="outline">
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Export to Excel
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Period</TableHead>
                <TableHead>Date Range</TableHead>
                <TableHead>Employees</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Processed Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payrollHistory.map((payroll) => (
                <TableRow key={payroll.id}>
                  <TableCell className="font-medium">{payroll.period}</TableCell>
                  <TableCell>
                    {new Date(payroll.startDate).toLocaleDateString()} - {new Date(payroll.endDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{payroll.employees}</TableCell>
                  <TableCell>${payroll.totalAmount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(payroll.status)}>
                      {payroll.status.charAt(0).toUpperCase() + payroll.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(payroll.processedDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Report
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Employee Payslips</CardTitle>
              <CardDescription>September 2023</CardDescription>
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
              <Button variant="outline">
                <ArrowDown className="h-4 w-4 mr-2" />
                Bulk Download
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="processed">Processed</TabsTrigger>
              <TabsTrigger value="processing">Processing</TabsTrigger>
              <TabsTrigger value="issues">Issues</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Base Salary</TableHead>
                    <TableHead>Bonus</TableHead>
                    <TableHead>Overtime</TableHead>
                    <TableHead>Deductions</TableHead>
                    <TableHead>Net Pay</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employeePayslips.map((payslip) => (
                    <TableRow key={payslip.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {payslip.name.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{payslip.name}</div>
                            <div className="text-xs text-muted-foreground">{payslip.position}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{payslip.department}</TableCell>
                      <TableCell>${payslip.salary.toLocaleString()}</TableCell>
                      <TableCell>${payslip.bonus.toLocaleString()}</TableCell>
                      <TableCell>${payslip.overtime.toLocaleString()}</TableCell>
                      <TableCell>${payslip.deductions.toLocaleString()}</TableCell>
                      <TableCell className="font-medium">${payslip.netPay.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Badge variant={getStatusBadgeVariant(payslip.status)}>
                            {payslip.status.charAt(0).toUpperCase() + payslip.status.slice(1)}
                          </Badge>
                          {payslip.status === "issue" && (
                            <div className="relative group">
                              <AlertCircle className="h-4 w-4 text-destructive ml-1 cursor-help" />
                              <div className="absolute z-50 invisible group-hover:visible bg-popover text-popover-foreground px-3 py-2 text-sm rounded-md shadow-md w-48 -left-24 top-6">
                                {payslip.issue}
                              </div>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Payslip
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="processed">
              <div className="rounded-md border p-8 text-center">
                <h3 className="font-medium">Processed Payslips</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Filter showing only processed payslips would appear here
                </p>
              </div>
            </TabsContent>
            <TabsContent value="processing">
              <div className="rounded-md border p-8 text-center">
                <h3 className="font-medium">Processing Payslips</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Filter showing only payslips being processed would appear here
                </p>
              </div>
            </TabsContent>
            <TabsContent value="issues">
              <div className="rounded-md border p-8 text-center">
                <h3 className="font-medium">Payslips with Issues</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Filter showing only payslips with issues would appear here
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default HrPayroll;
