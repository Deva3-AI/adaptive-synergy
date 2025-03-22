
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import os
import json
import logging

# Import routers
from routers import auth, employee, client, marketing, hr, finance, ai

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="HyperFlow AI API",
    description="Backend API for HyperFlow - AI-Powered Workflow & Insights Platform",
    version="1.0.0"
)

# Set up CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production, replace with your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(employee.router, prefix="/api/employee", tags=["Employee"])
app.include_router(client.router, prefix="/api/client", tags=["Client"])
app.include_router(marketing.router, prefix="/api/marketing", tags=["Marketing"])
app.include_router(hr.router, prefix="/api/hr", tags=["HR"])
app.include_router(finance.router, prefix="/api/finance", tags=["Finance"])
app.include_router(ai.router, prefix="/api/ai", tags=["AI"])

@app.get("/")
async def root():
    return {"message": "Welcome to HyperFlow AI API"}

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0"
    }

# Add a new endpoint for platform integrations
@app.get("/api/integrations/{platform}/messages")
async def get_platform_messages(platform: str, client_id: Optional[int] = None):
    """
    Mock endpoint to simulate fetching messages from platforms
    """
    # In a real implementation, this would connect to the platform's API
    # For now, return mock data
    now = datetime.now()
    
    mock_data = [
        {
            "id": "msg1",
            "platform": platform,
            "sender": "Client User 1",
            "content": "We need to update our website with the new product information.",
            "timestamp": (now - timedelta(days=2)).isoformat(),
            "clientId": client_id
        },
        {
            "id": "msg2",
            "platform": platform,
            "sender": "Client User 2",
            "content": "Can we schedule a meeting to discuss the marketing campaign?",
            "timestamp": (now - timedelta(days=1, hours=4)).isoformat(),
            "clientId": client_id
        },
        {
            "id": "msg3",
            "platform": platform,
            "sender": "Client User 1",
            "content": "Please make sure the mobile version works well on all devices.",
            "timestamp": (now - timedelta(hours=12)).isoformat(),
            "clientId": client_id
        }
    ]
    
    return mock_data

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
