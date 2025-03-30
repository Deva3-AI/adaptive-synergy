
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
  priority: 'low' | 'medium' | 'high';
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
