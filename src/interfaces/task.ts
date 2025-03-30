
export interface Task {
  task_id: number;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority?: 'low' | 'medium' | 'high';
  estimated_time?: number;
  actual_time?: number;
  start_time?: string;
  end_time?: string;
  due_date?: string;
  created_at: string | Date;
  updated_at: string | Date;
  assigned_to?: number;
  client_id?: number;
  client_name?: string;
  progress?: number;
}

export interface TaskAttachment {
  id: number;
  task_id: number;
  filename: string;
  url: string;
  type: string;
  size?: number;
  uploaded_at: string | Date;
  uploaded_by?: string;
}

export interface TaskComment {
  id: number;
  task_id: number;
  user_id: number;
  user_name: string;
  comment: string;
  created_at: string;
}

export interface TaskStatistics {
  completed: number;
  inProgress: number;
  pending: number;
  cancelled: number;
  totalTasks: number;
  completionRate: number;
  averageCompletionTime: number;
  tasksByDay: {
    date: string;
    count: number;
  }[];
  tasksByPriority: {
    priority: string;
    count: number;
  }[];
}

export interface TaskWithDetails extends Task {
  attachments?: TaskAttachment[];
  comments?: TaskComment[];
  history?: {
    id: number;
    user: string;
    action: string;
    timestamp: string;
    details?: string;
  }[];
}
