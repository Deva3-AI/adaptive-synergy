
# HyperFlow Backend

## Setup Instructions

### 1. Create a virtual environment
```bash
python -m venv venv
```

### 2. Activate the virtual environment
- On Windows:
```bash
venv\Scripts\activate
```
- On macOS/Linux:
```bash
source venv/bin/activate
```

### 3. Install dependencies
```bash
pip install -r requirements.txt
```

### 4. Set up MySQL database
- Install MySQL if not already installed
- Create the database and tables by running the SQL script:
```bash
mysql -u root -p < setup_db.sql
```
- Or open MySQL Workbench/CLI and run the contents of setup_db.sql

### 5. Configure environment variables
- Create a .env file in the backend directory with the following variables:
```
DB_USER=root
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=3306
DB_NAME=hyperflow

SECRET_KEY=your-secret-key-should-be-at-least-32-characters-long
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

DEBUG=True
CORS_ORIGINS=http://localhost:5173,http://localhost:8080
```

### 6. Initialize the database
```bash
python init_db.py
```

### 7. Run the FastAPI development server
```bash
python main.py
```

The API will be available at http://localhost:8000

## API Documentation

- OpenAPI documentation is available at http://localhost:8000/docs
- ReDoc documentation is available at http://localhost:8000/redoc

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/token - Get access token (login)
- GET /api/auth/me - Get current user profile

### Employee
- GET /api/employee/tasks - Get tasks assigned to the employee
- GET /api/employee/tasks/{task_id} - Get a specific task
- PUT /api/employee/tasks/{task_id}/status - Update task status
- POST /api/employee/attendance/login - Start work tracking
- POST /api/employee/attendance/logout - End work tracking
- GET /api/employee/attendance/today - Get today's attendance
- GET /api/employee/attendance/history - Get attendance history

### Client
- GET /api/client/clients - Get list of clients
- GET /api/client/clients/{client_id} - Get client details
- POST /api/client/clients - Create a new client
- PUT /api/client/clients/{client_id} - Update client details
- GET /api/client/clients/{client_id}/tasks - Get tasks for a client
- POST /api/client/tasks - Create a new task

### HR
- GET /api/hr/attendance - Get attendance for all employees
- GET /api/hr/attendance/{user_id} - Get attendance for a specific employee
- GET /api/hr/payroll - Get payroll information
- POST /api/hr/recruitment - Create a new job posting
- GET /api/hr/recruitment - Get all job postings

### Finance
- GET /api/finance/invoices - Get all invoices
- POST /api/finance/invoices - Create a new invoice
- GET /api/finance/invoices/{invoice_id} - Get invoice details
- PUT /api/finance/invoices/{invoice_id}/status - Update invoice status
- GET /api/finance/reports/revenue - Get revenue reports
- GET /api/finance/reports/expenses - Get expense reports

### Marketing
- GET /api/marketing/campaigns - Get all marketing campaigns
- POST /api/marketing/campaigns - Create a new campaign
- GET /api/marketing/meetings - Get scheduled meetings
- POST /api/marketing/meetings - Schedule a new meeting
- GET /api/marketing/analytics - Get marketing analytics
