
const config = {
  apiUrl: import.meta.env.VITE_API_URL || '/api',
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || '',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  },
  // Flag to control whether to use real APIs or mock data
  useRealApi: import.meta.env.VITE_USE_REAL_API === 'true',
  // App settings
  appName: 'Hyper-Integrated AI Workflow',
  defaultPageSize: 10,
  dateFormat: 'PP', // Format for date-fns
  timeFormat: 'p', // Format for date-fns
  dateTimeFormat: 'PPp', // Format for date-fns
};

export default config;
