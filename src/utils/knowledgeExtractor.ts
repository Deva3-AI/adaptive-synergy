
import { aiService } from '@/services/api/aiService';
import { platformAnalysisService } from '@/services/api/platformAnalysisService';
import { PlatformMessage } from './platformIntegrations';

/**
 * A utility that extracts knowledge from various data sources
 * to create a comprehensive knowledge base for the AI assistant
 */
export class KnowledgeExtractor {
  /**
   * Extracts knowledge from client data
   */
  static async extractFromClients(clients: any[]): Promise<any> {
    try {
      if (!clients || clients.length === 0) return {};
      
      const clientSummaries = clients.map(client => ({
        id: client.client_id,
        name: client.client_name,
        description: client.description || 'No description',
        contact: client.contact_info || 'No contact information',
        created: client.created_at
      }));
      
      return {
        clients: clientSummaries,
        clientCount: clients.length,
        recentClients: clients
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 5)
          .map(c => c.client_name)
      };
    } catch (error) {
      console.error('Error extracting knowledge from clients:', error);
      return {};
    }
  }
  
  /**
   * Extracts knowledge from task data
   */
  static async extractFromTasks(tasks: any[]): Promise<any> {
    try {
      if (!tasks || tasks.length === 0) return {};
      
      const pendingTasks = tasks.filter(t => t.status === 'pending');
      const inProgressTasks = tasks.filter(t => t.status === 'in_progress');
      const completedTasks = tasks.filter(t => t.status === 'completed');
      
      const taskSummary = {
        total: tasks.length,
        pending: pendingTasks.length,
        inProgress: inProgressTasks.length,
        completed: completedTasks.length,
        completionRate: tasks.length > 0 
          ? (completedTasks.length / tasks.length * 100).toFixed(1) + '%' 
          : '0%',
        averageEstimatedTime: tasks.length > 0
          ? (tasks.reduce((sum, t) => sum + (t.estimated_time || 0), 0) / tasks.length).toFixed(1) + ' hours'
          : '0 hours',
        highPriorityTasks: tasks
          .filter(t => t.priority_level === 'high' && t.status !== 'completed')
          .map(t => t.title)
      };
      
      return taskSummary;
    } catch (error) {
      console.error('Error extracting knowledge from tasks:', error);
      return {};
    }
  }
  
  /**
   * Extracts knowledge from employee data
   */
  static async extractFromEmployees(employees: any[]): Promise<any> {
    try {
      if (!employees || employees.length === 0) return {};
      
      return {
        employeeCount: employees.length,
        departments: [...new Set(employees.map(e => e.role || 'Unknown'))],
        recentJoins: employees
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 3)
          .map(e => e.name)
      };
    } catch (error) {
      console.error('Error extracting knowledge from employees:', error);
      return {};
    }
  }
  
  /**
   * Extracts knowledge from platform messages
   */
  static async extractFromPlatformMessages(messages: PlatformMessage[]): Promise<any> {
    try {
      if (!messages || messages.length === 0) return {};
      
      return await platformAnalysisService.extractContextFromMessages(messages);
    } catch (error) {
      console.error('Error extracting knowledge from platform messages:', error);
      return {};
    }
  }
  
  /**
   * Consolidates knowledge from multiple sources
   */
  static async buildKnowledgeBase(clients: any[], tasks: any[], employees: any[], messages: PlatformMessage[]): Promise<any> {
    const clientKnowledge = await this.extractFromClients(clients);
    const taskKnowledge = await this.extractFromTasks(tasks);
    const employeeKnowledge = await this.extractFromEmployees(employees);
    const messageKnowledge = await this.extractFromPlatformMessages(messages);
    
    return {
      clients: clientKnowledge,
      tasks: taskKnowledge,
      employees: employeeKnowledge,
      communication: messageKnowledge,
      lastUpdated: new Date().toISOString()
    };
  }
}

export default KnowledgeExtractor;
