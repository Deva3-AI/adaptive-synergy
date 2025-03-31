
export interface DetailedTask {
  id: number;
  task_id?: number;
  title: string;
  description: string;
  client?: string;
  client_id?: number;
  clientLogo?: string;
  dueDate?: Date;
  startDate?: Date;
  priority: 'low' | 'medium' | 'high' | string;
  status: string;
  progress: number;
  estimatedHours: number;
  actualHours: number;
  assignedTo: string;
  attachments: any[];
  comments: any[];
  tags: string[];
  drive_link?: string;
  progress_description?: string;
  recentActivity: {
    id: number;
    type: string;
    user: string;
    timestamp: Date;
    description: string;
  }[];
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
  status: 'pending' | 'paid' | 'draft' | 'final';
}

export interface DateRange {
  from: Date;
  to: Date;
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
  interview_date?: string;
  interview_feedback?: string;
  rating: number; 
  source: string;
  last_contact: string;
}
