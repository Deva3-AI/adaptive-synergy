
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, RefreshCw, Copy, CheckCircle, AlertTriangle, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import clientService from "@/services/api/clientService";
import aiService from "@/services/api/aiService";
import { useParams } from 'react-router-dom';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  message: string;
  timestamp: string;
}

interface ClientDetails {
  client_name: string;
  description: string;
  contact_info: string;
  [key: string]: any;
}

const EnhancedAIAssistant = () => {
  const { clientId } = useParams();
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isClientContextLoading, setIsClientContextLoading] = useState(false);
  const [clientContext, setClientContext] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Load client details for context
  useEffect(() => {
    const loadClientContext = async () => {
      if (!clientId) return;
      setIsClientContextLoading(true);
      try {
        const clientDetails = await clientService.getClientDetails(Number(clientId)) as ClientDetails;
        if (clientDetails) {
          setClientContext(`Client Name: ${clientDetails.client_name}\nDescription: ${clientDetails.description}\nContact Info: ${clientDetails.contact_info}`);
        } else {
          setError('Failed to load client details.');
        }
      } catch (e) {
        setError('Error loading client details.');
        console.error("Error loading client details:", e);
      } finally {
        setIsClientContextLoading(false);
      }
    };

    loadClientContext();
  }, [clientId]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleQuerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      message: query,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages(prevMessages => [...prevMessages, userMessage]);
    setQuery('');
    setIsLoading(true);

    try {
      // Include client context in the query
      const enhancedQuery = `${query}\n\nClient Context:\n${clientContext}`;
      const result = await aiService.getResponse(enhancedQuery);

      if (result && result.response) {
        const aiMessage: ChatMessage = {
          id: Date.now().toString(),
          sender: 'ai',
          message: result.response,
          timestamp: new Date().toLocaleTimeString(),
        };
        setMessages(prevMessages => [...prevMessages, aiMessage]);
        setError(null);
      } else {
        setError('Failed to get a response from the AI.');
      }
    } catch (e) {
      setError('Error processing your query.');
      console.error("AI query error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyClick = (message: string) => {
    navigator.clipboard.writeText(message);
    toast.success("Copied to clipboard!");
  };

  const handleRegenerateResponse = async () => {
    if (messages.length === 0) return;

    // Find the last user query
    const lastUserMessage = messages.slice().reverse().find(msg => msg.sender === 'user');
    if (!lastUserMessage) return;

    setIsLoading(true);
    try {
      // Re-submit the last user query with client context
      const enhancedQuery = `${lastUserMessage.message}\n\nClient Context:\n${clientContext}`;
      const result = await aiService.getResponse(enhancedQuery);

      if (result && result.response) {
        // Replace the last AI response with the new one
        setMessages(prevMessages => {
          const newMessages = prevMessages.slice();
          const lastAiIndex = newMessages.slice().reverse().findIndex(msg => msg.sender === 'ai');
          if (lastAiIndex !== -1) {
            newMessages[newMessages.length - 1 - lastAiIndex] = {
              id: Date.now().toString(),
              sender: 'ai',
              message: result.response,
              timestamp: new Date().toLocaleTimeString(),
            };
            return newMessages;
          } else {
            // If there's no AI message to replace, add a new one
            const aiMessage: ChatMessage = {
              id: Date.now().toString(),
              sender: 'ai',
              message: result.response,
              timestamp: new Date().toLocaleTimeString(),
            };
            return [...newMessages, aiMessage];
          }
        });
        setError(null);
      } else {
        setError('Failed to regenerate a response from the AI.');
      }
    } catch (e) {
      setError('Error regenerating the response.');
      console.error("AI regeneration error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">
          Enhanced AI Assistant
        </CardTitle>
        <CardDescription>
          Get instant answers and insights with AI
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col p-4">
        {isClientContextLoading ? (
          <div className="text-muted-foreground animate-pulse">Loading client context...</div>
        ) : error ? (
          <div className="text-red-500">Error: {error}</div>
        ) : (
          <div className="mb-4 text-sm text-muted-foreground">
            <Badge variant="secondary">Context-Aware</Badge> This AI assistant is enhanced with client-specific context for more relevant and accurate responses.
          </div>
        )}
        <div
          ref={chatContainerRef}
          className="flex-grow overflow-y-auto mb-4"
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-2`}
            >
              <div className="flex flex-col max-w-[75%]">
                <div
                  className={`rounded-lg p-3 text-sm break-words ${message.sender === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground'
                    }`}
                >
                  {message.message}
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-muted-foreground">
                    {message.timestamp}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleCopyClick(message.message)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start mb-2">
              <div className="rounded-lg p-3 text-sm bg-muted text-muted-foreground">
                Thinking...
              </div>
            </div>
          )}
        </div>
        <Separator />
        <form onSubmit={handleQuerySubmit} className="mt-4">
          <div className="flex items-center space-x-2">
            <Textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type your query here..."
              className="flex-grow resize-none"
              rows={1}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              {isLoading ? 'Generating...' : 'Send'}
            </Button>
          </div>
        </form>
        {messages.length > 0 && (
          <div className="mt-4 flex justify-end">
            <Button variant="outline" disabled={isLoading} onClick={handleRegenerateResponse}>
              {isLoading ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              Regenerate Response
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedAIAssistant;
