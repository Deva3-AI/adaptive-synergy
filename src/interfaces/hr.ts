export interface Employee {
  id: number;
  name: string;
  email: string;
  position: string;
  department: string;
  joinDate: string;
  status: 'active' | 'inactive';
  avatar?: string;
}

export interface Attendance {
  id: number;
  employee_id: number;
  employee_name?: string;
  login_time: string;
  logout_time?: string;
  work_date: string;
  status?: 'present' | 'absent' | 'late' | 'half-day';
  hours_worked?: number;
}

export interface LeaveRequest {
  id: number;
  employee_id: number;
  employee_name: string;
  start_date: string;
  end_date: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  leaveType: 'annual' | 'sick' | 'wfh' | 'halfDay' | 'personal' | 'other';
  notes?: string;
  approver_id?: number;
  approver_name?: string;
  document_url?: string;
}

export interface PaySlip {
  id: number;
  employee_id: number;
  employee_name: string;
  payment_date: string;
  period_start: string;
  period_end: string;
  basic_salary: number;
  allowances: number;
  deductions: number;
  net_salary: number;
  status: 'pending' | 'paid' | 'draft' | 'final';
  notes?: string;
  month: string;
  year: number;
  paidDate?: string;
}

export interface Performance {
  id: number;
  employee_id: number;
  employee_name: string;
  review_period: string;
  review_date: string;
  rating: number;
  feedback: string;
  goals: string[];
  reviewer_id: number;
  reviewer_name: string;
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
  interview_date?: string | null;
  notes?: string;
  rating?: number;
  salary_expectation?: number;
  source?: string;
  last_contact?: string;
}

export interface JobPosting {
  id: number;
  title: string;
  department: string;
  location: string;
  description: string;
  requirements: string[];
  posted_date: string;
  closing_date?: string;
  status: 'draft' | 'open' | 'closed' | 'filled';
  applicants_count: number;
  salary_range?: {
    min: number;
    max: number;
  };
}

export interface HRTask {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  due_date: string;
  assigned_to?: number;
  assigned_name?: string;
  created_at: string;
  updated_at?: string;
  category: 'recruitment' | 'employee' | 'payroll' | 'general';
}

export interface HRDashboardData {
  employees: {
    total: number;
    active: number;
    onLeave: number;
    recentHires: number;
  };
  attendance: {
    present: number;
    absent: number;
    late: number;
    percentPresent: number;
  };
  recruitment: {
    openPositions: number;
    applications: number;
    interviews: number;
    hired: number;
  };
  tasks: {
    total: number;
    completed: number;
    pending: number;
    overdue: number;
  };
  recentActivity: Array<{
    id: number;
    type: string;
    description: string;
    timestamp: string;
  }>;
}

export interface InterviewAssessment {
  id: number;
  candidate_id: number;
  candidate_name: string;
  position: string;
  assessment_date: string;
  coding_score?: number;
  coding_notes?: string;
  english_score?: number;
  english_notes?: string;
  aptitude_score?: number;
  aptitude_notes?: string;
  total_score?: number;
  result?: 'pass' | 'fail' | 'pending';
  conducted_by?: string;
  status: 'draft' | 'completed';
}

export interface CodingChallenge {
  id: number;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  expected_duration: number; // in minutes
  language: string;
  content: string;
}

export interface EnglishAssessment {
  id: number;
  title: string;
  type: 'writing' | 'speaking' | 'comprehension' | 'grammar';
  questions: {
    id: number;
    question: string;
    type: 'multiple-choice' | 'essay' | 'fill-in-blank';
    options?: string[];
    correct_answer?: string;
  }[];
}

export interface AptitudeAssessment {
  id: number;
  title: string;
  category: 'logical' | 'numerical' | 'verbal' | 'abstract';
  questions: {
    id: number;
    question: string;
    options: string[];
    correct_answer: string;
  }[];
}
