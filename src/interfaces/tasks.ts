
export interface Task {
  task_id: number;
  title: string;
  description: string;
  client_id?: number;
  assigned_to?: number;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  estimated_time?: number;
  actual_time?: number;
  start_time?: string;
  end_time?: string;
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
}
