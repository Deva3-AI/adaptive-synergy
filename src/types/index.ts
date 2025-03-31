
export interface Candidate {
  id: number;
  name: string;
  email: string;
  phone: string;
  job_id: number;
  job_title: string;
  resume_url: string;
  application_date: string;
  skills: string[];
  experience: number;
  education: string;
  status: "new" | "rejected" | "screening" | "interview" | "offer" | "hired";
  notes: string;
  source: string;
  interview_feedback: string;
  last_contact: string;
}

export interface SidebarProps {
  expanded: boolean;
  className?: string;
  isMobile?: boolean; 
}

export interface LeaveRequest {
  id: number;
  employee_id: number;
  employee_name: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: string;
  leaveType: string;
  days: number;
}

export interface DateRangePickerProps {
  className?: string;
  value?: DateRange;
  onChange?: (date: DateRange | undefined) => void;
  // Support for both property patterns
  date?: DateRange;
  setDate?: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
}

export interface DateRange {
  from: Date;
  to?: Date;
}

export interface VirtualManagerInsightsProps {
  userId: number;
  clientId?: number;
  taskId?: number;
}

export interface TeamCostsAnalysisProps {
  period?: 'month' | 'quarter' | 'year';
  startDate?: string;
  endDate?: string;
}

export interface PlatformConfig {
  platform: string;
  name: string;
  connected: boolean;
  lastSync?: string;
  icon: string;
  type?: string;
}

export interface PlatformType {
  id: string;
  name: string;
  icon: string;
}

export interface LucideIcon {
  // Properties needed for Lucide icons
  (props: any): JSX.Element;
  displayName?: string;
}

export interface ChartData {
  name: string;
  value: number;
  color?: string;
  key?: string;
}

export interface SalesGrowthTrackingProps {
  period?: 'month' | 'quarter' | 'year';
  dateRange?: string;
}

// Define the AttendanceLeaveRequest interface for Attendance pages
export interface AttendanceLeaveRequest {
  id: number;
  employee_id: number;
  employee_name: string;
  start_date: string;
  end_date?: string;
  reason: string;
  status: string;
  leaveType?: string;
}

// Define PaySlip interface
export interface PaySlip {
  id: number;
  employeeId: number;
  employeeName: string;
  month: string;
  year: number;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  paidDate?: string;
  status: "pending" | "paid";
}
