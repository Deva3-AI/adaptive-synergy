
import { createClient } from '@supabase/supabase-js';

// Default to environment variables or use the mock values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qjrguxtbivtsxvwlzyqd.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqcmd1eHRiaXZ0c3h2d2x6eXFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMzMTQ2NjUsImV4cCI6MjA1ODg5MDY2NX0.IlEMaOhET5qIr4ZcmaszXM9jj6Td_PHa9skKG4kPtUA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Additional exports for convenience
export const auth = supabase.auth;
export const storage = supabase.storage;
