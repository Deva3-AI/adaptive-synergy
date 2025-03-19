
# HyperFlow AI API

Backend API for HyperFlow - AI-Powered Workflow & Insights Platform.

## Setup Instructions

1. Create a virtual environment:
   ```
   python -m venv venv
   ```

2. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Create a `.env` file in the backend directory with the following variables:
   ```
   # Database
   DB_USER=root
   DB_PASSWORD=your_password
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=hyperflow

   # JWT
   SECRET_KEY=your_secret_key

   # OpenAI
   OPENAI_API_KEY=your_openai_api_key
   ```

5. Initialize the database:
   ```
   python -c "from database import init_db; init_db()"
   ```

6. Run the application:
   ```
   uvicorn main:app --reload
   ```

7. Access the API documentation at http://localhost:8000/docs

## API Endpoints

The API is organized into the following modules:

- **Authentication**: User registration, login, and token management
- **Employee**: Work tracking, task management, and performance analysis
- **Client**: Client management, requirements analysis, and task generation
- **Marketing**: Meeting analysis, campaign insights, and market trend analysis
- **HR**: Employee management, attendance tracking, and recruitment tools
- **Finance**: Invoice management, financial reporting, and cost analysis

Refer to the interactive API documentation for detailed endpoint specifications.

## AI Features

The backend includes several AI-powered features:

- Client input analysis to extract requirements and suggest tasks
- Task timeline prediction based on historical data
- Meeting transcript analysis for action items and insights
- Marketing campaign analysis for optimization suggestions
- Financial data analysis for business insights
- Employee performance analysis
- Resume screening for recruitment

These features leverage OpenAI and other AI techniques to provide intelligent insights.
