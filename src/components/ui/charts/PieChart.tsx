
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  PieChart as RechartsPieChart,
  Pie,
  ResponsiveContainer,
  Tooltip,
  Cell,
  Legend,
} from "recharts";

export interface PieChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
  nameKey?: string;
  dataKey?: string;
  innerRadius?: number;
  outerRadius?: number;
  height?: number;
  title?: string;
  description?: string;
  colors?: string[];
  valueFormatter?: (value: number) => string;
  showLegend?: boolean;
  showTooltip?: boolean;
  showLabels?: boolean;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

const PieChart = ({
  data,
  nameKey = "name",
  dataKey = "value",
  innerRadius = 0,
  outerRadius = 80,
  height = 300,
  title,
  description,
  colors = COLORS,
  valueFormatter = (value) => `${value}`,
  showLegend = true,
  showTooltip = true,
  showLabels = false
}: PieChartProps) => {
  return (
    <Card>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <RechartsPieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={showLabels}
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              fill="#8884d8"
              dataKey={dataKey}
              nameKey={nameKey}
              label={showLabels ? ({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%` : false}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={colors[index % colors.length]} 
                />
              ))}
            </Pie>
            {showTooltip && (
              <Tooltip
                formatter={(value) => [valueFormatter(value as number), '']}
                contentStyle={{ 
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  borderColor: "rgba(0, 0, 0, 0.1)",
                  borderRadius: 6, 
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" 
                }}
              />
            )}
            {showLegend && (
              <Legend 
                layout="horizontal" 
                verticalAlign="bottom" 
                align="center"
                iconType="circle"
                iconSize={8}
                fontSize={12}
              />
            )}
          </RechartsPieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default PieChart;
