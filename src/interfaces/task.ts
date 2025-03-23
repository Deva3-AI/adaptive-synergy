
export interface Task {
  task_id: number;
  title: string;
  description: string;
  client_id?: number;
  client_name?: string;
  assigned_to?: number;
  assignee_name?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  estimated_time?: number;
  actual_time?: number;
  start_time?: string | Date;
  end_time?: string | Date;
  created_at?: string | Date;
  updated_at?: string | Date;
  priority?: 'low' | 'medium' | 'high';
  progress?: number;
  progress_description?: string;
  drive_link?: string;
  brand_id?: number;
  brand_name?: string;
  attachments?: Array<{
    id: number;
    filename: string;
    url: string;
    type: string;
    uploaded_at: string | Date;
  }>;
  tags?: string[];
}

export interface TaskDetailedView extends Task {
  history?: Array<{
    id: number;
    user: string;
    action: string;
    timestamp: string | Date;
    details?: string;
  }>;
  comments?: Array<{
    id: number;
    user: string;
    message: string;
    timestamp: string | Date;
  }>;
  recentActivity?: Array<{
    id: number;
    type: string;
    user: string;
    description: string;
    timestamp: string | Date;
  }>;
}
