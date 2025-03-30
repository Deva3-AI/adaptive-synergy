
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
  status: 'draft' | 'final' | 'pending' | 'paid';
}

export interface HRTask {
  id: number;
  title: string;
  description: string;
  assignee: number;
  assigneeName: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  category: 'recruitment' | 'payroll' | 'training' | 'administrative' | 'other';
  estimatedHours: number;
  actualHours?: number;
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
  status: 'new' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected';
  notes: string;
  match_score: number;
  source: string;
  last_contact: string;
}

export interface EmployeeAttendance {
  id: number;
  employee_id: number;
  employee_name: string;
  date: string;
  login_time?: string;
  logout_time?: string;
  working_hours?: number;
  status: 'present' | 'absent' | 'half-day' | 'leave' | 'holiday' | 'weekend';
  notes?: string;
}

export interface PerformanceReview {
  id: number;
  employee_id: number;
  employee_name: string;
  review_period: string;
  review_date: string;
  reviewer_id: number;
  reviewer_name: string;
  ratings: {
    category: string;
    score: number;
    comments: string;
  }[];
  overall_rating: number;
  strengths: string[];
  areas_for_improvement: string[];
  goals: {
    description: string;
    deadline: string;
    metrics: string;
  }[];
  status: 'draft' | 'submitted' | 'reviewed' | 'acknowledged';
}

export interface JobPosting {
  id: number;
  title: string;
  department: string;
  location: string;
  employment_type: 'full-time' | 'part-time' | 'contract' | 'temporary' | 'internship';
  experience_level: 'entry' | 'mid' | 'senior' | 'executive';
  salary_range?: {
    min: number;
    max: number;
    currency: string;
  };
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  posting_date: string;
  closing_date?: string;
  status: 'draft' | 'active' | 'filled' | 'closed';
  applicant_count: number;
  platform_postings: {
    platform: string;
    url: string;
    status: 'active' | 'expired';
    applicants: number;
  }[];
}
