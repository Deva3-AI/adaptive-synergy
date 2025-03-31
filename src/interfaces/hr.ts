
export interface LeaveRequest {
  id: number;
  employee_id: number;
  employee_name: string;
  start_date: string;
  end_date: string;
  leaveType: "annual" | "sick" | "personal" | "wfh" | "halfDay" | "other";
  reason: string;
  status: "pending" | "approved" | "rejected";
  approver_id?: number;
  approver_name?: string;
  created_at: string;
  documents?: string[];
  comments?: string[];
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
  status: "new" | "screening" | "interview" | "offer" | "hired" | "rejected";
  interview_date?: string;
  interviewer_id?: number;
  interviewer_name?: string;
  feedback?: string;
  rating?: number;
  salary_expectation?: number;
  notes?: string;
  last_contact: string;
}

export interface Job {
  id: number;
  title: string;
  department: string;
  location: string;
  type: "full-time" | "part-time" | "contract" | "remote";
  description: string;
  requirements: string[];
  responsibilities: string[];
  salary_range: {
    min: number;
    max: number;
  };
  posted_date: string;
  closing_date: string;
  status: "open" | "filled" | "closed";
  applicants_count: number;
  shortlisted_count: number;
}

export interface PaySlip {
  id: number;
  employee_id: number;
  employee_name: string;
  period: string;
  basic_salary: number;
  allowances: {
    name: string;
    amount: number;
  }[];
  deductions: {
    name: string;
    amount: number;
  }[];
  reimbursements: {
    name: string;
    amount: number;
  }[];
  gross_pay: number;
  net_pay: number;
  tax: number;
  generation_date: string;
  payment_date: string;
  status: "pending" | "paid" | "draft" | "final";
  bank_account?: string;
  notes?: string;
}

export interface EmployeeAttendance {
  id: number;
  employee_id: number;
  employee_name: string;
  date: string;
  login_time: string;
  logout_time: string;
  total_hours: number;
  status: "present" | "absent" | "late" | "half-day" | "leave";
  notes?: string;
}

export interface Department {
  id: number;
  name: string;
  head_id: number;
  head_name: string;
  employee_count: number;
  budget: number;
  created_at: string;
}

export interface PerformanceReview {
  id: number;
  employee_id: number;
  employee_name: string;
  reviewer_id: number;
  reviewer_name: string;
  review_period: {
    start: string;
    end: string;
  };
  review_date: string;
  scores: {
    category: string;
    score: number;
    max_score: number;
    comments: string;
  }[];
  overall_score: number;
  strengths: string[];
  areas_to_improve: string[];
  goals: {
    description: string;
    deadline: string;
    status: "pending" | "in_progress" | "completed" | "overdue";
  }[];
  employee_comments?: string;
  status: "draft" | "pending" | "completed";
}
