
// Define the types for platform messages
export type PlatformType = 'slack' | 'discord' | 'email' | 'trello' | 'other';

export interface PlatformMessage {
  id: string;
  content: string;
  sender: string;
  timestamp: string;
  platform: PlatformType;
}

export class KnowledgeExtractor {
  static async buildKnowledgeBase(
    clients: any[],
    tasks: any[],
    employees: any[],
    platformMessages: any[]
  ) {
    try {
      // Process and convert platform messages to expected format
      const formattedMessages = platformMessages.map(msg => ({
        ...msg,
        platform: (msg.platform || 'other') as PlatformType
      }));
      
      // Build knowledge base from various data sources
      const knowledgeBase = {
        clients: {
          clientCount: clients.length,
          activeClients: clients.filter((c: any) => c.status === 'active').length,
          topClients: clients.slice(0, 3).map((c: any) => c.client_name || c.name),
          industries: [...new Set(clients.map((c: any) => c.industry).filter(Boolean))],
        },
        tasks: {
          total: tasks.length,
          completed: tasks.filter((t: any) => t.status === 'completed').length,
          inProgress: tasks.filter((t: any) => t.status === 'in_progress').length,
          pending: tasks.filter((t: any) => t.status === 'pending').length,
          overdue: tasks.filter((t: any) => {
            if (!t.due_date) return false;
            return new Date(t.due_date) < new Date() && t.status !== 'completed';
          }).length,
          completionRate: `${tasks.length > 0 
            ? Math.round((tasks.filter((t: any) => t.status === 'completed').length / tasks.length) * 100) 
            : 0}%`
        },
        employees: {
          employeeCount: employees.length,
          departments: [...new Set(employees.map((e: any) => e.department).filter(Boolean))],
          roles: [...new Set(employees.map((e: any) => e.role).filter(Boolean))],
        },
        communication: {
          recentMessages: formattedMessages.slice(-10),
          platforms: [...new Set(formattedMessages.map(m => m.platform))],
          messageCount: formattedMessages.length,
        }
      };
      
      return knowledgeBase;
    } catch (error) {
      console.error('Error building knowledge base:', error);
      // Return a minimal knowledge base on error
      return {
        clients: { clientCount: 0 },
        tasks: { total: 0, completionRate: '0%' },
        employees: { employeeCount: 0 },
        communication: { messageCount: 0 }
      };
    }
  }
}

export default KnowledgeExtractor;
