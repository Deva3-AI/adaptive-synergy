import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import hrService from '@/services/api/hrService';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar, Download, FileText, Users, Clock, DollarSign, BarChart } from "lucide-react";
import { format, subMonths } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import AnalyticsChart from "@/components/dashboard/AnalyticsChart";
import { toast } from "sonner";

const HRReports = () => {
  const [reportType, setReportType] = useState<"attendance" | "payroll" | "recruitment">("attendance");
  const [dateRange, setDateRange] = useState<"month" | "quarter" | "year">("month");
  
  // Get current date and format it
  const currentDate = new Date();
  const previousMonth = subMonths(currentDate, 1);
  const currentMonthName = format(currentDate, "MMMM yyyy");
  const previousMonthName = format(previousMonth, "MMMM yyyy");
  
  // Fetch attendance data
  const { data: attendanceData, isLoading: isAttendanceLoading } = useQuery({
    queryKey: ['hr-attendance', dateRange],
    queryFn: () => hrService.getEmployeeAttendance(
      undefined, 
      format(subMonths(currentDate, dateRange === "month" ? 1 : dateRange === "quarter" ? 3 : 12), "yyyy-MM-dd"),
      format(currentDate, "yyyy-MM-dd")
    )
  });
  
  // Fetch payroll data
  const { data: payrollData, isLoading: isPayrollLoading } = useQuery({
    queryKey: ['hr-payroll', dateRange],
    queryFn: () => hrService.getPayroll(
      dateRange === "month" ? format(currentDate, "MM") : undefined,
      format(currentDate, "yyyy")
    )
  });
  
  // Fetch recruitment data
  const { data: recruitmentData, isLoading: isRecruitmentLoading } = useQuery({
    queryKey: ['hr-recruitment'],
    queryFn: () => hrService.getRecruitment()
  });
  
  // Handle report download
  const handleDownloadReport = (type: string) => {
    toast.success(`${type} report downloaded successfully`);
    // In a real implementation, this would trigger the download of a PDF or Excel file
  };
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">HR Reports</h1>
          <p className="text-muted-foreground">
            View and analyze HR metrics and performance data
          </p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant={dateRange === "month" ? "default" : "outline"} 
            onClick={() => setDateRange("month")}
          >
            Monthly
          </Button>
          <Button 
            variant={dateRange === "quarter" ? "default" : "outline"} 
            onClick={() => setDateRange("quarter")}
          >
            Quarterly
          </Button>
          <Button 
            variant={dateRange === "year" ? "default" : "outline"} 
            onClick={() => setDateRange("year")}
          >
            Yearly
          </Button>
        </div>
      </div>
      
      <Tabs value={reportType} onValueChange={(value) => setReportType(value as any)}>
        <TabsList className="mb-6">
          <TabsTrigger value="attendance">Attendance Reports</TabsTrigger>
          <TabsTrigger value="payroll">Payroll Reports</TabsTrigger>
          <TabsTrigger value="recruitment">Recruitment Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="attendance">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Average Attendance Rate</CardTitle>
              </CardHeader>
              <CardContent>
                {isAttendanceLoading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <div className="text-2xl font-bold">
                    {attendanceData?.summary?.average_attendance || 0}%
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  {dateRange === "month" ? currentMonthName : 
                   dateRange === "quarter" ? "Last 3 months" : "Last 12 months"}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Late Arrivals</CardTitle>
              </CardHeader>
              <CardContent>
                {isAttendanceLoading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <div className="text-2xl font-bold">
                    {attendanceData?.summary?.late_arrivals || 0}
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  Total instances in period
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Absent Days</CardTitle>
              </CardHeader>
              <CardContent>
                {isAttendanceLoading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <div className="text-2xl font-bold">
                    {attendanceData?.summary?.absent_days || 0}
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  Total across all employees
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Attendance Trends</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => handleDownloadReport('Attendance')}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isAttendanceLoading ? (
                  <Skeleton className="h-[300px] w-full" />
                ) : (
                  <AnalyticsChart 
                    data={attendanceData?.trends || []} 
                    height={300}
                    defaultType="line"
                  />
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Department Attendance</CardTitle>
              </CardHeader>
              <CardContent>
                {isAttendanceLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {(attendanceData?.departments || []).map((dept: any) => (
                      <div key={dept.name} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{dept.name}</span>
                          <span className="font-medium">{dept.attendance_rate}%</span>
                        </div>
                        <Progress value={dept.attendance_rate} className="h-2" />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <Card className="mt-6">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Employee Attendance Details</CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="flex items-center">
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    {dateRange === "month" ? currentMonthName : 
                     dateRange === "quarter" ? "Last 3 months" : "Last 12 months"}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isAttendanceLoading ? (
                <Skeleton className="h-[400px] w-full" />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Attendance Rate</TableHead>
                      <TableHead>Late Arrivals</TableHead>
                      <TableHead>Absent Days</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(attendanceData?.employees || []).map((employee: any) => (
                      <TableRow key={employee.id}>
                        <TableCell className="font-medium">{employee.name}</TableCell>
                        <TableCell>{employee.department}</TableCell>
                        <TableCell>{employee.attendance_rate}%</TableCell>
                        <TableCell>{employee.late_arrivals}</TableCell>
                        <TableCell>{employee.absent_days}</TableCell>
                        <TableCell>
                          {employee.attendance_rate >= 90 ? (
                            <Badge variant="success">Excellent</Badge>
                          ) : employee.attendance_rate >= 80 ? (
                            <Badge variant="default">Good</Badge>
                          ) : employee.attendance_rate >= 70 ? (
                            <Badge variant="warning">Average</Badge>
                          ) : (
                            <Badge variant="destructive">Poor</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payroll">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Payroll</CardTitle>
              </CardHeader>
              <CardContent>
                {isPayrollLoading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <div className="text-2xl font-bold">
                    ${payrollData?.summary?.total_payroll?.toLocaleString() || '0'}
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  {dateRange === "month" ? currentMonthName : 
                   dateRange === "quarter" ? "Last 3 months" : "Last 12 months"}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Average Salary</CardTitle>
              </CardHeader>
              <CardContent>
                {isPayrollLoading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <div className="text-2xl font-bold">
                    ${payrollData?.summary?.average_salary?.toLocaleString() || '0'}
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  Per employee
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Payroll Change</CardTitle>
              </CardHeader>
              <CardContent>
                {isPayrollLoading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <div className="text-2xl font-bold">
                    {payrollData?.summary?.payroll_change > 0 ? '+' : ''}
                    {payrollData?.summary?.payroll_change || 0}%
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  vs {previousMonthName}
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Payroll Trends</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => handleDownloadReport('Payroll')}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isPayrollLoading ? (
                  <Skeleton className="h-[300px] w-full" />
                ) : (
                  <AnalyticsChart 
                    data={payrollData?.trends || []} 
                    height={300}
                    defaultType="bar"
                  />
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Department Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                {isPayrollLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {(payrollData?.departments || []).map((dept: any) => (
                      <div key={dept.name} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{dept.name}</span>
                          <span className="font-medium">${dept.total_payroll.toLocaleString()}</span>
                        </div>
                        <Progress value={dept.percentage} className="h-2" />
                        <p className="text-xs text-muted-foreground">{dept.employee_count} employees</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <Card className="mt-6">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Payroll Records</CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="flex items-center">
                    <DollarSign className="h-3.5 w-3.5 mr-1" />
                    {dateRange === "month" ? currentMonthName : 
                     dateRange === "quarter" ? "Last 3 months" : "Last 12 months"}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isPayrollLoading ? (
                <Skeleton className="h-[400px] w-full" />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Period</TableHead>
                      <TableHead>Total Payroll</TableHead>
                      <TableHead>Employees</TableHead>
                      <TableHead>Avg. Salary</TableHead>
                      <TableHead>Overtime Pay</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(payrollData?.records || []).map((record: any) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">{record.period}</TableCell>
                        <TableCell>${record.total_payroll.toLocaleString()}</TableCell>
                        <TableCell>{record.employee_count}</TableCell>
                        <TableCell>${record.average_salary.toLocaleString()}</TableCell>
                        <TableCell>${record.overtime_pay.toLocaleString()}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" onClick={() => handleDownloadReport(`Payroll ${record.period}`)}>
                            <FileText className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="recruitment">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Open Positions</CardTitle>
              </CardHeader>
              <CardContent>
                {isRecruitmentLoading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <div className="text-2xl font-bold">
                    {recruitmentData?.summary?.open_positions || 0}
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  Currently active
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Applicants</CardTitle>
              </CardHeader>
              <CardContent>
                {isRecruitmentLoading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <div className="text-2xl font-bold">
                    {recruitmentData?.summary?.total_applicants || 0}
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  Across all positions
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Time to Hire</CardTitle>
              </CardHeader>
              <CardContent>
                {isRecruitmentLoading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <div className="text-2xl font-bold">
                    {recruitmentData?.summary?.avg_time_to_hire || 0} days
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  Average duration
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Recruitment Pipeline</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => handleDownloadReport('Recruitment')}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isRecruitmentLoading ? (
                  <Skeleton className="h-[300px] w-full" />
                ) : (
                  <AnalyticsChart 
                    data={recruitmentData?.pipeline || []} 
                    height={300}
                    defaultType="bar"
                  />
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Source Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                {isRecruitmentLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {(recruitmentData?.sources || []).map((source: any) => (
                      <div key={source.name} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{source.name}</span>
                          <span className="font-medium">{source.applicants} applicants</span>
                        </div>
                        <Progress value={source.percentage} className="h-2" />
                        <p className="text-xs text-muted-foreground">{source.hire_rate}% hire rate</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <Card className="mt-6">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Job Openings Status</CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="flex items-center">
                    <Users className="h-3.5 w-3.5 mr-1" />
                    Active Positions
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isRecruitmentLoading ? (
                <Skeleton className="h-[400px] w-full" />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Position</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Applicants</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Time Open</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(recruitmentData?.job_openings || []).map((job: any) => (
                      <TableRow key={job.id}>
                        <TableCell className="font-medium">{job.title}</TableCell>
                        <TableCell>{job.department}</TableCell>
                        <TableCell>{job.applicants}</TableCell>
                        <TableCell>
                          <Badge variant={
                            job.status === 'Interviewing' ? 'warning' :
                            job.status === 'Screening' ? 'default' :
                            job.status === 'Final Round' ? 'success' : 'outline'
                          }>
                            {job.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span>{job.days_open} days</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            <FileText className="h-4 w-4 mr-2" />
                            Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HRReports;
