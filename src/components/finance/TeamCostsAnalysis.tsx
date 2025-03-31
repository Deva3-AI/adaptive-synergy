
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from '@tanstack/react-query';
import { financeService } from '@/services/api';
import { TeamCostsAnalysisProps } from '@/types';
import { BarChart, PieChart, Activity, Users, DollarSign, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, PieChart as RechartsPieChart, Pie, Cell, Legend } from 'recharts';

const TeamCostsAnalysis: React.FC<TeamCostsAnalysisProps> = ({ period = 'month' }) => {
  const [activeTab, setActiveTab] = useState('department');

  const { data: teamCostsData, isLoading } = useQuery({
    queryKey: ['team-costs', period],
    queryFn: () => financeService.getTeamCostsAnalysis(period),
  });

  // Default empty arrays to prevent TypeScript errors
  const departmentData = teamCostsData?.departments || [];
  const roleData = teamCostsData?.roles || [];
  const projectData = teamCostsData?.projects || [];
  const employeeData = teamCostsData?.topEmployees || [];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Team Costs Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Costs Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="department" onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="department">By Department</TabsTrigger>
            <TabsTrigger value="role">By Role</TabsTrigger>
            <TabsTrigger value="project">By Project</TabsTrigger>
            <TabsTrigger value="employee">Top Employees</TabsTrigger>
          </TabsList>
          
          <TabsContent value="department" className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={departmentData} layout="vertical" margin={{ top: 20, right: 30, left: 80, bottom: 5 }}>
                <XAxis type="number" tickFormatter={formatCurrency} />
                <YAxis dataKey="name" type="category" />
                <Tooltip formatter={(value) => [formatCurrency(value as number), 'Cost']} />
                <Bar dataKey="value" fill="#8884d8" />
              </RechartsBarChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="role" className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={roleData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {roleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [formatCurrency(value as number), 'Cost']} />
                <Legend />
              </RechartsPieChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="project" className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={projectData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <XAxis dataKey="name" />
                <YAxis tickFormatter={formatCurrency} />
                <Tooltip formatter={(value) => [formatCurrency(value as number), 'Cost']} />
                <Bar dataKey="value" fill="#82ca9d" />
              </RechartsBarChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="employee" className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={employeeData} layout="vertical" margin={{ top: 20, right: 30, left: 80, bottom: 5 }}>
                <XAxis type="number" tickFormatter={formatCurrency} />
                <YAxis dataKey="name" type="category" />
                <Tooltip formatter={(value) => [formatCurrency(value as number), 'Cost']} />
                <Bar dataKey="value" fill="#FFBB28" />
              </RechartsBarChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Total Cost</span>
            </div>
            <p className="text-xl font-bold mt-2">{formatCurrency(teamCostsData?.totalCost || 0)}</p>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Team Size</span>
            </div>
            <p className="text-xl font-bold mt-2">{teamCostsData?.teamSize || 0} employees</p>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Avg. Cost/Employee</span>
            </div>
            <p className="text-xl font-bold mt-2">{formatCurrency(teamCostsData?.avgCostPerEmployee || 0)}</p>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">YoY Change</span>
            </div>
            <p className="text-xl font-bold mt-2 flex items-center">
              {teamCostsData?.yearOverYearChange || 0}%
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamCostsAnalysis;
