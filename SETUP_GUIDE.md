
# Hyper-Integrated AI Workflow & Insights Platform - Setup Guide

This guide will walk you through setting up the application locally for development.

## Prerequisites

1. Node.js (v16 or newer)
2. npm or yarn
3. A Supabase account (free tier is sufficient for development)
4. Git

## Step 1: Clone the Repository

```bash
git clone <repository-url>
cd <project-directory>
```

## Step 2: Install Dependencies

```bash
npm install
# or
yarn install
```

## Step 3: Set Up Supabase

1. Create a new Supabase project at [https://supabase.com](https://supabase.com)
2. Once your project is created, go to Project Settings > API to find your project URL and anon key
3. Copy `.env.example` to `.env` in the project root directory:
   ```bash
   cp .env.example .env
   ```
4. Fill in your Supabase URL and anon key in the `.env` file:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

## Step 4: Set Up the Database

1. In the Supabase dashboard, go to the SQL Editor
2. Copy the contents of `supabase/migrations/20240401000000_setup_tables.sql`
3. Paste and run this SQL in the SQL Editor to set up the required tables

## Step 5: Set Up Authentication (Optional, but recommended)

1. In the Supabase dashboard, go to Authentication > Settings
2. Under "Email Auth", make sure "Enable Email Signup" is turned on
3. For local development, you may want to disable "Confirm Email" so you can create accounts without email verification

## Step 6: Start the Development Server

```bash
npm run dev
# or
yarn dev
```

Your application should now be running at [http://localhost:8080](http://localhost:8080)

## Step 7: Set Up the Backend (Optional)

If you want to use the AI functionality:

1. Install Python 3.8+ and FastAPI
2. Set up the backend by following the instructions in the backend directory
3. Update `VITE_API_URL` in your `.env` file to point to your backend API

## Common Issues and Troubleshooting

### Authentication Issues

If you encounter authentication issues:
1. Check that your Supabase URL and anon key are correct in the `.env` file
2. Make sure you've set up the Site URL in Supabase Authentication Settings to match your local development URL (http://localhost:8080)

### Database Connection Issues

If you have issues connecting to the database:
1. Check your Supabase credentials
2. Make sure Row Level Security (RLS) policies are correctly set up
3. Verify that the necessary tables were created successfully

### React Query and Data Fetching Issues

If data is not loading or updates are not reflected:
1. Check the console for any errors
2. Verify that your query keys are correct and consistent
3. Make sure you're using the proper invalidation strategies for mutations

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Vite Documentation](https://vitejs.dev/guide/)
- [Shadcn/UI Documentation](https://ui.shadcn.com)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
