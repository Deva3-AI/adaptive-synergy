
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { financeService } from "@/services/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, BarChart as BarChartIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import DashboardCard from "@/components/dashboard/DashboardCard";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A259FF", "#4BC0C0"];

interface TeamCostsAnalysisProps {
  period: "month" | "quarter" | "year";
}

const TeamCostsAnalysis = ({ period }: TeamCostsAnalysisProps) => {
  const [activeTab, setActiveTab] = useState<string>("overview");

  // Fetch team costs data
  const { data: teamCosts, isLoading } = useQuery({
    queryKey: ["team-costs", period],
    queryFn: () => financeService.analyzeTeamCosts(period),
  });

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatTooltipValue = (value: number | string) => {
    if (typeof value === "number") {
      return formatCurrency(value);
    }
    return value;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border p-3 rounded-md shadow-md">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p
              key={`tooltip-${index}`}
              className="text-sm"
              style={{ color: entry.color }}
            >
              {`${entry.name}: ${formatTooltipValue(entry.value)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <Tabs
        defaultValue="overview"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="efficiency">Efficiency</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Skeleton className="h-64" />
              <Skeleton className="h-64 md:col-span-2" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <DashboardCard
                title="Cost Distribution"
                icon={<BarChartIcon className="h-5 w-5" />}
                badgeText={period}
                badgeVariant="outline"
              >
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={teamCosts?.departments}
                        dataKey="cost"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={(entry) => `${entry.name}: ${entry.percentage}%`}
                      >
                        {teamCosts?.departments.map((entry: any, index: number) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any) => formatCurrency(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-4 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Cost:</span>
                    <span className="font-bold">
                      {formatCurrency(teamCosts?.total_cost || 0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Avg. Cost per Employee:</span>
                    <span>
                      {formatCurrency(teamCosts?.avg_cost_per_employee || 0)}
                    </span>
                  </div>
                </div>
              </DashboardCard>

              <DashboardCard
                title="Department Costs"
                icon={<BarChartIcon className="h-5 w-5" />}
                className="md:col-span-2"
                badgeText={period}
                badgeVariant="outline"
              >
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={teamCosts?.departments}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 30,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar
                        dataKey="cost"
                        name="Cost"
                        fill="#8884d8"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="headcount"
                        name="Headcount"
                        fill="#82ca9d"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex justify-end mt-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                </div>
              </DashboardCard>
            </div>
          )}

          {!isLoading && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Cost Analysis Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        Total Team Cost
                      </p>
                      <p className="text-2xl font-bold">
                        {formatCurrency(teamCosts?.total_cost || 0)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        For {period === "month" ? "current month" : period === "quarter" ? "current quarter" : "current year"}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        Average Cost per Employee
                      </p>
                      <p className="text-2xl font-bold">
                        {formatCurrency(teamCosts?.avg_cost_per_employee || 0)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Based on {teamCosts?.total_employees || 0} employees
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Cost Trend</p>
                      <p className="text-2xl font-bold flex items-center">
                        {teamCosts?.trend_percentage > 0 ? "+" : ""}
                        {teamCosts?.trend_percentage || 0}%
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Compared to previous {period}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h3 className="text-sm font-medium mb-2">Key Insights</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {(teamCosts?.insights || []).map((insight: string, index: number) => (
                        <li key={index} className="text-sm">
                          {insight}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="departments" className="space-y-6">
          {isLoading ? (
            <Skeleton className="h-96" />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Department</TableHead>
                  <TableHead>Headcount</TableHead>
                  <TableHead>Total Cost</TableHead>
                  <TableHead>Avg. Cost/Employee</TableHead>
                  <TableHead>% of Total</TableHead>
                  <TableHead className="text-right">YoY Change</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(teamCosts?.departments || []).map((dept: any) => {
                  const avgCost = dept.headcount > 0 ? dept.cost / dept.headcount : 0;
                  
                  return (
                    <TableRow key={dept.name}>
                      <TableCell className="font-medium">{dept.name}</TableCell>
                      <TableCell>{dept.headcount}</TableCell>
                      <TableCell>{formatCurrency(dept.cost)}</TableCell>
                      <TableCell>{formatCurrency(avgCost)}</TableCell>
                      <TableCell>{dept.percentage}%</TableCell>
                      <TableCell className="text-right">
                        <span
                          className={
                            dept.yoy_change > 0
                              ? "text-red-500"
                              : dept.yoy_change < 0
                              ? "text-green-500"
                              : ""
                          }
                        >
                          {dept.yoy_change > 0 && "+"}
                          {dept.yoy_change}%
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          {isLoading ? (
            <Skeleton className="h-[400px]" />
          ) : (
            <DashboardCard title="Cost Trend Analysis" icon={<BarChartIcon className="h-5 w-5" />}>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={teamCosts?.trend}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 30,
                      bottom: 20,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip formatter={(value: any) => formatCurrency(value)} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="total_cost"
                      name="Total Cost"
                      stroke="#8884d8"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="avg_cost"
                      name="Avg. Cost/Employee"
                      stroke="#82ca9d"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </DashboardCard>
          )}
        </TabsContent>

        <TabsContent value="efficiency" className="space-y-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Skeleton className="h-80" />
              <Skeleton className="h-80" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DashboardCard
                title="Department Efficiency"
                icon={<BarChartIcon className="h-5 w-5" />}
              >
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={teamCosts?.efficiency}
                      layout="vertical"
                      margin={{
                        top: 20,
                        right: 30,
                        left: 60,
                        bottom: 20,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis dataKey="name" type="category" />
                      <Tooltip 
                        formatter={(value: number) => [`${value.toFixed(2)}%`, "Efficiency"]} 
                      />
                      <Legend />
                      <Bar
                        dataKey="efficiency"
                        name="Efficiency Score"
                        fill="#8884d8"
                        radius={[0, 4, 4, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </DashboardCard>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Optimization Opportunities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(teamCosts?.optimization_opportunities || []).map(
                      (opportunity: any, index: number) => (
                        <div
                          key={index}
                          className="p-4 border rounded-md space-y-2"
                        >
                          <h3 className="font-medium">{opportunity.department}</h3>
                          <p className="text-sm">{opportunity.description}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">
                              Potential Savings:
                            </span>
                            <span className="font-medium text-green-600">
                              {formatCurrency(opportunity.potential_savings)}
                            </span>
                          </div>
                        </div>
                      )
                    )}

                    {(teamCosts?.optimization_opportunities || []).length === 0 && (
                      <div className="p-8 text-center text-muted-foreground">
                        <p>No optimization opportunities identified</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeamCostsAnalysis;
