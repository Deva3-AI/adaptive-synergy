
export interface Task {
  task_id: number;
  id?: number;
  title: string;
  description: string;
  client_id?: number;
  client_name?: string;
  client?: string; // For backward compatibility
  assigned_to?: number;
  assignee_name?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  estimated_time?: number;
  actual_time?: number;
  start_time?: string;
  end_time?: string;
  created_at?: string;
  updated_at?: string;
  priority: string;
  progress: number;
  attachments?: any[];
  comments?: any[];
  due_date?: string;
}

export interface DetailedTask {
  id: number;
  title: string;
  description: string;
  client: string;
  clientLogo?: string;
  priority: 'low' | 'medium' | 'high';
  status: string;
  dueDate: Date;
  startDate: Date;
  progress: number;
  estimatedHours: number;
  actualHours: number;
  assignedTo: string;
  attachments: TaskAttachment[];
  tags: string[];
  recentActivity: TaskActivity[];
  task_id?: number;
  comments?: any[];
}

export interface TaskAttachment {
  id: number;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadedAt: Date;
  uploadedBy: string;
  url: string;
}

export interface TaskActivity {
  id: number;
  type: 'comment' | 'status' | 'attachment' | 'assignment';
  user: string;
  userAvatar?: string;
  timestamp: Date;
  content: string;
}

export interface TaskFilterOptions {
  status?: string[];
  priority?: string[];
  client?: string[];
  assigned?: string[];
  dueDate?: [Date | null, Date | null];
}

export interface TaskUpdateInput {
  title?: string;
  description?: string;
  status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  client_id?: number;
  assigned_to?: number;
  estimated_time?: number;
  actual_time?: number;
  start_time?: string;
  end_time?: string;
  priority?: string;
  progress?: number;
}

export interface TaskComment {
  id: number;
  task_id: number;
  user_id: number;
  user_name: string;
  user_avatar?: string;
  content: string;
  created_at: string;
  updated_at?: string;
  attachments?: TaskAttachment[];
}

export type TaskFilter = {
  status?: string[];
  priority?: string[];
  client?: string[];
  assigned?: string[];
  dueDate?: [Date | null, Date | null];
  search?: string;
  startDate?: string;
  endDate?: string;
  assignedTo?: number[];
  clientId?: number[];
};
