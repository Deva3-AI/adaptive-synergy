
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
  status: "rejected" | "new" | "screening" | "interview" | "offer" | "hired";
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
