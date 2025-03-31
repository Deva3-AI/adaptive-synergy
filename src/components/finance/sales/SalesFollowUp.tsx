import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { financeService } from "@/services/api";
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Calendar, CheckCircle2, Clock, Mail, MessageSquare, Phone, User, AlertTriangle 
} from "lucide-react";
import { format, addDays } from "date-fns";
import { toast } from "sonner";
import DashboardCard from "@/components/dashboard/DashboardCard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

const SalesFollowUp = () => {
  const [selectedFollowUp, setSelectedFollowUp] = useState<any>(null);
  const [feedback, setFeedback] = useState("");
  
  const queryClient = useQueryClient();

  // Fetch follow-ups data
  const { data: followUps, isLoading: isFollowUpsLoading } = useQuery({
    queryKey: ["sales-followups"],
    queryFn: () => financeService.getSalesFollowUps(),
  });

  // Fetch suggestions data
  const { data: improvementSuggestions, isLoading: isSuggestionsLoading } = useQuery({
    queryKey: ["improvement-suggestions"],
    queryFn: () => financeService.getImprovementSuggestions(),
  });

  // Mutation to complete a follow-up
  const completeFollowUpMutation = useMutation({
    mutationFn: (data: { id: number, feedback: string }) => 
      financeService.completeFollowUp(data.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales-followups"] });
      toast.success("Follow-up marked as completed");
      setSelectedFollowUp(null);
      setFeedback("");
    }
  });

  // Handle follow-up selection
  const handleSelectFollowUp = (followUp: any) => {
    setSelectedFollowUp(followUp);
  };

  // Handle follow-up completion
  const handleCompleteFollowUp = () => {
    if (!selectedFollowUp) return;
    
    completeFollowUpMutation.mutate({
      id: selectedFollowUp.id,
      feedback
    });
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMM d, yyyy");
  };

  // Calculate if a follow-up is overdue
  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  // Calculate urgency based on due date
  const getUrgency = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    
    if (due < today) return "overdue";
    
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 2) return "urgent";
    if (diffDays <= 5) return "soon";
    return "scheduled";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <DashboardCard
          title="Upcoming Follow-ups"
          icon={<Calendar className="h-5 w-5" />}
          badgeText="Action Required"
          badgeVariant="outline"
        >
          {isFollowUpsLoading ? (
            <Skeleton className="h-96 w-full" />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(followUps || []).filter((f: any) => f.status !== "completed").map((followUp: any) => {
                  const urgency = getUrgency(followUp.dueDate);
                  
                  return (
                    <TableRow key={followUp.id}>
                      <TableCell>
                        <div className="font-medium">{followUp.clientName}</div>
                        <div className="text-xs text-muted-foreground">{followUp.contactPerson}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {followUp.type === "call" && <Phone className="h-4 w-4 mr-1" />}
                          {followUp.type === "email" && <Mail className="h-4 w-4 mr-1" />}
                          {followUp.type === "meeting" && <Calendar className="h-4 w-4 mr-1" />}
                          <span className="capitalize">{followUp.type}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{formatDate(followUp.dueDate)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {urgency === "overdue" && (
                          <Badge variant="destructive">Overdue</Badge>
                        )}
                        {urgency === "urgent" && (
                          <Badge variant="warning">Urgent</Badge>
                        )}
                        {urgency === "soon" && (
                          <Badge variant="outline">Soon</Badge>
                        )}
                        {urgency === "scheduled" && (
                          <Badge variant="secondary">Scheduled</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleSelectFollowUp(followUp)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </DashboardCard>
      </div>

      <div>
        {selectedFollowUp ? (
          <Card>
            <CardHeader>
              <CardTitle>Follow-up Details</CardTitle>
              <CardDescription>
                Complete this follow-up after contacting the client
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Client</div>
                <div className="flex items-center font-medium">
                  <User className="h-4 w-4 mr-2" />
                  {selectedFollowUp.clientName}
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Contact Person</div>
                <div className="font-medium">{selectedFollowUp.contactPerson}</div>
              </div>
              
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Contact Details</div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  {selectedFollowUp.phone || "No phone number"}
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  {selectedFollowUp.email || "No email"}
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Follow-up Notes</div>
                <div className="text-sm p-3 bg-muted rounded-md">
                  {selectedFollowUp.notes}
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Feedback</div>
                <Textarea
                  placeholder="Enter feedback from this follow-up..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="resize-none"
                  rows={4}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setSelectedFollowUp(null)}>
                Cancel
              </Button>
              <Button onClick={handleCompleteFollowUp} disabled={!feedback}>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Mark as Completed
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <DashboardCard
            title="Sales Improvement Suggestions"
            icon={<MessageSquare className="h-5 w-5" />}
            badgeText="AI Generated"
            badgeVariant="outline"
          >
            {isSuggestionsLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : (
              <div className="space-y-4">
                {(improvementSuggestions || []).map((suggestion: any) => (
                  <Card key={suggestion.id} className="border rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      {suggestion.priority === "high" ? (
                        <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                      ) : (
                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                      )}
                      <div>
                        <h4 className="font-medium text-sm">{suggestion.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {suggestion.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </DashboardCard>
        )}
      </div>
    </div>
  );
};

export default SalesFollowUp;
