
# Hyper-Integrated AI Workflow & Insights Platform

A state-of-the-art full-stack application that integrates all your software tools with advanced AI to enhance operational efficiency, drive growth, and support 10X growth in the next 12 months.

## Overview

This platform automates workflows for internal teams and external clients by unifying communication, task management, and performance tracking across all departments. Every aspect—from employee attendance to client project tracking and financial reporting—is intelligently automated and continuously optimized using real-time data and adaptive AI models.

## Features

- **Authentication & User Management**: Secure login/signup with role-based access control
- **Employee Dashboard**: Task tracking, work session logging, client requirements integration
- **Client Dashboard**: Centralized task management, real-time progress tracking
- **Marketing Team Dashboard**: Campaign management, meeting preparation, trend monitoring
- **HR Team Dashboard**: Attendance tracking, recruitment automation, payroll management
- **Finance Team Dashboard**: Invoice management, financial health monitoring
- **Unified Communication**: Integration with various communication channels
- **AI-Powered Features**: Task generation, insights, analytics, and optimization

## Technology Stack

- **Frontend**: React with Vite, TailwindCSS, Shadcn/UI
- **Backend**: Supabase for data storage and authentication
- **Database**: PostgreSQL via Supabase
- **State Management**: TanStack React Query
- **Authentication**: Supabase Auth
- **Realtime Updates**: Supabase Realtime
- **UI Components**: Shadcn/UI, Tailwind CSS

## Getting Started

See the [Setup Guide](SETUP_GUIDE.md) for detailed instructions on setting up the project locally.

### Quick Start

1. Clone the repository
2. Install dependencies with `npm install`
3. Copy `.env.example` to `.env` and add your Supabase credentials
4. Run the database setup SQL in Supabase
5. Start the development server with `npm run dev`

## Project Structure

```
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── ui/             # Base UI components (from shadcn/ui)
│   │   ├── marketing/      # Marketing-specific components
│   │   ├── client/         # Client-specific components
│   │   └── ...
│   ├── hooks/              # Custom React hooks
│   ├── interfaces/         # TypeScript interfaces
│   ├── pages/              # Page components
│   ├── services/           # API services
│   │   └── api/            # API clients
│   ├── integrations/       # External integrations (Supabase, etc.)
│   ├── utils/              # Utility functions
│   ├── App.tsx             # Main App component
│   └── main.tsx            # Application entry point
├── backend/                # Optional FastAPI backend for AI functionality
├── supabase/               # Supabase configuration and migrations
├── .env.example            # Example environment variables
├── vite.config.ts          # Vite configuration
└── package.json            # Project dependencies and scripts
```

## Database Schema

The application uses the following key tables:

- `users`: User accounts and authentication
- `roles`: User role definitions
- `clients`: Client information
- `tasks`: Task management across the system
- `employee_attendance`: Employee time tracking
- `email_templates`: Marketing email templates
- `campaigns`: Marketing campaign management
- `task_comments`: Task communication
- `task_attachments`: Files attached to tasks
- `invoices`: Financial invoice tracking
- `financial_records`: Financial transaction records

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Supabase](https://supabase.com/) for the backend infrastructure
- [Shadcn/UI](https://ui.shadcn.com/) for the component library
- [TailwindCSS](https://tailwindcss.com/) for styling
- [TanStack Query](https://tanstack.com/query) for data fetching
- [Vite](https://vitejs.dev/) for the build tooling
