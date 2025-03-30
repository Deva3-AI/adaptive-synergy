
// Export chart components
export { default as BarChart } from './BarChart';
export { default as LineChart } from './LineChart';
export { default as PieChart } from './PieChart';
export { default as DonutChart } from './DonutChart';

// Export chart props types
export interface BarChartProps {
  data: any[];
  xAxisKey: string;
  series?: { key: string; label: string; color: string }[];
  height?: number;
  className?: string;
  showLegend?: boolean;
}

export interface LineChartProps {
  data: any[];
  xAxisKey: string;
  series?: { key: string; label: string; color: string }[];
  height?: number;
  className?: string;
  showLegend?: boolean;
}

export interface PieChartProps {
  data: any[];
  nameKey: string;
  dataKey: string;
  colors?: string[];
  height?: number;
  className?: string;
  showLegend?: boolean;
}

export interface DonutChartProps {
  data: any[];
  nameKey: string;
  dataKey: string;
  colors?: string[];
  innerRadius?: number;
  outerRadius?: number;
  height?: number;
  className?: string;
  showLegend?: boolean;
}

// Export an AnalyticsChartProps type that wraps all chart types
export interface AnalyticsChartProps {
  data: any[];
  height?: number;
  defaultType?: string;
  xAxisKey?: string;
  series?: { key: string; label: string; color: string }[];
  className?: string;
  options?: {
    lineKeys?: string[];
    lineColors?: string[];
    [key: string]: any;
  };
}
