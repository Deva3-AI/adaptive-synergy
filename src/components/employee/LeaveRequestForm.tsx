
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

const leaveRequestSchema = z.object({
  leaveType: z.enum(['annual', 'sick', 'personal', 'wfh', 'halfDay', 'other'], {
    required_error: "Please select a leave type",
  }),
  startDate: z.date({
    required_error: "Start date is required",
  }),
  endDate: z.date().optional(),
  reason: z.string().min(5, {
    message: "Reason must be at least 5 characters",
  }).max(500, {
    message: "Reason must not exceed 500 characters",
  }),
  document: z.any().optional(),
});

type LeaveRequestFormValues = z.infer<typeof leaveRequestSchema>;

interface LeaveRequestFormProps {
  onSubmit: (formData: any) => Promise<void>;
  isSubmitting: boolean;
}

const LeaveRequestForm: React.FC<LeaveRequestFormProps> = ({ onSubmit, isSubmitting }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const form = useForm<LeaveRequestFormValues>({
    resolver: zodResolver(leaveRequestSchema),
    defaultValues: {
      leaveType: 'annual',
      reason: '',
    },
  });

  const handleSubmit = async (values: LeaveRequestFormValues) => {
    try {
      const formData = new FormData();
      formData.append('leaveType', values.leaveType);
      formData.append('startDate', values.startDate.toISOString());
      
      if (values.endDate) {
        formData.append('endDate', values.endDate.toISOString());
      }
      
      formData.append('reason', values.reason);
      
      if (selectedFile) {
        formData.append('document', selectedFile);
      }
      
      await onSubmit(formData);
      form.reset();
      setSelectedFile(null);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to submit leave request. Please try again.');
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  const leaveType = form.watch('leaveType');
  const needsDocument = leaveType === 'sick';
  const isMultiDay = !['halfDay', 'wfh'].includes(leaveType);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="leaveType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Leave Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select leave type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="annual">Annual Leave</SelectItem>
                  <SelectItem value="sick">Sick Leave</SelectItem>
                  <SelectItem value="personal">Personal Leave</SelectItem>
                  <SelectItem value="wfh">Work From Home</SelectItem>
                  <SelectItem value="halfDay">Half Day</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className={cn("flex flex-col gap-4", isMultiDay ? "sm:flex-row" : "")}>
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Start Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {isMultiDay && (
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>End Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value || undefined}
                        onSelect={field.onChange}
                        disabled={(date) => {
                          const startDate = form.getValues('startDate');
                          return startDate && date < startDate;
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
        
        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reason</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Please provide details about your leave request" 
                  {...field} 
                  rows={4}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {needsDocument && (
          <FormItem>
            <FormLabel>Medical Document</FormLabel>
            <div className="flex items-center gap-2">
              <Input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png"
                className="flex-1"
              />
              {selectedFile && (
                <div className="text-sm text-muted-foreground">
                  {selectedFile.name}
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Please upload a supporting medical document (PDF, JPG, PNG)
            </p>
          </FormItem>
        )}
        
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Leave Request"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default LeaveRequestForm;
