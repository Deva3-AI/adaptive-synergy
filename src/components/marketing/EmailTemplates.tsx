
import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Pencil, Copy, Trash2, Star, BarChart2 } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';

interface EmailTemplate {
  id: number;
  name: string;
  subject: string;
  body: string;
  category: string;
  created_at: string;
  updated_at: string;
  open_rate?: number;
  click_rate?: number;
  conversion_rate?: number;
  status: 'active' | 'draft' | 'archived';
}

const EmailTemplates: React.FC = () => {
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Fetch email templates from Supabase
  const { data: templates, isLoading, error } = useQuery({
    queryKey: ['emailTemplates'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('email_templates')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        return data as EmailTemplate[];
      } catch (error) {
        console.error('Error fetching email templates:', error);
        return [] as EmailTemplate[];
      }
    }
  });

  // Function to handle template copy
  const handleCopyTemplate = (template: EmailTemplate) => {
    navigator.clipboard.writeText(template.body);
    toast.success('Template copied to clipboard!');
  };

  // Function to handle template deletion (would connect to Supabase in a real implementation)
  const handleDeleteTemplate = async (id: number) => {
    try {
      const { error } = await supabase
        .from('email_templates')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      toast.success('Template deleted successfully');
    } catch (error) {
      console.error('Error deleting template:', error);
      toast.error('Failed to delete template');
    }
  };

  // Mock data for when Supabase is not set up yet
  const mockTemplates: EmailTemplate[] = [
    {
      id: 1,
      name: 'Welcome Email',
      subject: 'Welcome to our platform!',
      body: 'Dear {{name}},\n\nWelcome to our platform! We are excited to have you on board.\n\nBest regards,\nThe Team',
      category: 'outreach',
      created_at: '2023-01-01T00:00:00.000Z',
      updated_at: '2023-01-01T00:00:00.000Z',
      open_rate: 68,
      click_rate: 45,
      conversion_rate: 12,
      status: 'active'
    },
    {
      id: 2,
      name: 'Follow-up After Meeting',
      subject: 'Great meeting you, {{name}}!',
      body: 'Hi {{name}},\n\nThank you for your time today. As discussed, I\'m attaching the proposal for your review.\n\nLooking forward to your feedback,\nThe Team',
      category: 'followup',
      created_at: '2023-01-02T00:00:00.000Z',
      updated_at: '2023-01-02T00:00:00.000Z',
      open_rate: 72,
      click_rate: 38,
      conversion_rate: 15,
      status: 'active'
    },
    {
      id: 3,
      name: 'Monthly Newsletter',
      subject: 'This Month\'s Updates',
      body: 'Hello {{name}},\n\nHere are this month\'s updates and news.\n\nRegards,\nThe Team',
      category: 'nurture',
      created_at: '2023-01-03T00:00:00.000Z',
      updated_at: '2023-01-03T00:00:00.000Z',
      open_rate: 55,
      click_rate: 28,
      conversion_rate: 8,
      status: 'active'
    }
  ];

  // Use mock data if no templates are loaded from Supabase
  const displayTemplates = templates?.length > 0 ? templates : mockTemplates;

  if (error) {
    return (
      <div className="p-4 bg-destructive/10 rounded-md">
        <p className="text-destructive">Error loading email templates: {(error as Error).message}</p>
        <Button variant="outline" className="mt-2" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between mb-4">
        <div className="flex space-x-2">
          <Button
            variant={viewMode === 'table' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setViewMode('table')}
          >
            Table View
          </Button>
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            Grid View
          </Button>
        </div>
        <div className="flex gap-2">
          <span className="text-sm text-muted-foreground self-center">
            {displayTemplates.length} templates
          </span>
        </div>
      </div>

      {isLoading ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-4">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-5/6 mb-1" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-4/5 mb-1" />
                  <Skeleton className="h-4 w-5/6 mb-1" />
                </CardContent>
                <CardFooter className="bg-muted/50 p-3">
                  <Skeleton className="h-8 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[1, 2, 3, 4, 5].map((i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-[180px]" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-[100px]" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-[150px]" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-[80px]" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-[120px] float-right" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayTemplates.map((template) => (
            <Card key={template.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium truncate">{template.name}</h3>
                  <Badge variant={
                    template.category === 'outreach' ? 'default' :
                    template.category === 'followup' ? 'secondary' : 'outline'
                  }>
                    {template.category}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-1 truncate">
                  Subject: {template.subject}
                </p>
                <div className="mt-3 space-y-2">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Open Rate</span>
                      <span className="font-medium">{template.open_rate || 0}%</span>
                    </div>
                    <Progress value={template.open_rate || 0} className="h-1.5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Click Rate</span>
                      <span className="font-medium">{template.click_rate || 0}%</span>
                    </div>
                    <Progress value={template.click_rate || 0} className="h-1.5" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/50 p-3 flex justify-between">
                <Button variant="ghost" size="sm" onClick={() => handleCopyTemplate(template)}>
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </Button>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteTemplate(template.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayTemplates.map((template) => (
                <TableRow key={template.id}>
                  <TableCell>
                    <div className="font-medium">{template.name}</div>
                    <div className="text-sm text-muted-foreground truncate max-w-[300px]">
                      {template.subject}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      template.category === 'outreach' ? 'default' :
                      template.category === 'followup' ? 'secondary' : 'outline'
                    }>
                      {template.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-24">
                        <div className="flex justify-between text-xs">
                          <span>Open</span>
                          <span>{template.open_rate || 0}%</span>
                        </div>
                        <Progress value={template.open_rate || 0} className="h-1.5" />
                      </div>
                      <div className="text-xs text-muted-foreground">|</div>
                      <div className="w-24">
                        <div className="flex justify-between text-xs">
                          <span>Click</span>
                          <span>{template.click_rate || 0}%</span>
                        </div>
                        <Progress value={template.click_rate || 0} className="h-1.5" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      template.status === 'active' ? 'default' :
                      template.status === 'draft' ? 'secondary' : 'outline'
                    }>
                      {template.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleCopyTemplate(template)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteTemplate(template.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <BarChart2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default EmailTemplates;
