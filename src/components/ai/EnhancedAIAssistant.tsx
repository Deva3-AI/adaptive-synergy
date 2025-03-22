
import React, { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  Send, 
  X, 
  Bot, 
  ChevronDown, 
  ChevronUp, 
  RefreshCw,
  Brain,
  FileText,
  Users,
  BarChart,
  Sparkles,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { aiService } from "@/services/api/aiService";
import { useAuth } from "@/hooks/use-auth";
import { useClients, useTasks, useEmployees } from "@/utils/apiUtils";
import { toast } from "sonner";
import { KnowledgeExtractor } from "@/utils/knowledgeExtractor";
import { fetchPlatformMessages } from "@/utils/platformIntegrations";

type Message = {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
};

type SuggestionCategory = {
  id: string;
  name: string;
  suggestions: string[];
};

const generateId = () => Math.random().toString(36).substring(2, 9);

export const EnhancedAIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshingKnowledge, setIsRefreshingKnowledge] = useState(false);
  const [knowledgeBase, setKnowledgeBase] = useState<any>(null);
  const [lastKnowledgeUpdate, setLastKnowledgeUpdate] = useState<Date | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { user } = useAuth();
  
  // Fetch data that will be helpful for the assistant
  const { data: clients = [] } = useClients();
  const { data: tasks = [] } = useTasks();
  const { data: employees = [] } = useEmployees();
  
  // Query to fetch platform messages
  const { data: platformMessages = [] } = useQuery({
    queryKey: ['platformMessages'],
    queryFn: async () => {
      try {
        return await fetchPlatformMessages();
      } catch (error) {
        console.error('Error fetching platform messages:', error);
        return [];
      }
    }
  });

  // Generate dynamic role-specific suggestions based on user role
  const getSuggestionsByRole = () => {
    const role = user?.role || 'employee';
    
    const suggestionsByRole: Record<string, SuggestionCategory[]> = {
      admin: [
        {
          id: 'analysis',
          name: 'Business Analysis',
          suggestions: [
            'What is our current financial health?',
            'Show me employee productivity metrics',
            'Analyze our client acquisition rate'
          ]
        },
        {
          id: 'growth',
          name: 'Growth Strategy',
          suggestions: [
            'What steps can we take to grow 10X in 12 months?',
            'Identify our top performing marketing channels',
            'Suggest ways to improve operational efficiency'
          ]
        }
      ],
      hr: [
        {
          id: 'employees',
          name: 'Employee Management',
          suggestions: [
            'Show attendance patterns for this month',
            'Analyze productivity by team',
            'Identify top performing employees'
          ]
        },
        {
          id: 'hiring',
          name: 'Recruitment',
          suggestions: [
            'What roles should we prioritize hiring for?',
            'Suggest interview questions for designers',
            'Generate a job description for a development role'
          ]
        }
      ],
      employee: [
        {
          id: 'tasks',
          name: 'Task Management',
          suggestions: [
            'What are my highest priority tasks?',
            'Summarize my current client requirements',
            'How can I improve my productivity?'
          ]
        },
        {
          id: 'learning',
          name: 'Career Growth',
          suggestions: [
            'Suggest skills I should develop',
            'Help me draft a progress report',
            'What metrics should I focus on improving?'
          ]
        }
      ],
      client: [
        {
          id: 'projects',
          name: 'Project Status',
          suggestions: [
            'What is the status of my current projects?',
            'Show me a timeline of upcoming deliverables',
            'Summarize recent communication from your team'
          ]
        },
        {
          id: 'feedback',
          name: 'Feedback',
          suggestions: [
            'How can I provide effective feedback?',
            'Help me write a brief for a new project',
            'What information do you need from me?'
          ]
        }
      ],
      finance: [
        {
          id: 'analysis',
          name: 'Financial Analysis',
          suggestions: [
            'Analyze our cash flow trends',
            'What is our client acquisition cost?',
            'Show revenue forecasts based on current data'
          ]
        },
        {
          id: 'optimization',
          name: 'Optimization',
          suggestions: [
            'Identify cost-saving opportunities',
            'Which services have the highest profit margins?',
            'Suggest pricing strategy improvements'
          ]
        }
      ],
      marketing: [
        {
          id: 'campaigns',
          name: 'Campaign Analysis',
          suggestions: [
            'Analyze our recent marketing campaign performance',
            'Which channels are driving the most conversions?',
            'Suggest content ideas for our target audience'
          ]
        },
        {
          id: 'strategy',
          name: 'Strategy',
          suggestions: [
            'What marketing strategies should we focus on?',
            'How can we improve our customer engagement?',
            'Generate social media post ideas for our services'
          ]
        }
      ]
    };
    
    // Return role-specific suggestions or default to employee
    return suggestionsByRole[role] || suggestionsByRole.employee;
  };

  // Initial knowledge base generation
  useEffect(() => {
    if (isOpen && clients.length > 0 && !knowledgeBase) {
      refreshKnowledgeBase();
    }
  }, [isOpen, clients, tasks, employees, platformMessages]);

  // Refresh knowledge base with latest data
  const refreshKnowledgeBase = async () => {
    setIsRefreshingKnowledge(true);
    try {
      const knowledge = await KnowledgeExtractor.buildKnowledgeBase(
        clients,
        tasks,
        employees,
        platformMessages
      );
      setKnowledgeBase(knowledge);
      setLastKnowledgeUpdate(new Date());
      console.log('Knowledge base refreshed:', knowledge);
    } catch (error) {
      console.error('Error refreshing knowledge base:', error);
    } finally {
      setIsRefreshingKnowledge(false);
    }
  };

  // Welcome message when chatbot opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const role = user?.role ? ` ${user.role}` : '';
      setMessages([
        {
          id: generateId(),
          content: `Hello${user ? ` ${user.name}` : ''}! I'm your AI assistant for the Hyper-Integrated AI Workflow platform. As your${role} assistant, I can help with analyzing data, answering questions about clients, tasks, and employees, and providing insights to help drive growth. How can I assist you today?`,
          role: 'assistant',
          timestamp: new Date()
        }
      ]);
    }
  }, [isOpen, user]);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Focus the input when the chatbot opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    const userMessage: Message = {
      id: generateId(),
      content: inputValue,
      role: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      // If knowledge base is not built or older than 5 minutes, refresh it
      if (!knowledgeBase || 
          !lastKnowledgeUpdate || 
          (new Date().getTime() - lastKnowledgeUpdate.getTime() > 300000)) {
        await refreshKnowledgeBase();
      }
      
      // Create context for AI response
      const context = {
        user: {
          id: user?.id || 0,
          name: user?.name || 'Guest',
          role: user?.role || 'employee',
          email: user?.email
        },
        knowledgeBase: knowledgeBase,
        previousMessages: messages.map(m => ({
          role: m.role,
          content: m.content
        }))
      };
      
      // Call AI service to get response
      const response = await aiService.getAssistantResponse(inputValue, context);
      
      const assistantMessage: Message = {
        id: generateId(),
        content: response.message || "I'm sorry, I couldn't process your request at the moment.",
        role: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      const errorMessage: Message = {
        id: generateId(),
        content: "I apologize, but I'm having trouble processing your request right now. Please try again later.",
        role: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      toast.error("There was an error processing your request.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <>
      {/* Chat button */}
      <Button
        variant="default"
        size="icon"
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-40 bg-primary"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </Button>

      {/* Chat window */}
      <Card
        className={cn(
          "fixed bottom-24 right-6 shadow-lg z-40 flex flex-col transition-all duration-300 ease-in-out",
          expanded ? "h-[80vh] w-[450px]" : "h-[60vh] w-[350px]",
          isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/favicon.ico" alt="AI Assistant" />
              <AvatarFallback><Brain className="h-4 w-4" /></AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-semibold text-sm">AI Assistant</span>
              {lastKnowledgeUpdate && (
                <span className="text-xs text-muted-foreground">
                  Updated: {lastKnowledgeUpdate.toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              title="Refresh Knowledge"
              onClick={refreshKnowledgeBase}
              disabled={isRefreshingKnowledge}
            >
              <RefreshCw 
                size={16} 
                className={cn(isRefreshingKnowledge && "animate-spin")} 
              />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={toggleExpanded}
              title={expanded ? "Collapse" : "Expand"}
            >
              {expanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
            </Button>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-3">
          <div className="flex flex-col gap-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex flex-col max-w-[85%] rounded-lg p-3",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground ml-auto"
                    : "bg-muted mr-auto"
                )}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <span className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
            {isLoading && (
              <div className="bg-muted rounded-lg p-3 max-w-[85%] mr-auto">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="animate-pulse">•</span>
                    <span className="animate-pulse delay-100">•</span>
                    <span className="animate-pulse delay-200">•</span>
                  </div>
                  <span className="text-xs opacity-70">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Knowledge Base Stats (when expanded) */}
        {expanded && knowledgeBase && (
          <div className="px-3 py-2 border-t bg-muted/30">
            <p className="text-xs text-muted-foreground mb-2 font-medium">System Knowledge:</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3 text-muted-foreground" />
                <span>{knowledgeBase.clients.clientCount || 0} Clients</span>
              </div>
              <div className="flex items-center gap-1">
                <FileText className="h-3 w-3 text-muted-foreground" />
                <span>{knowledgeBase.tasks.total || 0} Tasks</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3 text-muted-foreground" />
                <span>{knowledgeBase.employees.employeeCount || 0} Employees</span>
              </div>
              <div className="flex items-center gap-1">
                <BarChart className="h-3 w-3 text-muted-foreground" />
                <span>{knowledgeBase.tasks.completionRate || '0%'} Completion</span>
              </div>
            </div>
          </div>
        )}

        {/* Suggestions */}
        {messages.length <= 2 && (
          <div className="px-3 py-2 border-t">
            <p className="text-xs text-muted-foreground mb-2">Suggested questions:</p>
            <div className="flex flex-wrap gap-1">
              {getSuggestionsByRole().flatMap(category => 
                category.suggestions.slice(0, 1).map(suggestion => (
                  <Button
                    key={suggestion}
                    variant="outline"
                    size="sm"
                    className="text-xs py-1 h-auto"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </Button>
                ))
              )}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-3 border-t flex gap-2">
          <Textarea
            ref={inputRef}
            placeholder="Ask me anything..."
            className="resize-none min-h-[40px] max-h-[120px]"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button 
            size="icon" 
            disabled={!inputValue.trim() || isLoading}
            onClick={handleSendMessage}
          >
            <Send size={16} />
          </Button>
        </div>
      </Card>
    </>
  );
};

export default EnhancedAIAssistant;
