
export interface Task {
  task_id: number;
  title: string;
  description?: string;
  client_id?: number;
  client_name?: string;
  assigned_to?: number;
  assignee_name?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  estimated_time?: number;
  actual_time?: number;
  start_time?: string;
  end_time?: string;
  created_at?: string;
  updated_at?: string;
  priority?: 'low' | 'medium' | 'high';
  drive_link?: string;
  progress_description?: string;
  attachments?: TaskAttachment[];
}

export interface TaskAttachment {
  attachment_id: number;
  task_id: number;
  file_name: string;
  file_url: string;
  created_at: string;
  file_type: string;
  file_size: number;
}

export interface TaskTimeTracking {
  tracking_id: number;
  task_id: number;
  start_time: string;
  end_time?: string;
  duration?: number;
}

export interface TaskDetailState {
  id: number;
  title: string;
  description: string;
  client: string;
  clientLogo: string;
  clientId?: number;
  dueDate: Date;
  startDate: Date;
  priority: string;
  status: string;
  progress: number;
  estimatedHours: number;
  actualHours: number;
  assignedTo: string;
  assignedToAvatar: string;
  assignedToId?: number;
  attachments: { id: string; name: string; url: string; type: string; size: number; }[];
  recentActivity: { id: string; user: string; action: string; time: Date; }[];
  progress_description?: string;
  drive_link?: string;
}

export default Task;
