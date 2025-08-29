-- Drop the existing contact_messages table
DROP TABLE IF EXISTS public.contact_messages;

-- Create contact_submissions table
CREATE TABLE public.contact_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create report_submissions table
CREATE TABLE public.report_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on both tables
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_submissions ENABLE ROW LEVEL SECURITY;

-- Create policies for contact_submissions
CREATE POLICY "Anyone can submit contact submissions" 
ON public.contact_submissions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Authenticated users can view contact submissions" 
ON public.contact_submissions 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- Create policies for report_submissions
CREATE POLICY "Anyone can submit report submissions" 
ON public.report_submissions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Authenticated users can view report submissions" 
ON public.report_submissions 
FOR SELECT 
USING (auth.role() = 'authenticated');