
import React, { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send, X, Sparkles, ChevronDown, ChevronUp, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import aiService from "@/services/api/aiService";
import { useAuth } from "@/hooks/use-auth";
import { useClients, useTasks, useEmployees } from "@/utils/apiUtils";
import { useToast } from "@/hooks/use-toast";

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

export const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Fetch data that will be helpful for the assistant
  const { data: clients } = useClients();
  const { data: tasks } = useTasks();
  const { data: employees } = useEmployees();

  // Define suggestion categories
  const suggestionCategories: SuggestionCategory[] = [
    {
      id: 'general',
      name: 'General',
      suggestions: [
        'How can I use the AI features?',
        'Show me a summary of current projects',
        'What tasks are due this week?'
      ]
    },
    {
      id: 'productivity',
      name: 'Productivity',
      suggestions: [
        'Analyze my team performance',
        'Suggest optimization for my workflow',
        'Generate a report on current tasks'
      ]
    },
    {
      id: 'insights',
      name: 'Insights',
      suggestions: [
        'What are the trends in our client data?',
        'Analyze our financial performance',
        'Predict resource requirements for upcoming projects'
      ]
    }
  ];

  // Welcome message when chatbot opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: generateId(),
          content: `Hello${user ? ` ${user.name}` : ''}! I'm Hive Assistant, your AI helper. I can answer questions about projects, tasks, clients, and provide insights based on your data. How can I help you today?`,
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
      // Call AI service to get response
      const context = {
        clients: clients || [],
        tasks: tasks || [],
        employees: employees || [],
        user: user || { name: 'Guest' }
      };
      
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
      toast({
        title: "AI Assistant Error",
        description: "There was an error processing your request.",
        variant: "destructive"
      });
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
          "fixed bottom-24 right-6 w-80 shadow-lg z-40 flex flex-col transition-all duration-300 ease-in-out",
          expanded ? "h-[80vh] w-96" : "h-[60vh]",
          isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/logo.png" alt="Hive AI" />
              <AvatarFallback><Bot size={16} /></AvatarFallback>
            </Avatar>
            <span className="font-semibold">Hive Assistant</span>
          </div>
          <div className="flex items-center gap-1">
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

        {/* Suggestions */}
        {messages.length <= 2 && (
          <div className="px-3 py-2 border-t">
            <p className="text-xs text-muted-foreground mb-2">Suggested questions:</p>
            <div className="flex flex-wrap gap-1">
              {suggestionCategories.flatMap(category => 
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

export default AIAssistant;
