
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search,
  Plus,
  Mail,
  Pencil,
  Trash2,
  Copy,
  FileText,
  BarChart,
  ChevronRight
} from 'lucide-react';
import { format } from 'date-fns';
import { marketingService } from '@/services/api';
import { EmailTemplate } from '@/interfaces/marketing';

const EmailTemplates = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const { data: templates, isLoading, error } = useQuery({
    queryKey: ['marketing', 'email-templates'],
    queryFn: () => marketingService.getEmailTemplates(),
  });
  
  const filteredTemplates = templates ? templates.filter((template: EmailTemplate) => 
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    template.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.category.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];
  
  const getCategoryBadge = (category: string) => {
    const categoryColors: Record<string, string> = {
      'outreach': 'bg-blue-50 text-blue-600',
      'follow_up': 'bg-purple-50 text-purple-600',
      'meeting_request': 'bg-green-50 text-green-600',
      'proposal': 'bg-yellow-50 text-yellow-600',
      'other': 'bg-gray-50 text-gray-600'
    };
    
    return (
      <Badge className={categoryColors[category] || 'bg-gray-50 text-gray-600'} variant="outline">
        {category.replace('_', ' ')}
      </Badge>
    );
  };
  
  return (
    <div className="grid gap-6 md:grid-cols-12">
      <div className="md:col-span-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Email Templates</h3>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Template
          </Button>
        </div>
        
        <div className="relative w-full mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search templates..."
            className="w-full pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">Loading...</TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-red-500">Error loading templates</TableCell>
                </TableRow>
              ) : filteredTemplates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">No templates found</TableCell>
                </TableRow>
              ) : (
                filteredTemplates.map((template: EmailTemplate) => (
                  <TableRow 
                    key={template.id}
                    className={`cursor-pointer ${selectedTemplate?.id === template.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                    onClick={() => setSelectedTemplate(template)}
                  >
                    <TableCell className="font-medium">{template.name}</TableCell>
                    <TableCell>{getCategoryBadge(template.category)}</TableCell>
                    <TableCell>
                      {template.performanceMetrics ? (
                        <div className="text-xs">
                          <div className="flex items-center">
                            <span className="w-16">Open rate:</span>
                            <span className="font-medium">{Math.round(template.performanceMetrics.openRate * 100)}%</span>
                          </div>
                          <div className="flex items-center">
                            <span className="w-16">Response:</span>
                            <span className="font-medium">{Math.round(template.performanceMetrics.responseRate * 100)}%</span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-500">No metrics</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTemplate(template);
                          setIsEditing(true);
                        }}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      <div className="md:col-span-7">
        {!selectedTemplate ? (
          <div className="h-full flex items-center justify-center border rounded-lg bg-gray-50 p-6">
            <div className="text-center">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">Select an Email Template</h3>
              <p className="text-gray-500">Choose a template from the list to view or edit its content</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>
                      {isEditing ? (
                        <Input 
                          value={selectedTemplate.name} 
                          className="font-bold text-xl"
                          onChange={(e) => setSelectedTemplate({...selectedTemplate, name: e.target.value})}
                        />
                      ) : (
                        selectedTemplate.name
                      )}
                    </CardTitle>
                    <CardDescription>
                      {getCategoryBadge(selectedTemplate.category)}
                      <span className="ml-2">Last updated: {format(new Date(selectedTemplate.updatedAt), 'MMM dd, yyyy')}</span>
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    {isEditing ? (
                      <>
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                        <Button>
                          Save Changes
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button variant="outline" onClick={() => setIsEditing(true)}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button variant="outline">
                          <Mail className="h-4 w-4 mr-2" />
                          Use Template
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium block mb-1.5">
                      Subject Line
                    </label>
                    {isEditing ? (
                      <Input 
                        value={selectedTemplate.subject} 
                        onChange={(e) => setSelectedTemplate({...selectedTemplate, subject: e.target.value})}
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-md">
                        {selectedTemplate.subject}
                      </div>
                    )}
                  </div>
                  
                  {isEditing && (
                    <div>
                      <label className="text-sm font-medium block mb-1.5">
                        Category
                      </label>
                      <Select 
                        value={selectedTemplate.category}
                        onValueChange={(value) => setSelectedTemplate({...selectedTemplate, category: value as any})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="outreach">Outreach</SelectItem>
                          <SelectItem value="follow_up">Follow Up</SelectItem>
                          <SelectItem value="meeting_request">Meeting Request</SelectItem>
                          <SelectItem value="proposal">Proposal</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  
                  <div>
                    <label className="text-sm font-medium block mb-1.5">
                      Email Body
                    </label>
                    {isEditing ? (
                      <Textarea 
                        value={selectedTemplate.body} 
                        className="h-48"
                        onChange={(e) => setSelectedTemplate({...selectedTemplate, body: e.target.value})}
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-md whitespace-pre-line">
                        {selectedTemplate.body}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium block mb-1.5">
                      Template Variables
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {selectedTemplate.variables.map((variable, idx) => (
                        <Badge key={idx} variant="secondary" className="capitalize">
                          {'{{'}{variable}{'}}'}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {!isEditing && selectedTemplate.performanceMetrics && (
                    <div>
                      <h4 className="text-sm font-medium mb-2 flex items-center">
                        <BarChart className="h-4 w-4 mr-2 text-blue-500" />
                        Performance Metrics
                      </h4>
                      <div className="grid grid-cols-3 gap-3">
                        <Card>
                          <CardContent className="p-3">
                            <p className="text-xs text-gray-500">Usage Count</p>
                            <p className="text-lg font-semibold">{selectedTemplate.performanceMetrics.usageCount}</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-3">
                            <p className="text-xs text-gray-500">Open Rate</p>
                            <p className="text-lg font-semibold">{Math.round(selectedTemplate.performanceMetrics.openRate * 100)}%</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-3">
                            <p className="text-xs text-gray-500">Response Rate</p>
                            <p className="text-lg font-semibold">{Math.round(selectedTemplate.performanceMetrics.responseRate * 100)}%</p>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailTemplates;
