
# HyperFlow Backend Documentation

## Overview

HyperFlow's backend system is built with FastAPI, a modern, high-performance web framework for building APIs with Python. The system integrates with a MySQL database for data persistence and includes comprehensive authentication, user management, and various business logic modules.

## Architecture

The backend follows a modular architecture with the following components:

- **API Layer**: FastAPI routes and endpoints
- **Service Layer**: Business logic and data processing
- **Data Layer**: Database models and data access
- **Authentication**: JWT-based security with role-based access control
- **Integration Points**: External systems and platform connectors

## Database Schema

The database schema is normalized and optimized for performance, with tables capturing all interactions including:

- Users and roles
- Tasks and assignments
- Clients and projects
- Employee records
- Financial transactions
- Communication logs
- AI-generated insights

### Core Tables

#### Users and Authentication

- **roles**: Defines user roles (admin, employee, client, etc.)
- **users**: Stores user details with password hashes and role references

#### Business Entities

- **clients**: Client information and contacts
- **tasks**: Work assignments with status tracking
- **employee_attendance**: Daily login/logout tracking
- **invoices**: Client billing records
- **financial_records**: Income and expense tracking

#### AI and Analytics

- **ai_insights**: AI-generated insights related to tasks
- **ai_models**: Configuration for various AI models

## API Endpoints

### Authentication Module

- `POST /api/auth/register`: Register a new user
- `POST /api/auth/token`: Get access token (login)
- `GET /api/auth/me`: Get current user profile
- `POST /api/auth/refresh`: Refresh JWT token
- `POST /api/auth/forgot-password`: Initiate password recovery
- `POST /api/auth/reset-password`: Complete password reset

### Employee Module

- `GET /api/employee/tasks`: Get tasks assigned to the employee
- `GET /api/employee/tasks/{task_id}`: Get a specific task
- `PUT /api/employee/tasks/{task_id}/status`: Update task status
- `POST /api/employee/attendance/login`: Start work tracking
- `POST /api/employee/attendance/logout`: End work tracking
- `GET /api/employee/attendance/today`: Get today's attendance
- `GET /api/employee/attendance/history`: Get attendance history

### Client Module

- `GET /api/client/clients`: Get list of clients
- `GET /api/client/clients/{client_id}`: Get client details
- `POST /api/client/clients`: Create a new client
- `PUT /api/client/clients/{client_id}`: Update client details
- `GET /api/client/clients/{client_id}/tasks`: Get tasks for a client
- `POST /api/client/tasks`: Create a new task

### HR Module

- `GET /api/hr/attendance`: Get attendance for all employees
- `GET /api/hr/attendance/{user_id}`: Get attendance for a specific employee
- `GET /api/hr/payroll`: Get payroll information
- `POST /api/hr/recruitment`: Create a new job posting
- `GET /api/hr/recruitment`: Get all job postings
- `POST /api/hr/leave-requests`: Submit leave request
- `GET /api/hr/leave-requests`: Get leave requests
- `PUT /api/hr/leave-requests/{request_id}`: Update leave request status

### Finance Module

- `GET /api/finance/invoices`: Get all invoices
- `POST /api/finance/invoices`: Create a new invoice
- `GET /api/finance/invoices/{invoice_id}`: Get invoice details
- `PUT /api/finance/invoices/{invoice_id}/status`: Update invoice status
- `GET /api/finance/reports/revenue`: Get revenue reports
- `GET /api/finance/reports/expenses`: Get expense reports
- `GET /api/finance/analysis/cost`: Get team cost analysis

### Marketing Module

- `GET /api/marketing/campaigns`: Get all marketing campaigns
- `POST /api/marketing/campaigns`: Create a new campaign
- `GET /api/marketing/meetings`: Get scheduled meetings
- `POST /api/marketing/meetings`: Schedule a new meeting
- `GET /api/marketing/analytics`: Get marketing analytics
- `GET /api/marketing/templates`: Get email templates
- `POST /api/marketing/templates`: Create email template

### AI Module

- `POST /api/ai/analyze-task`: Analyze task requirements
- `POST /api/ai/analyze-client-input`: Process client communications
- `POST /api/ai/analyze-meeting`: Process meeting transcripts
- `POST /api/ai/generate-insights`: Generate business insights
- `POST /api/ai/assistant`: AI assistant for contextual responses

## Platform Integrations

The backend provides integration endpoints for various communication platforms:

- `GET /api/integrations/{platform}/messages`: Fetch messages from platforms
- `GET /api/integrations/available`: List available platform integrations

Supported platforms include:
- Slack
- Discord
- Asana
- Trello
- Gmail
- Zoho Mail
- WhatsApp

## Authentication and Security

### JWT-based Authentication

The system uses JWT (JSON Web Tokens) for authentication with:
- Token-based authorization
- Refresh token functionality
- Role-based access control

### Security Features

- Passwords are hashed using bcrypt
- Input validation for all endpoints
- Rate limiting for sensitive operations
- CORS protection and headers security

## Environment Configuration

The backend uses environment variables for configuration:

### Database Configuration
- `DB_USER`: Database username
- `DB_PASSWORD`: Database password
- `DB_HOST`: Database host
- `DB_PORT`: Database port
- `DB_NAME`: Database name

### JWT Configuration
- `SECRET_KEY`: Secret key for JWT signing
- `ALGORITHM`: JWT algorithm (default: HS256)
- `ACCESS_TOKEN_EXPIRE_MINUTES`: Token expiration time

### Server Configuration
- `DEBUG`: Debug mode toggle
- `CORS_ORIGINS`: Allowed origins for CORS

## Supabase Integration

In addition to the FastAPI backend, the system leverages Supabase for:

- User authentication with row-level security
- Realtime subscriptions for task updates
- File storage for task attachments
- Database triggers for automated workflows

## Development and Deployment

### Local Development

1. Create a virtual environment
2. Install dependencies with `pip install -r requirements.txt`
3. Configure environment variables
4. Initialize the database with `python init_db.py`
5. Run the development server with `python main.py`

### Production Deployment

For production deployment:
1. Set up a production database
2. Configure environment variables for production
3. Use a WSGI server like Gunicorn or Uvicorn
4. Set up reverse proxy with Nginx
5. Implement proper logging and monitoring

## Error Handling

The API implements standardized error responses with:
- HTTP status codes
- Descriptive error messages
- Error codes for client-side handling

## Logging and Monitoring

The system includes comprehensive logging:
- Request/response logging
- Error logging with stack traces
- Performance metrics
- Health check endpoint at `/api/health`
