
export interface Task {
  task_id: number;
  title: string;
  description?: string;
  client_id?: number;
  assigned_to?: number;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  estimated_time?: number;
  actual_time?: number;
  start_time?: string;
  end_time?: string;
  created_at?: string;
  updated_at?: string;
  clients?: {
    client_id?: number;
    client_name?: string;
  };
  users?: {
    user_id?: number;
    name?: string;
    email?: string;
  };
}

export interface TaskComment {
  id: number;
  task_id: number;
  user_id: number;
  comment: string;
  created_at: string;
  user: {
    name: string;
  };
}

export interface TaskAttachment {
  id: number;
  task_id: number;
  file_name: string;
  file_type: string;
  file_size: number;
  url: string;
  uploaded_by: string;
  uploaded_at: string;
}

export interface TaskStatistics {
  total: number;
  completed: number;
  in_progress: number;
  pending: number;
  cancelled: number;
  completion_rate: number;
  avg_completion_time: string;
  by_client: {
    client_id: number;
    client_name: string;
    count: number;
    completed: number;
  }[];
  by_status: {
    status: string;
    count: number;
  }[];
  by_priority: {
    priority: string;
    count: number;
  }[];
  time_tracking: {
    estimated: number;
    actual: number;
    efficiency: number;
  };
  recent_tasks: Task[];
}
