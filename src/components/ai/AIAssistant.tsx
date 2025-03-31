
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BrainCircuit, Send } from 'lucide-react';
import { toast } from 'sonner';
import { aiService } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import useTasks from '@/hooks/useTasks';

interface AIAssistantProps {
  className?: string;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ className }) => {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { updateTask } = useTasks();

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    setLoading(true);
    try {
      const aiResponse = await aiService.getResponse(message);
      setResponse(aiResponse.content);
      toast.success('AI response generated successfully');
    } catch (error: any) {
      console.error('Error getting AI response:', error);
      toast.error('Failed to generate AI response');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskUpdate = async (taskId: number, taskData: any) => {
    try {
      await updateTask(taskId, taskData);
      toast.success('Task updated successfully');
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center">
          <BrainCircuit className="mr-2 h-4 w-4" />
          AI Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Textarea
            placeholder="Enter your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            className="resize-none"
          />
          <div className="flex justify-end">
            <Button
              onClick={handleSendMessage}
              disabled={loading}
            >
              {loading ? (
                <>
                  Loading...
                </>
              ) : (
                <>
                  Send
                  <Send className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
        {response && (
          <div className="rounded-md border bg-muted p-4">
            <p className="text-sm leading-relaxed">{response}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIAssistant;
