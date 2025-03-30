
from supabase import create_client
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Supabase connection credentials
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY")  # Use the service key for backend operations

def get_supabase_client():
    """Creates and returns a Supabase client for backend operations"""
    if not SUPABASE_URL or not SUPABASE_KEY:
        raise ValueError("Supabase URL and Service Key must be provided. Check your environment variables.")
        
    return create_client(SUPABASE_URL, SUPABASE_KEY)

# Example usage in FastAPI endpoint:
# 
# @app.get("/api/users")
# async def get_users():
#     supabase = get_supabase_client()
#     response = supabase.table("users").select("*").execute()
#     return response.data
