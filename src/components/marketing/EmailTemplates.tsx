
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Search,
  Plus,
  Edit,
  Trash2,
  Copy,
  Pencil,
  Mail,
  Save,
  X,
  Tag,
  Clock,
  BarChart,
  Variable
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import { marketingService } from '@/services/api';

const EmailTemplates = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingTemplate, setEditingTemplate] = useState<any>(null);
  
  const queryClient = useQueryClient();
  
  const { data: templates, isLoading, error } = useQuery({
    queryKey: ['email-templates'],
    queryFn: () => marketingService.getEmailTemplates(),
  });
  
  const saveTemplateMutation = useMutation({
    mutationFn: (templateData: any) => {
      // In a real app, call an API endpoint to save the template
      // For now, we'll just simulate a successful save
      console.log('Saving template:', templateData);
      return Promise.resolve(templateData);
    },
    onSuccess: () => {
      toast.success('Template saved successfully');
      setEditingTemplate(null);
      queryClient.invalidateQueries({ queryKey: ['email-templates'] });
    },
    onError: (error) => {
      toast.error('Failed to save template');
      console.error(error);
    }
  });
  
  const deleteTemplateMutation = useMutation({
    mutationFn: (templateId: number) => {
      // In a real app, call an API endpoint to delete the template
      // For now, we'll just simulate a successful deletion
      console.log('Deleting template:', templateId);
      return Promise.resolve();
    },
    onSuccess: () => {
      toast.success('Template deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['email-templates'] });
    },
    onError: (error) => {
      toast.error('Failed to delete template');
      console.error(error);
    }
  });
  
  const duplicateTemplateMutation = useMutation({
    mutationFn: (template: any) => {
      // In a real app, call an API endpoint to duplicate the template
      // For now, we'll just simulate a successful duplication
      const duplicatedTemplate = {
        ...template,
        id: Date.now(), // Generate a new ID
        name: `${template.name} (Copy)`,
        usage_count: 0
      };
      console.log('Duplicating template:', duplicatedTemplate);
      return Promise.resolve(duplicatedTemplate);
    },
    onSuccess: () => {
      toast.success('Template duplicated successfully');
      queryClient.invalidateQueries({ queryKey: ['email-templates'] });
    },
    onError: (error) => {
      toast.error('Failed to duplicate template');
      console.error(error);
    }
  });
  
  const handleSaveTemplate = () => {
    saveTemplateMutation.mutate(editingTemplate);
  };
  
  const handleDeleteTemplate = (templateId: number) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      deleteTemplateMutation.mutate(templateId);
    }
  };
  
  const handleDuplicateTemplate = (template: any) => {
    duplicateTemplateMutation.mutate(template);
  };
  
  const filteredTemplates = templates ? templates.filter((template: any) => 
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    template.subject.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];
  
  const renderTemplateEditor = () => {
    if (!editingTemplate) return null;
    
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Edit Template</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setEditingTemplate(null)}
            aria-label="Close editor"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-3">
          <div>
            <label htmlFor="template-name" className="block text-sm font-medium mb-1">Template Name</label>
            <Input 
              id="template-name" 
              value={editingTemplate.name} 
              onChange={(e) => setEditingTemplate({...editingTemplate, name: e.target.value})}
            />
          </div>
          
          <div>
            <label htmlFor="template-subject" className="block text-sm font-medium mb-1">Subject Line</label>
            <Input 
              id="template-subject" 
              value={editingTemplate.subject} 
              onChange={(e) => setEditingTemplate({...editingTemplate, subject: e.target.value})}
            />
          </div>
          
          <div>
            <label htmlFor="template-body" className="block text-sm font-medium mb-1">Email Body</label>
            <Textarea 
              id="template-body" 
              rows={12}
              value={editingTemplate.body} 
              onChange={(e) => setEditingTemplate({...editingTemplate, body: e.target.value})}
              className="font-mono text-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Variables</label>
            <div className="flex flex-wrap gap-2">
              {editingTemplate.variables.map((variableName: string, index: number) => (
                <Badge key={index} variant="outline" className="flex items-center gap-1">
                  <Variable className="h-3 w-3" />
                  {variableName}
                </Badge>
              ))}
              <Button variant="outline" size="sm" className="h-6">
                <Plus className="h-3 w-3 mr-1" />
                Add
              </Button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Tags</label>
            <div className="flex flex-wrap gap-2">
              {editingTemplate.tags.map((tag: string, index: number) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  {tag}
                </Badge>
              ))}
              <Button variant="outline" size="sm" className="h-6">
                <Plus className="h-3 w-3 mr-1" />
                Add
              </Button>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2 pt-2">
          <Button variant="outline" onClick={() => setEditingTemplate(null)}>Cancel</Button>
          <Button onClick={handleSaveTemplate} disabled={saveTemplateMutation.isPending}>
            {saveTemplateMutation.isPending ? 'Saving...' : 'Save Template'}
          </Button>
        </div>
      </div>
    );
  };
  
  const renderTemplateStats = (template: any) => {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">{template.name} - Performance</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Usage Count</div>
            <div className="text-2xl font-bold">{template.usage_count}</div>
            <div className="text-xs text-muted-foreground flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              Last used 5 days ago
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Conversion Rate</div>
            <div className="text-2xl font-bold">{template.conversion_rate}%</div>
            <Progress value={template.conversion_rate} className="h-2" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Engagement Metrics</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Open Rate</div>
              <div className="text-lg font-semibold">35.6%</div>
              <Progress value={35.6} className="h-2" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Click Rate</div>
              <div className="text-lg font-semibold">12.8%</div>
              <Progress value={12.8} className="h-2" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Reply Rate</div>
              <div className="text-lg font-semibold">8.3%</div>
              <Progress value={8.3} className="h-2" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Bounce Rate</div>
              <div className="text-lg font-semibold">2.1%</div>
              <Progress value={2.1} className="h-2" />
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Performance by Recipient</h4>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Recipient Type</TableHead>
                  <TableHead>Open Rate</TableHead>
                  <TableHead>Click Rate</TableHead>
                  <TableHead>Conversion</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>C-Level</TableCell>
                  <TableCell>32.5%</TableCell>
                  <TableCell>10.2%</TableCell>
                  <TableCell>8.5%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Director</TableCell>
                  <TableCell>38.2%</TableCell>
                  <TableCell>15.6%</TableCell>
                  <TableCell>12.3%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Manager</TableCell>
                  <TableCell>42.1%</TableCell>
                  <TableCell>18.7%</TableCell>
                  <TableCell>14.2%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
        
        <div className="space-y-2">
          <h4 className="text-sm font-medium">AI Improvement Suggestions</h4>
          <div className="space-y-2">
            <div className="text-sm bg-muted p-3 rounded-md">
              <span className="font-medium">Subject line:</span> Try adding a personalization variable or creating urgency to increase open rates.
            </div>
            <div className="text-sm bg-muted p-3 rounded-md">
              <span className="font-medium">Email length:</span> Consider shortening the email by 20% to improve readability and response rates.
            </div>
            <div className="text-sm bg-muted p-3 rounded-md">
              <span className="font-medium">Call-to-action:</span> Make the primary CTA more prominent and action-oriented.
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  const renderTemplatePreview = (template: any) => {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">{template.name} - Preview</h3>
        </div>
        
        <div className="border rounded-md p-4 space-y-4">
          <div className="border-b pb-2">
            <div className="text-sm text-muted-foreground">From: Your Company <yourname@company.com></div>
            <div className="text-sm text-muted-foreground">To: [recipient_email]</div>
            <div className="text-sm font-medium">Subject: {template.subject}</div>
          </div>
          
          <div className="whitespace-pre-line text-sm">
            {template.body}
          </div>
        </div>
        
        <div className="border rounded-md p-4">
          <h4 className="text-sm font-medium mb-2">Template Variables</h4>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            {template.variables.map((variable: string, index: number) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-muted-foreground">[{variable}]</span>
                <span>Example value</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="text-xl font-bold">Email Templates</div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Template
        </Button>
      </div>
      
      <div className="border rounded-md p-4 bg-muted/50">
        <div className="text-sm">
          Templates help you standardize your outreach and follow-up communications. Use variables like [first_name] to personalize your emails.
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search templates..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Button variant="outline" size="sm">
          <Tag className="h-4 w-4 mr-2" />
          Filter by Tag
        </Button>
      </div>
      
      {editingTemplate ? (
        renderTemplateEditor()
      ) : (
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Template Name</TableHead>
                <TableHead>Subject Line</TableHead>
                <TableHead className="hidden md:table-cell">Usage</TableHead>
                <TableHead className="hidden md:table-cell">Conversion</TableHead>
                <TableHead className="hidden lg:table-cell">Last Modified</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Loading templates...
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-red-500">
                    Error loading templates
                  </TableCell>
                </TableRow>
              ) : filteredTemplates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No templates found
                  </TableCell>
                </TableRow>
              ) : (
                filteredTemplates.map((template: any) => (
                  <TableRow key={template.id}>
                    <TableCell className="font-medium">{template.name}</TableCell>
                    <TableCell className="max-w-md truncate">{template.subject}</TableCell>
                    <TableCell className="hidden md:table-cell">{template.usage_count}</TableCell>
                    <TableCell className="hidden md:table-cell">{template.conversion_rate}%</TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {new Date(template.last_modified).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-1">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Mail className="h-4 w-4" />
                              <span className="sr-only">Preview</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            {renderTemplatePreview(template)}
                          </DialogContent>
                        </Dialog>
                        
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <BarChart className="h-4 w-4" />
                              <span className="sr-only">Stats</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl">
                            {renderTemplateStats(template)}
                          </DialogContent>
                        </Dialog>
                        
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => setEditingTemplate(template)}
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => handleDuplicateTemplate(template)}
                        >
                          <Copy className="h-4 w-4" />
                          <span className="sr-only">Duplicate</span>
                        </Button>
                        
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-red-500"
                          onClick={() => handleDeleteTemplate(template.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default EmailTemplates;
