
-- Enable Row Level Security on all tables
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communication_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_insights ENABLE ROW LEVEL SECURITY;

-- Add Email Templates table for marketing
CREATE TABLE IF NOT EXISTS public.email_templates (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  category VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'draft',
  open_rate FLOAT,
  click_rate FLOAT,
  conversion_rate FLOAT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add priority column to tasks table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'tasks' 
    AND column_name = 'priority'
  ) THEN
    ALTER TABLE public.tasks ADD COLUMN priority VARCHAR(20) DEFAULT 'medium';
  END IF;
END
$$;

-- Add due_date column to tasks table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'tasks' 
    AND column_name = 'due_date'
  ) THEN
    ALTER TABLE public.tasks ADD COLUMN due_date DATE;
  END IF;
END
$$;

-- Create Task Comments table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.task_comments (
  id SERIAL PRIMARY KEY,
  task_id INTEGER REFERENCES public.tasks(task_id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES public.users(user_id),
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create Task Attachments table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.task_attachments (
  id SERIAL PRIMARY KEY,
  task_id INTEGER REFERENCES public.tasks(task_id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(100),
  file_size INTEGER NOT NULL,
  url TEXT NOT NULL,
  uploaded_by VARCHAR(255),
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create Campaigns table for marketing
CREATE TABLE IF NOT EXISTS public.campaigns (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  status VARCHAR(20) NOT NULL DEFAULT 'planned',
  budget DECIMAL(12,2),
  target_audience TEXT,
  expected_reach INTEGER,
  actual_reach INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create Campaign Metrics table for marketing analytics
CREATE TABLE IF NOT EXISTS public.campaign_metrics (
  id SERIAL PRIMARY KEY,
  campaign_id INTEGER REFERENCES public.campaigns(id) ON DELETE CASCADE,
  metric_name VARCHAR(100) NOT NULL,
  metric_value DECIMAL(12,2) NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable realtime for tasks (for real-time updates)
ALTER TABLE public.tasks REPLICA IDENTITY FULL;
ALTER TABLE public.email_templates REPLICA IDENTITY FULL;
ALTER TABLE public.task_comments REPLICA IDENTITY FULL;

-- Add these tables to the supabase_realtime publication
BEGIN;
  CREATE PUBLICATION IF NOT EXISTS supabase_realtime;
  
  ALTER PUBLICATION supabase_realtime ADD TABLE public.tasks;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.email_templates;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.task_comments;
COMMIT;

-- RLS Policies
-- Allow authenticated users to see all data (in a real app, you would restrict this appropriately)
CREATE POLICY "Allow all access for authenticated users on tasks" ON public.tasks
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow all access for authenticated users on email_templates" ON public.email_templates
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow all access for authenticated users on task_comments" ON public.task_comments
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow all access for authenticated users on task_attachments" ON public.task_attachments
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow all access for authenticated users on campaigns" ON public.campaigns
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Sample email templates for testing
INSERT INTO public.email_templates (name, subject, body, category, status, open_rate, click_rate, conversion_rate)
VALUES
  ('Welcome Email', 'Welcome to our platform!', 'Dear {{name}},\n\nWelcome to our platform! We are excited to have you on board.\n\nBest regards,\nThe Team', 'outreach', 'active', 68, 45, 12),
  ('Follow-up After Meeting', 'Great meeting you, {{name}}!', 'Hi {{name}},\n\nThank you for your time today. As discussed, I''m attaching the proposal for your review.\n\nLooking forward to your feedback,\nThe Team', 'followup', 'active', 72, 38, 15),
  ('Monthly Newsletter', 'This Month''s Updates', 'Hello {{name}},\n\nHere are this month''s updates and news.\n\nRegards,\nThe Team', 'nurture', 'active', 55, 28, 8);
