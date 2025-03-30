
export interface Employee {
  user_id: number;
  name: string;
  email: string;
  role_id: number;
  role: string;
  joining_date?: string;
  employee_id?: string;
  date_of_birth?: string;
  department?: string;
  position?: string;
  status?: 'active' | 'inactive' | 'on_leave';
}

export interface EmployeeAttendance {
  attendance_id: number;
  user_id: number;
  login_time: string | null;
  logout_time: string | null;
  work_date: string;
  employee_name?: string;
  department?: string;
  total_hours?: number;
  status?: 'present' | 'absent' | 'late' | 'half_day' | 'on_leave';
}

export interface AttendanceStats {
  present_count: number;
  absent_count: number;
  late_count: number;
  leave_count: number;
  total_employees: number;
  average_hours: number;
  records: EmployeeAttendance[];
}

export interface LeaveRequest {
  id: number;
  employeeId: number;
  employeeName: string;
  leaveType: 'annual' | 'sick' | 'personal' | 'wfh' | 'halfDay' | 'other';
  startDate: string;
  endDate?: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
  documentUrl?: string;
}

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
  status: 'paid' | 'pending' | 'draft' | 'final';
}

export interface JobOpening {
  id: number;
  title: string;
  department: string;
  location: string;
  type: 'full_time' | 'part_time' | 'contract' | 'remote';
  description: string;
  requirements: string[];
  responsibilities: string[];
  salary_range?: {
    min: number;
    max: number;
  };
  posted_date: string;
  status: 'open' | 'closed' | 'on_hold';
  applicants_count: number;
  source?: 'linkedin' | 'indeed' | 'website' | 'referral' | 'other';
}

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
  status: 'new' | 'screening' | 'interview' | 'offer' | 'rejected' | 'hired';
  match_score: number;
  notes: string;
  strengths: string[];
  gaps: string[];
  source?: 'linkedin' | 'indeed' | 'website' | 'referral' | 'email' | 'other';
  last_contact?: string;
}

export interface PerformanceMetric {
  id: number;
  employee_id: number;
  employee_name: string;
  productivity_score: number;
  quality_score: number;
  communication_score: number;
  teamwork_score: number;
  punctuality_score: number;
  overall_score: number;
  period: string;
  strengths: string[];
  areas_for_improvement: string[];
}

export interface HRTrend {
  id: number;
  title: string;
  description: string;
  relevance_score: number;
  category: string;
  source: string;
  discovered_at: string;
  actionable: boolean;
  suggested_actions: string[];
}

export interface HRTask {
  id: number;
  title: string;
  description: string;
  assigned_to: number;
  assigned_to_name?: string;
  due_date: string;
  estimated_time: number;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  related_to?: {
    type: 'employee' | 'candidate' | 'job' | 'payroll' | 'other';
    id: number;
    name: string;
  };
  completed_at?: string;
}

export interface HRPlan {
  id: number;
  title: string;
  description: string;
  created_at: string;
  start_date: string;
  end_date: string;
  status: 'draft' | 'active' | 'completed';
  goals: {
    id: number;
    title: string;
    description: string;
    metrics: string;
    target: string;
    status: 'pending' | 'in_progress' | 'completed';
  }[];
  strategies: {
    id: number;
    title: string;
    description: string;
    tasks: HRTask[];
  }[];
  progress: number;
}

export interface HRMetrics {
  hiring: {
    time_to_hire: number;
    cost_per_hire: number;
    offer_acceptance_rate: number;
    application_completion_rate: number;
    qualified_candidates_per_role: number;
  };
  retention: {
    employee_turnover_rate: number;
    average_tenure: number;
    voluntary_turnover_rate: number;
    involuntary_turnover_rate: number;
    top_performer_retention_rate: number;
  };
  productivity: {
    average_productivity_score: number;
    tasks_completed_per_employee: number;
    revenue_per_employee: number;
    training_effectiveness: number;
  };
  attendance: {
    attendance_rate: number;
    absenteeism_rate: number;
    average_working_hours: number;
    overtime_hours: number;
  };
  efficiency: {
    hr_task_completion_rate: number;
    payroll_accuracy: number;
    average_time_to_resolve_hr_issues: number;
    hr_to_employee_ratio: number;
  };
}
