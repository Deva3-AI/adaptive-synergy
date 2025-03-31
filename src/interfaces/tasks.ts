
export interface Task {
  task_id: number;
  title: string;
  description: string;
  client_id?: number;
  client_name?: string; // Added for joining with client table
  assigned_to?: number;
  assignee_name?: string; // Added for joining with users table
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority?: 'high' | 'medium' | 'low';
  estimated_time?: number;
  actual_time?: number;
  start_time?: string;
  end_time?: string;
  due_date?: string;
  created_at: string;
  updated_at?: string;
}

export interface DetailedTask {
  id: number;
  title: string;
  description: string;
  client: string;
  priority: 'high' | 'medium' | 'low';
  status: string;
  dueDate: Date;
  estimatedHours: number;
  actualHours: number;
  assignedTo: string;
  comments?: TaskComment[];
  attachments?: TaskAttachment[];
}

export interface TaskComment {
  id: number;
  taskId: number;
  userId: number;
  userName: string;
  comment: string;
  createdAt: string;
}

export interface TaskAttachment {
  id: number;
  taskId: number;
  fileName: string;
  fileType: string;
  fileSize: number;
  url: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface TaskFilter {
  status?: string;
  priority?: string;
  assignedTo?: number;
  clientId?: number;
  search?: string;
  startDate?: string;
  endDate?: string;
}

export interface TasksSummary {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  cancelled: number;
  overdueCount: number;
  dueSoonCount: number;
  completionRate: number;
}
