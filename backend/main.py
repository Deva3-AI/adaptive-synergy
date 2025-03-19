
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import os
import json
import logging

# Import routers
from routers import auth, employee, client, marketing, hr, finance

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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
