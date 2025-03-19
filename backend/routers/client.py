
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, date, timedelta
import logging

from database import get_db
import models
import schemas
from routers.auth import get_current_user
from services.ai_service import AIService

router = APIRouter()

@router.get("/", response_model=List[schemas.ClientResponse])
async def get_clients(
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get list of clients"""
    clients = db.query(models.Client).offset(skip).limit(limit).all()
    return clients

@router.post("/", response_model=schemas.ClientResponse)
async def create_client(
    client: schemas.ClientCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new client"""
    db_client = models.Client(**client.dict())
    db.add(db_client)
    db.commit()
    db.refresh(db_client)
    return db_client

@router.get("/{client_id}", response_model=schemas.ClientResponse)
async def get_client(
    client_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific client by ID"""
    db_client = db.query(models.Client).filter(models.Client.client_id == client_id).first()
    if not db_client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Client not found"
        )
    return db_client

@router.put("/{client_id}", response_model=schemas.ClientResponse)
async def update_client(
    client_id: int,
    client: schemas.ClientUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a client"""
    db_client = db.query(models.Client).filter(models.Client.client_id == client_id).first()
    if not db_client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Client not found"
        )
    
    # Update client fields
    for key, value in client.dict(exclude_unset=True).items():
        setattr(db_client, key, value)
    
    db.commit()
    db.refresh(db_client)
    return db_client

@router.get("/{client_id}/tasks", response_model=List[schemas.TaskResponse])
async def get_client_tasks(
    client_id: int,
    status: Optional[schemas.TaskStatusEnum] = None,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get tasks for a specific client"""
    query = db.query(models.Task).filter(models.Task.client_id == client_id)
    
    if status:
        query = query.filter(models.Task.status == status)
    
    tasks = query.order_by(models.Task.created_at.desc()).all()
    return tasks

@router.post("/{client_id}/tasks", response_model=schemas.TaskResponse)
async def create_client_task(
    client_id: int,
    task: schemas.TaskCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new task for a client"""
    # Ensure client exists
    client = db.query(models.Client).filter(models.Client.client_id == client_id).first()
    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Client not found"
        )
    
    # Override client_id in request with path parameter
    task_data = task.dict()
    task_data["client_id"] = client_id
    
    db_task = models.Task(**task_data)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@router.post("/analyze-input", response_model=schemas.ClientInputAnalysisResponse)
async def analyze_client_input(
    request: schemas.ClientInputAnalysisRequest,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Use AI to analyze client input and extract requirements"""
    # Get client history if client_id provided
    client_history = None
    if request.client_id:
        # Get previous tasks and communications for this client
        tasks = db.query(models.Task).filter(models.Task.client_id == request.client_id).all()
        comms = db.query(models.CommunicationLog).filter(models.CommunicationLog.client_id == request.client_id).all()
        
        # Convert to dictionaries for AI service
        task_dicts = [{"title": t.title, "description": t.description, "status": t.status.value} for t in tasks]
        comm_dicts = [{"message": c.message, "channel": c.channel, "created_at": c.created_at.isoformat()} for c in comms]
        
        client_history = {
            "tasks": task_dicts,
            "communications": comm_dicts
        }
    
    result = AIService.analyze_client_input(text=request.text, client_history=client_history)
    
    return result

@router.get("/{client_id}/reports/performance", response_model=dict)
async def get_client_performance_report(
    client_id: int,
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Generate a performance report for a client"""
    # Ensure client exists
    client = db.query(models.Client).filter(models.Client.client_id == client_id).first()
    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Client not found"
        )
    
    # Set default date range if not provided
    if not start_date:
        start_date = datetime.now().date() - timedelta(days=90)
    if not end_date:
        end_date = datetime.now().date()
    
    # Get tasks in date range
    tasks = db.query(models.Task).filter(
        models.Task.client_id == client_id,
        models.Task.created_at >= start_date,
        models.Task.created_at <= end_date
    ).all()
    
    # Calculate metrics
    total_tasks = len(tasks)
    completed_tasks = sum(1 for t in tasks if t.status == models.TaskStatus.completed)
    completion_rate = (completed_tasks / total_tasks) * 100 if total_tasks > 0 else 0
    
    avg_completion_time = 0
    if completed_tasks > 0:
        completion_times = [
            (t.end_time - t.start_time).total_seconds() / 3600 
            for t in tasks 
            if t.status == models.TaskStatus.completed and t.start_time and t.end_time
        ]
        if completion_times:
            avg_completion_time = sum(completion_times) / len(completion_times)
    
    # Get estimated vs actual time efficiency
    efficiency = 0
    efficiency_data = []
    for task in tasks:
        if task.status == models.TaskStatus.completed and task.estimated_time and task.actual_time:
            task_efficiency = task.estimated_time / task.actual_time
            efficiency_data.append(task_efficiency)
    
    if efficiency_data:
        efficiency = (sum(efficiency_data) / len(efficiency_data)) * 100
    
    # Return performance report
    return {
        "client_id": client_id,
        "client_name": client.client_name,
        "period": {
            "start_date": start_date.isoformat(),
            "end_date": end_date.isoformat()
        },
        "metrics": {
            "total_tasks": total_tasks,
            "completed_tasks": completed_tasks,
            "completion_rate": completion_rate,
            "avg_completion_time_hours": avg_completion_time,
            "efficiency_percentage": efficiency
        },
        "task_status_breakdown": {
            "pending": sum(1 for t in tasks if t.status == models.TaskStatus.pending),
            "in_progress": sum(1 for t in tasks if t.status == models.TaskStatus.in_progress),
            "completed": completed_tasks,
            "cancelled": sum(1 for t in tasks if t.status == models.TaskStatus.cancelled)
        }
    }
