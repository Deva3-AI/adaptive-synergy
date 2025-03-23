
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, FileText, Clock, BarChart, PieChart, Download } from "lucide-react";
import AnalyticsChart from "@/components/dashboard/AnalyticsChart";
import { format, subDays, subWeeks, subMonths } from 'date-fns';

interface ClientTimeReportingProps {
  clientId: number;
  clientName: string;
}

// Mock data for charts
const weeklyHoursData = [
  { name: 'Brand X', hours: 12 },
  { name: 'Brand Y', hours: 8 },
  { name: 'Brand Z', hours: 4 },
];

const timeByEmployeeData = [
  { name: 'John Doe', hours: 10 },
  { name: 'Sarah Miller', hours: 7 },
  { name: 'Mike Johnson', hours: 5 },
  { name: 'Lisa Brown', hours: 2 },
];

const monthlyTrendData = [
  { name: 'Oct', hours: 65 },
  { name: 'Nov', hours: 78 },
  { name: 'Dec', hours: 92 },
  { name: 'Jan', hours: 86 },
  { name: 'Feb', hours: 73 },
  { name: 'Mar', hours: 94 },
];

const taskTypeDistributionData = [
  { name: 'Design', value: 45 },
  { name: 'Development', value: 30 },
  { name: 'Content', value: 15 },
  { name: 'Admin', value: 10 },
];

const ClientTimeReporting: React.FC<ClientTimeReportingProps> = ({
  clientId,
  clientName
}) => {
  const [timeRange, setTimeRange] = useState('week');
  const [reportType, setReportType] = useState('summary');
  
  const getTimeRangeLabel = () => {
    const now = new Date();
    switch (timeRange) {
      case 'week':
        return `${format(subDays(now, 7), 'MMM d')} - ${format(now, 'MMM d, yyyy')}`;
      case 'month':
        return `${format(subMonths(now, 1), 'MMM d')} - ${format(now, 'MMM d, yyyy')}`;
      case 'quarter':
        return `${format(subMonths(now, 3), 'MMM d')} - ${format(now, 'MMM d, yyyy')}`;
      default:
        return format(now, 'MMMM yyyy');
    }
  };
  
  const getTotalHours = () => {
    switch (timeRange) {
      case 'week': return 24;
      case 'month': return 94;
      case 'quarter': return 280;
      default: return 24;
    }
  };
  
  const getEfficiencyChange = () => {
    switch (timeRange) {
      case 'week': return '+5%';
      case 'month': return '+12%';
      case 'quarter': return '+8%';
      default: return '+5%';
    }
  };
  
  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-semibold">
          Time Tracking & Reports
        </CardTitle>
        <div className="flex items-center gap-2">
          <Select defaultValue={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Past Week</SelectItem>
              <SelectItem value="month">Past Month</SelectItem>
              <SelectItem value="quarter">Past Quarter</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-muted-foreground">Time Range</p>
            <p className="text-lg font-medium">{getTimeRangeLabel()}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Total Hours</p>
            <p className="text-lg font-medium">{getTotalHours()} hours</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Efficiency</p>
            <p className="text-lg font-medium text-green-600">{getEfficiencyChange()} from previous period</p>
          </div>
        </div>
        
        <Tabs defaultValue="summary" onValueChange={setReportType}>
          <TabsList className="mb-4">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="byBrand">By Brand</TabsTrigger>
            <TabsTrigger value="byEmployee">By Employee</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Hours by Brand</CardTitle>
                </CardHeader>
                <CardContent>
                  <AnalyticsChart 
                    data={weeklyHoursData} 
                    height={240}
                    defaultType="bar"
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Task Type Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <AnalyticsChart 
                    data={taskTypeDistributionData} 
                    height={240}
                    defaultType="pie"
                  />
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-6">
              <h3 className="font-medium mb-3">Key Insights</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Clock className="h-4 w-4 text-primary mt-0.5" />
                  <span>Most time was spent on Brand X (50% of total hours)</span>
                </li>
                <li className="flex items-start gap-2">
                  <BarChart className="h-4 w-4 text-green-500 mt-0.5" />
                  <span>Task completion efficiency improved by {getEfficiencyChange()} compared to previous {timeRange}</span>
                </li>
                <li className="flex items-start gap-2">
                  <PieChart className="h-4 w-4 text-blue-500 mt-0.5" />
                  <span>Design tasks consumed the most hours (45% of total)</span>
                </li>
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="byBrand">
            <Card>
              <CardContent className="pt-6">
                <AnalyticsChart 
                  data={weeklyHoursData} 
                  height={300}
                  defaultType="bar"
                />
              </CardContent>
            </Card>
            
            <div className="mt-6 space-y-4">
              {weeklyHoursData.map((brand, index) => (
                <div key={index} className="p-4 border rounded-md">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">{brand.name}</h3>
                    <span className="font-medium">{brand.hours} hours</span>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground">Top tasks: Website redesign, Banner creation, Social media assets</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-muted-foreground">Completed tasks: 8</span>
                      <Button variant="ghost" size="sm">
                        <FileText className="h-4 w-4 mr-1" />
                        Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="byEmployee">
            <Card>
              <CardContent className="pt-6">
                <AnalyticsChart 
                  data={timeByEmployeeData} 
                  height={300}
                  defaultType="bar"
                />
              </CardContent>
            </Card>
            
            <div className="mt-6 space-y-4">
              {timeByEmployeeData.map((employee, index) => (
                <div key={index} className="p-4 border rounded-md">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">{employee.name}</h3>
                    <span className="font-medium">{employee.hours} hours</span>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground">Main focus: Design, Frontend development</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-muted-foreground">Avg. task completion: 1.2x faster than estimated</span>
                      <Button variant="ghost" size="sm">
                        <FileText className="h-4 w-4 mr-1" />
                        Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="trends">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Monthly Hours Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <AnalyticsChart 
                  data={monthlyTrendData} 
                  height={300}
                  defaultType="line"
                />
              </CardContent>
            </Card>
            
            <div className="mt-6">
              <h3 className="font-medium mb-3">Trend Analysis</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <BarChart className="h-4 w-4 text-primary mt-0.5" />
                  <span>Hours usage has increased by 12% over the past 3 months</span>
                </li>
                <li className="flex items-start gap-2">
                  <Clock className="h-4 w-4 text-amber-500 mt-0.5" />
                  <span>March had the highest time utilization with 94 hours</span>
                </li>
                <li className="flex items-start gap-2">
                  <Calendar className="h-4 w-4 text-blue-500 mt-0.5" />
                  <span>Projected hours for next month: 105 (based on current trend)</span>
                </li>
              </ul>
              
              <Button className="mt-6" variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                View Detailed Trend Report
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ClientTimeReporting;
