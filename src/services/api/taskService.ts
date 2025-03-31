// Import necessary dependencies
import { mockUserData } from '@/utils/mockData';

// Task service 
export const taskService = {
  getTasks: async (filters?: any) => {
    // Simulate API call with delay
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real app, this would be an API call with filters
        let tasks = [
          {
            id: 1,
            task_id: 1,
            title: 'Redesign homepage',
            description: 'Create a responsive design for the company website homepage',
            client_id: 1,
            client_name: 'Acme Corp',
            assigned_to: 1,
            assignee_name: 'John Doe',
            status: 'in_progress',
            priority: 'high',
            due_date: '2023-07-20',
            created_at: '2023-07-01',
            updated_at: '2023-07-05',
            progress: 65,
            estimated_time: 12,
            actual_time: 8
          },
          {
            id: 2,
            task_id: 2,
            title: 'Develop API endpoints',
            description: 'Create RESTful API endpoints for user authentication',
            client_id: 2,
            client_name: 'TechStart Inc',
            assigned_to: 2,
            assignee_name: 'Jane Smith',
            status: 'pending',
            priority: 'medium',
            due_date: '2023-07-25',
            created_at: '2023-07-02',
            updated_at: '2023-07-02',
            progress: 0,
            estimated_time: 16,
            actual_time: 0
          },
          {
            id: 3,
            task_id: 3,
            title: 'QA Testing',
            description: 'Perform quality assurance testing on the new features',
            client_id: 1,
            client_name: 'Acme Corp',
            assigned_to: 3,
            assignee_name: 'Mike Johnson',
            status: 'completed',
            priority: 'low',
            due_date: '2023-07-10',
            created_at: '2023-07-01',
            updated_at: '2023-07-08',
            progress: 100,
            estimated_time: 8,
            actual_time: 7
          }
        ];
        
        // Apply filters if provided
        if (filters) {
          if (filters.status) {
            tasks = tasks.filter(task => task.status === filters.status);
          }
          
          if (filters.priority) {
            tasks = tasks.filter(task => task.priority === filters.priority);
          }
          
          if (filters.assignedTo) {
            tasks = tasks.filter(task => task.assigned_to === filters.assignedTo);
          }
          
          if (filters.clientId) {
            tasks = tasks.filter(task => task.client_id === filters.clientId);
          }
        }
        
        resolve(tasks);
      }, 500);
    });
  },
  
  getTaskById: async (taskId: number) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const tasks = [
          {
            id: 1,
            task_id: 1,
            title: 'Redesign homepage',
            description: 'Create a responsive design for the company website homepage',
            client_id: 1,
            client_name: 'Acme Corp',
            assigned_to: 1,
            assignee_name: 'John Doe',
            status: 'in_progress',
            priority: 'high',
            due_date: '2023-07-20',
            created_at: '2023-07-01',
            updated_at: '2023-07-05',
            progress: 65,
            estimated_time: 12,
            actual_time: 8,
            comments: [
              {
                id: 1,
                user: 'Jane Smith',
                text: 'I think we should use a mobile-first approach for this redesign.',
                created_at: '2023-07-02T14:30:00'
              },
              {
                id: 2,
                user: 'John Doe',
                text: 'Agreed, I'll start with the mobile layouts first.',
                created_at: '2023-07-02T15:45:00'
              }
            ]
          },
          {
            id: 2,
            task_id: 2,
            title: 'Develop API endpoints',
            description: 'Create RESTful API endpoints for user authentication',
            client_id: 2,
            client_name: 'TechStart Inc',
            assigned_to: 2,
            assignee_name: 'Jane Smith',
            status: 'pending',
            priority: 'medium',
            due_date: '2023-07-25',
            created_at: '2023-07-02',
            updated_at: '2023-07-02',
            progress: 0,
            estimated_time: 16,
            actual_time: 0,
            comments: []
          }
        ];
        
        const task = tasks.find(t => t.task_id === taskId);
        
        if (task) {
          resolve(task);
        } else {
          reject(new Error('Task not found'));
        }
      }, 500);
    });
  },
  
  createTask: async (taskData: any) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real app, this would send data to an API
        const newTask = {
          id: Math.floor(Math.random() * 1000) + 10,
          task_id: Math.floor(Math.random() * 1000) + 10,
          ...taskData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          progress: 0
        };
        
        resolve(newTask);
      }, 500);
    });
  },
  
  updateTask: async (taskId: number, taskData: any) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real app, this would update data via an API
        const updatedTask = {
          id: taskId,
          task_id: taskId,
          ...taskData,
          updated_at: new Date().toISOString()
        };
        
        resolve(updatedTask);
      }, 500);
    });
  },
  
  deleteTask: async (taskId: number) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real app, this would delete a task via an API
        resolve({ success: true, message: 'Task deleted successfully' });
      }, 500);
    });
  },
  
  startTask: async (taskId: number) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real app, this would update a task's status via an API
        const updatedTask = {
          id: taskId,
          task_id: taskId,
          status: 'in_progress',
          start_time: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        resolve(updatedTask);
      }, 500);
    });
  },
  
  completeTask: async (taskId: number) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real app, this would update a task's status via an API
        const updatedTask = {
          id: taskId,
          task_id: taskId,
          status: 'completed',
          progress: 100,
          end_time: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        resolve(updatedTask);
      }, 500);
    });
  },
  
  updateTaskProgress: async (taskId: number, progress: number) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real app, this would update a task's progress via an API
        const updatedTask = {
          id: taskId,
          task_id: taskId,
          progress,
          updated_at: new Date().toISOString()
        };
        
        resolve(updatedTask);
      }, 500);
    });
  },
  
  addTaskComment: async (taskId: number, commentData: any) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real app, this would add a comment via an API
        const newComment = {
          id: Math.floor(Math.random() * 1000) + 10,
          task_id: taskId,
          user_id: commentData.user_id,
          user_name: commentData.user_name,
          content: commentData.content,
          created_at: new Date().toISOString()
        };
        
        resolve(newComment);
      }, 500);
    });
  },
  
  getTaskComments: async (taskId: number) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real app, this would fetch comments via an API
        const comments = [
          {
            id: 1,
            task_id: taskId,
            user: 'Jane Smith',
            text: 'I think we should use a mobile-first approach for this redesign.',
            created_at: '2023-07-02T14:30:00'
          },
          {
            id: 2,
            task_id: taskId,
            user: 'John Doe',
            text: 'Agreed, I'll start with the mobile layouts first.',
            created_at: '2023-07-02T15:45:00'
          }
        ];
        
        resolve(comments);
      }, 500);
    });
  },
  
  uploadTaskAttachments: async (taskId: number, files: File[]) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real app, this would upload files via an API
        const attachments = files.map((file, index) => ({
          id: `${taskId}-${Date.now()}-${index}`,
          task_id: taskId,
          name: file.name,
          size: file.size,
          type: file.type,
          url: URL.createObjectURL(file),
          uploadedAt: new Date().toISOString(),
          uploadedBy: 'Current User'
        }));
        
        resolve(attachments);
      }, 1000);
    });
  },
  
  getTaskAttachments: async (taskId: number) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real app, this would fetch attachments via an API
        const attachments = [
          {
            id: `${taskId}-1`,
            task_id: taskId,
            name: 'requirements.pdf',
            size: 2456000,
            type: 'application/pdf',
            url: '#',
            uploadedAt: '2023-07-01T10:30:00',
            uploadedBy: 'Jane Smith'
          },
          {
            id: `${taskId}-2`,
            task_id: taskId,
            name: 'mockup.png',
            size: 1234000,
            type: 'image/png',
            url: '#',
            uploadedAt: '2023-07-02T14:15:00',
            uploadedBy: 'John Doe'
          }
        ];
        
        resolve(attachments);
      }, 500);
    });
  },
  
  deleteTaskAttachment: async (taskId: number, attachmentId: string) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real app, this would delete an attachment via an API
        resolve({ success: true, message: 'Attachment deleted successfully' });
      }, 500);
    });
  },
  
  getTasksByClient: async (clientId: number) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real app, this would fetch tasks via an API
        const tasks = [
          {
            id: 1,
            task_id: 1,
            title: 'Redesign homepage',
            description: 'Create a responsive design for the company website homepage',
            client_id: clientId,
            client_name: 'Acme Corp',
            assigned_to: 1,
            assignee_name: 'John Doe',
            status: 'in_progress',
            priority: 'high',
            due_date: '2023-07-20',
            created_at: '2023-07-01',
            updated_at: '2023-07-05',
            progress: 65,
            estimated_time: 12,
            actual_time: 8
          },
          {
            id: 3,
            task_id: 3,
            title: 'QA Testing',
            description: 'Perform quality assurance testing on the new features',
            client_id: clientId,
            client_name: 'Acme Corp',
            assigned_to: 3,
            assignee_name: 'Mike Johnson',
            status: 'completed',
            priority: 'low',
            due_date: '2023-07-10',
            created_at: '2023-07-01',
            updated_at: '2023-07-08',
            progress: 100,
            estimated_time: 8,
            actual_time: 7
          }
        ].filter(task => task.client_id === clientId);
        
        resolve(tasks);
      }, 500);
    });
  },
  
  getTasksByEmployee: async (employeeId: number) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real app, this would fetch tasks via an API
        const tasks = [
          {
            id: 1,
            task_id: 1,
            title: 'Redesign homepage',
            description: 'Create a responsive design for the company website homepage',
            client_id: 1,
            client_name: 'Acme Corp',
            assigned_to: employeeId,
            assignee_name: 'John Doe',
            status: 'in_progress',
            priority: 'high',
            due_date: '2023-07-20',
            created_at: '2023-07-01',
            updated_at: '2023-07-05',
            progress: 65,
            estimated_time: 12,
            actual_time: 8
          },
          {
            id: 2,
            task_id: 2,
            title: 'Develop API endpoints',
            description: 'Create RESTful API endpoints for user authentication',
            client_id: 2,
            client_name: 'TechStart Inc',
            assigned_to: employeeId,
            assignee_name: 'John Doe',
            status: 'pending',
            priority: 'medium',
            due_date: '2023-07-25',
            created_at: '2023-07-02',
            updated_at: '2023-07-02',
            progress: 0,
            estimated_time: 16,
            actual_time: 0
          }
        ].filter(task => task.assigned_to === employeeId);
        
        resolve(tasks);
      }, 500);
    });
  },
  
  getTasksByUser: async (userId: number) => {
    return taskService.getTasksByEmployee(userId);
  },
  
  getTasksSummary: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real app, this would fetch summary data via an API
        const summary = {
          total: 12,
          completed: 5,
          in_progress: 4,
          pending: 3,
          overdue: 2,
          by_priority: {
            high: 4,
            medium: 6,
            low: 2
          },
          by_client: [
            { client_id: 1, client_name: 'Acme Corp', count: 5 },
            { client_id: 2, client_name: 'TechStart Inc', count: 7 }
          ]
        };
        
        resolve(summary);
      }, 500);
    });
  }
};
