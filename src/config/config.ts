
// Configuration for API endpoints and Supabase connection
const config = {
  // API base URL - defaults to local FastAPI server but can be overridden by environment
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  
  // Supabase configuration
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || '',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  },
};

export default config;
