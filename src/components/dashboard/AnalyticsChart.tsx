
import React, { useState } from "react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from "recharts";

type ChartType = "bar" | "line" | "pie" | "donut";

interface AnalyticsChartProps {
  data: any[];
  height?: number;
  defaultType?: ChartType;
}

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--muted))",
  "hsl(var(--accent))",
  "#82ca9d",
  "#ffc658",
  "#8884d8",
];

const AnalyticsChart: React.FC<AnalyticsChartProps> = ({
  data,
  height = 300,
  defaultType = "bar",
}) => {
  const [chartType, setChartType] = useState<ChartType>(defaultType);

  const renderChart = () => {
    switch (chartType) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <RechartsBarChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="name" 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={12}
              />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  borderColor: "hsl(var(--border))",
                  borderRadius: "var(--radius)",
                  fontSize: 12,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              {Object.keys(data[0])
                .filter((key) => key !== "name")
                .map((key, index) => (
                  <Bar
                    key={key}
                    dataKey={key}
                    fill={COLORS[index % COLORS.length]}
                    radius={[4, 4, 0, 0]}
                  />
                ))}
            </RechartsBarChart>
          </ResponsiveContainer>
        );
      case "line":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <RechartsLineChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="name" 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={12}
              />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  borderColor: "hsl(var(--border))",
                  borderRadius: "var(--radius)",
                  fontSize: 12,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              {Object.keys(data[0])
                .filter((key) => key !== "name")
                .map((key, index) => (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={COLORS[index % COLORS.length]}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                ))}
            </RechartsLineChart>
          </ResponsiveContainer>
        );
      case "pie":
      case "donut": // Adding support for donut chart type
        return (
          <ResponsiveContainer width="100%" height={height}>
            <RechartsPieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={chartType === "donut" ? 80 : 100}
                innerRadius={chartType === "donut" ? 60 : 0}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  borderColor: "hsl(var(--border))",
                  borderRadius: "var(--radius)",
                  fontSize: 12,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </RechartsPieChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      <div className="mb-4 flex justify-end gap-2">
        <div className="join">
          <button
            className={`btn btn-sm join-item ${chartType === "bar" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}
            onClick={() => setChartType("bar")}
          >
            Bar
          </button>
          <button
            className={`btn btn-sm join-item ${chartType === "line" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}
            onClick={() => setChartType("line")}
          >
            Line
          </button>
          <button
            className={`btn btn-sm join-item ${chartType === "pie" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}
            onClick={() => setChartType("pie")}
          >
            Pie
          </button>
          <button
            className={`btn btn-sm join-item ${chartType === "donut" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}
            onClick={() => setChartType("donut")}
          >
            Donut
          </button>
        </div>
      </div>
      {renderChart()}
    </div>
  );
};

export default AnalyticsChart;
