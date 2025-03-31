
export interface Task {
  task_id: number;
  id?: number; // Adding for backward compatibility
  title: string;
  description: string;
  client_id?: number;
  client_name?: string; // Added for joining with client table
  client?: string; // For backward compatibility
  assigned_to?: number;
  assignee_name?: string; // Added for joining with users table
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority?: 'high' | 'medium' | 'low';
  estimated_time?: number;
  actual_time?: number;
  start_time?: string;
  end_time?: string;
  due_date?: string;
  dueDate?: Date; // For backward compatibility
  created_at: string;
  updated_at?: string;
}

export interface DetailedTask {
  id: number;
  task_id?: number; // For backward compatibility
  title: string;
  description: string;
  client: string;
  client_id?: number;
  clientLogo?: string;
  priority: 'high' | 'medium' | 'low';
  status: string;
  dueDate?: Date;
  startDate?: Date;
  progress: number;
  estimatedHours: number;
  actualHours: number;
  assignedTo: string;
  comments?: TaskComment[];
  attachments?: TaskAttachment[];
  tags?: string[];
  drive_link?: string;
  progress_description?: string;
  recentActivity?: {
    id: number;
    type: string;
    user: string;
    timestamp: Date;
    description: string;
  }[];
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
