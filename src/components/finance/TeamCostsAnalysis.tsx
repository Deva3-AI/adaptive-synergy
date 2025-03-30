
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { financeService } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  ResponsiveContainer,
  Cell,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DollarSign,
  TrendingUp,
  Users,
  Briefcase,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

// Colors for charts
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

// Format currencies
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(value);
};

interface TeamCostsAnalysisProps {
  period: string;
}

const TeamCostsAnalysis = ({ period }: TeamCostsAnalysisProps) => {
  const [activeTab, setActiveTab] = useState<string>("overview");

  // Fetch team costs data
  const { data: teamCostsData, isLoading } = useQuery({
    queryKey: ["team-costs", period],
    queryFn: () => financeService.analyzeTeamCosts(period),
  });

  if (isLoading) {
    return <Skeleton className="h-[400px] w-full" />;
  }

  if (!teamCostsData) {
    return <div>No team cost data available.</div>;
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Team Costs Analysis</span>
          <Badge variant="outline">{period}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="departments">Departments</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="efficiency">Efficiency</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Cost
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCurrency(teamCostsData.total_cost)}
                  </div>
                  <p className="text-xs flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                    <span className={teamCostsData.trend_percentage >= 0 ? "text-green-500" : "text-red-500"}>
                      {teamCostsData.trend_percentage}% from last {period}
                    </span>
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Average Cost
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCurrency(teamCostsData.avg_cost_per_employee)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Per employee
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Employees
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{teamCostsData.total_employees}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Across all departments
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Optimization Potential
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCurrency(
                      teamCostsData.optimization_opportunities.reduce(
                        (total: number, item: any) => total + item.potential_savings,
                        0
                      )
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Potential savings
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Cost Distribution by Department</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={teamCostsData.departments}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="cost"
                        nameKey="name"
                      >
                        {teamCostsData.departments.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Key Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {teamCostsData.insights.map((insight: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 mr-2 text-green-500 shrink-0" />
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="departments">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Department</TableHead>
                  <TableHead>Headcount</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Percentage</TableHead>
                  <TableHead>YoY Change</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamCostsData.departments.map((dept: any) => (
                  <TableRow key={dept.name}>
                    <TableCell className="font-medium">{dept.name}</TableCell>
                    <TableCell>{dept.headcount}</TableCell>
                    <TableCell>{formatCurrency(dept.cost)}</TableCell>
                    <TableCell>{dept.percentage}%</TableCell>
                    <TableCell>
                      <span className={dept.yoy_change >= 0 ? "text-green-500" : "text-red-500"}>
                        {dept.yoy_change >= 0 ? "+" : ""}
                        {dept.yoy_change}%
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="trends">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={teamCostsData.trend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="total_cost"
                    name="Total Cost"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="avg_cost"
                    name="Avg Cost per Employee"
                    stroke="#82ca9d"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="efficiency">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Efficiency by Department</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={teamCostsData.efficiency}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip formatter={(value: number) => `${value}%`} />
                        <Bar
                          dataKey="efficiency"
                          name="Efficiency Score"
                          fill="#8884d8"
                          background={{ fill: "#eee" }}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Optimization Opportunities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {teamCostsData.optimization_opportunities.map((opportunity: any, index: number) => (
                      <div
                        key={index}
                        className="border rounded-lg p-4 flex flex-col space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{opportunity.department}</span>
                          <Badge variant="outline">
                            Save {formatCurrency(opportunity.potential_savings)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {opportunity.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TeamCostsAnalysis;
