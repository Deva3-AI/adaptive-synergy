
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { marketingService } from '@/services/api';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Plus, Edit, Eye, Copy, AlertTriangle, AlertCircle, BarChart2, SendHorizonal, MoreHorizontal, Trash2 } from 'lucide-react';
import { EmailTemplate } from '@/interfaces/marketing';
import { toast } from 'sonner';

// Helper function to get badge color based on performance
const getPerformanceBadge = (value: number, type: string) => {
  let variant: 'default' | 'outline' | 'secondary' | 'destructive' | 'success' = 'default';
  
  if (type === 'open' || type === 'click' || type === 'reply' || type === 'conversion') {
    if (value >= 40) variant = 'success';
    else if (value >= 20) variant = 'default';
    else variant = 'destructive';
  }
  
  return <Badge variant={variant}>{value}%</Badge>;
};

const EmailTemplates = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [currentTab, setCurrentTab] = useState('templates');
  const [editedTemplate, setEditedTemplate] = useState<EmailTemplate>({
    id: 0,
    name: '',
    subject: '',
    content: '',
    body: '',
    category: '',
    tags: [],
    createdAt: '',
    updatedAt: '',
    variables: [],
    performanceMetrics: {
      openRate: 0,
      clickRate: 0,
      replyRate: 0,
      conversionRate: 0,
      responseRate: 0,
      usageCount: 0
    }
  });
  
  const queryClient = useQueryClient();

  // Fetch email templates
  const { data: templates = [], isLoading } = useQuery({
    queryKey: ['email-templates'],
    queryFn: () => marketingService.getEmailTemplates()
  });

  // Filter templates based on search term
  const filteredTemplates = templates.filter(template => 
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Sort by newest
  const sortedTemplates = [...filteredTemplates].sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  // Group templates by category
  const groupedTemplates = sortedTemplates.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {} as Record<string, EmailTemplate[]>);

  const categories = Object.keys(groupedTemplates).sort();

  // Handle template selection
  const handleSelectTemplate = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setEditedTemplate(template);
  };

  // Handle template edit
  const handleEditTemplate = () => {
    if (!selectedTemplate) return;
    setEditMode(true);
  };

  // Handle save changes
  const handleSaveChanges = () => {
    // In a real app, you would call an API to update the template
    toast.success("Template updated successfully");
    setEditMode(false);
    // Update the selected template with edited values
    setSelectedTemplate(editedTemplate);
    // In a real app, you would invalidate queries here
  };

  // Handle template preview using template variables
  const replaceTemplateVariables = (content: string) => {
    if (!content) return '';
    
    let replacedContent = content;
    const sampleValues = {
      'company': 'Acme Corp',
      'name': 'John Smith',
      'date': new Date().toLocaleDateString(),
      'product': 'Enterprise Plan',
      'link': 'https://example.com/offer'
    };
    
    // Replace {{variable}} with corresponding value
    Object.entries(sampleValues).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      replacedContent = replacedContent.replace(regex, value);
    });
    
    return replacedContent;
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  // Update edited template field
  const updateTemplateField = (field: keyof EmailTemplate, value: any) => {
    setEditedTemplate(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative w-full md:w-[280px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            Import Templates
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Template
          </Button>
        </div>
      </div>
      
      <Tabs value={currentTab} onValueChange={setCurrentTab}>
        <TabsList>
          <TabsTrigger value="templates">Email Templates</TabsTrigger>
          <TabsTrigger value="performance">Performance Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="templates" className="space-y-6">
          {isLoading ? (
            // Loading state
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((_, index) => (
                <Skeleton key={index} className="h-[220px] w-full" />
              ))}
            </div>
          ) : sortedTemplates.length === 0 ? (
            // Empty state
            <div className="text-center py-12 border rounded-lg">
              <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <AlertCircle className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No templates found</h3>
              <p className="text-muted-foreground mt-1">
                {searchTerm ? "Try adjusting your search terms" : "Create your first email template"}
              </p>
              <Button className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Create Template
              </Button>
            </div>
          ) : (
            // Templates grid
            <div className="space-y-6">
              {categories.map(category => (
                <div key={category} className="space-y-3">
                  <h3 className="text-lg font-semibold">{category}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {groupedTemplates[category].map(template => (
                      <Card 
                        key={template.id} 
                        className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => handleSelectTemplate(template)}
                      >
                        <CardHeader className="pb-2">
                          <div className="flex justify-between">
                            <CardTitle className="text-base">{template.name}</CardTitle>
                            <Badge variant="outline">{template.category}</Badge>
                          </div>
                          <CardDescription className="line-clamp-1">
                            {template.subject}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="text-sm text-muted-foreground mt-1 line-clamp-3">
                            {template.content.substring(0, 150)}...
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between pt-0">
                          <div className="text-xs text-muted-foreground">
                            Updated: {formatDate(template.updatedAt)}
                          </div>
                          <div className="flex gap-1">
                            {template.tags.slice(0, 2).map(tag => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {template.tags.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{template.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Template Performance</CardTitle>
              <CardDescription>
                Analyze the performance of your email templates
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-[400px] w-full" />
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Average Open Rate</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {Math.round(
                            templates.reduce((sum, t) => sum + t.performanceMetrics.openRate, 0) / templates.length
                          )}%
                        </div>
                        <Progress value={
                          Math.round(
                            templates.reduce((sum, t) => sum + t.performanceMetrics.openRate, 0) / templates.length
                          )
                        } className="h-2 mt-2" />
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Average Click Rate</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {Math.round(
                            templates.reduce((sum, t) => sum + t.performanceMetrics.clickRate, 0) / templates.length
                          )}%
                        </div>
                        <Progress value={
                          Math.round(
                            templates.reduce((sum, t) => sum + t.performanceMetrics.clickRate, 0) / templates.length
                          )
                        } className="h-2 mt-2" />
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Average Reply Rate</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {Math.round(
                            templates.reduce((sum, t) => sum + (t.performanceMetrics.replyRate || t.performanceMetrics.responseRate || 0), 0) / templates.length
                          )}%
                        </div>
                        <Progress value={
                          Math.round(
                            templates.reduce((sum, t) => sum + (t.performanceMetrics.replyRate || t.performanceMetrics.responseRate || 0), 0) / templates.length
                          )
                        } className="h-2 mt-2" />
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {Math.round(
                            templates.reduce((sum, t) => sum + t.performanceMetrics.conversionRate, 0) / templates.length
                          )}%
                        </div>
                        <Progress value={
                          Math.round(
                            templates.reduce((sum, t) => sum + t.performanceMetrics.conversionRate, 0) / templates.length
                          )
                        } className="h-2 mt-2" />
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Template Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Open Rate</TableHead>
                        <TableHead>Click Rate</TableHead>
                        <TableHead>Reply Rate</TableHead>
                        <TableHead>Conversion</TableHead>
                        <TableHead>Usage</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedTemplates.map(template => (
                        <TableRow key={template.id}>
                          <TableCell className="font-medium">{template.name}</TableCell>
                          <TableCell>{template.category}</TableCell>
                          <TableCell>{getPerformanceBadge(template.performanceMetrics.openRate, 'open')}</TableCell>
                          <TableCell>{getPerformanceBadge(template.performanceMetrics.clickRate, 'click')}</TableCell>
                          <TableCell>{getPerformanceBadge(template.performanceMetrics.replyRate || template.performanceMetrics.responseRate || 0, 'reply')}</TableCell>
                          <TableCell>{getPerformanceBadge(template.performanceMetrics.conversionRate, 'conversion')}</TableCell>
                          <TableCell>{template.performanceMetrics.usageCount || 0}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Template Detail Dialog */}
      {selectedTemplate && (
        <Dialog open={!!selectedTemplate} onOpenChange={(open) => !open && setSelectedTemplate(null)}>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>{editMode ? 'Edit Template' : selectedTemplate.name}</DialogTitle>
              <DialogDescription>
                {editMode ? 'Make changes to this email template' : selectedTemplate.category}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {editMode ? (
                // Edit mode UI
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Template Name</Label>
                      <Input 
                        id="name" 
                        value={editedTemplate.name} 
                        onChange={(e) => updateTemplateField('name', e.target.value)} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select 
                        value={editedTemplate.category}
                        onValueChange={(value) => updateTemplateField('category', value)}
                      >
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Outreach">Outreach</SelectItem>
                          <SelectItem value="Follow-up">Follow-up</SelectItem>
                          <SelectItem value="Newsletters">Newsletters</SelectItem>
                          <SelectItem value="Promotional">Promotional</SelectItem>
                          <SelectItem value="Transactional">Transactional</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input 
                      id="subject" 
                      value={editedTemplate.subject} 
                      onChange={(e) => updateTemplateField('subject', e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="content">Email Body</Label>
                    <Textarea 
                      id="content" 
                      rows={12}
                      value={editedTemplate.content || editedTemplate.body || ''} 
                      onChange={(e) => {
                        updateTemplateField('content', e.target.value);
                        updateTemplateField('body', e.target.value);
                      }} 
                      className="font-mono text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags (comma separated)</Label>
                    <Input 
                      id="tags" 
                      value={editedTemplate.tags.join(', ')} 
                      onChange={(e) => updateTemplateField('tags', e.target.value.split(',').map(tag => tag.trim()))} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Template Variables</Label>
                    <div className="flex flex-wrap gap-2">
                      {(editedTemplate.variables || ['company', 'name', 'date', 'product', 'link']).map((variable) => (
                        <Badge key={variable} variant="outline">
                          {`{{${variable}}}`}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Use these variables in your template content by typing {{variable}}.
                    </p>
                  </div>
                </div>
              ) : (
                // View mode UI
                <div className="space-y-4">
                  <div className="bg-muted p-3 rounded-md">
                    <p className="font-medium">Subject:</p>
                    <p>{selectedTemplate.subject}</p>
                  </div>
                  <div className="bg-muted p-3 rounded-md h-[300px] overflow-y-auto">
                    <p className="font-medium mb-2">Email Body:</p>
                    <div className="whitespace-pre-line">
                      {replaceTemplateVariables(selectedTemplate.content || selectedTemplate.body || '')}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedTemplate.tags.map(tag => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-4 border-t pt-4">
                    <div>
                      <p className="text-sm font-medium">Performance Metrics</p>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Open Rate:</span>
                          <Badge variant={selectedTemplate.performanceMetrics.openRate > 30 ? "success" : "default"}>
                            {selectedTemplate.performanceMetrics.openRate}%
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Click Rate:</span>
                          <Badge variant={selectedTemplate.performanceMetrics.clickRate > 20 ? "success" : "default"}>
                            {selectedTemplate.performanceMetrics.clickRate}%
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Reply Rate:</span>
                          <Badge variant={(selectedTemplate.performanceMetrics.replyRate || selectedTemplate.performanceMetrics.responseRate || 0) > 10 ? "success" : "default"}>
                            {selectedTemplate.performanceMetrics.replyRate || selectedTemplate.performanceMetrics.responseRate || 0}%
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Conversion:</span>
                          <Badge variant={selectedTemplate.performanceMetrics.conversionRate > 5 ? "success" : "default"}>
                            {selectedTemplate.performanceMetrics.conversionRate}%
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Template Info</p>
                      <div className="space-y-2 mt-2 text-sm">
                        <div className="flex justify-between">
                          <span>Created:</span>
                          <span>{formatDate(selectedTemplate.createdAt)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Last updated:</span>
                          <span>{formatDate(selectedTemplate.updatedAt)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Category:</span>
                          <Badge variant="outline">{selectedTemplate.category}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Usage count:</span>
                          <span>{selectedTemplate.performanceMetrics.usageCount || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              {editMode ? (
                <>
                  <Button variant="outline" onClick={() => setEditMode(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveChanges}>
                    Save Changes
                  </Button>
                </>
              ) : (
                <>
                  <div className="flex gap-2 mr-auto">
                    <Button variant="outline" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button variant="outline" onClick={() => setSelectedTemplate(null)}>
                    Close
                  </Button>
                  <Button variant="outline" onClick={handleEditTemplate}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button>
                    <SendHorizonal className="h-4 w-4 mr-2" />
                    Use Template
                  </Button>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default EmailTemplates;
