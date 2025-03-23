
from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, date
import os
import uuid
from pydantic import HttpUrl

from database import get_db
import models
import schemas
from routers.auth import get_current_user
from services.ai_service import AIService

router = APIRouter()

@router.post("/attendance/login", response_model=schemas.AttendanceResponse)
async def log_attendance_login(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Log employee login time for attendance tracking"""
    # ... keep existing code (log_attendance_login)

@router.post("/attendance/logout", response_model=schemas.AttendanceResponse)
async def log_attendance_logout(
    attendance_data: schemas.AttendanceLogout,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Log employee logout time for attendance tracking"""
    # ... keep existing code (log_attendance_logout)

@router.get("/attendance/today", response_model=Optional[schemas.AttendanceResponse])
async def get_today_attendance(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get today's attendance record for the current user"""
    # ... keep existing code (get_today_attendance)

@router.get("/attendance/history", response_model=List[schemas.AttendanceResponse])
async def get_attendance_history(
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get attendance history for the current user within a date range"""
    # ... keep existing code (get_attendance_history)

@router.get("/tasks", response_model=List[schemas.TaskResponse])
async def get_user_tasks(
    status: Optional[schemas.TaskStatusEnum] = None,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get tasks assigned to the current user"""
    # ... keep existing code (get_user_tasks)

@router.get("/tasks/{task_id}", response_model=schemas.TaskResponse)
async def get_task_details(
    task_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get details of a specific task"""
    # ... keep existing code (get_task_details)

@router.put("/tasks/{task_id}/status", response_model=schemas.TaskResponse)
async def update_task_status(
    task_id: int,
    task_update: schemas.TaskUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update the status of a task"""
    # ... keep existing code (update_task_status)

# New endpoints for task uploads and progress tracking

@router.post("/tasks/{task_id}/attachments", response_model=schemas.TaskAttachmentResponse)
async def upload_task_attachment(
    task_id: int,
    file: UploadFile = File(...),
    description: Optional[str] = Form(None),
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Upload a file attachment for a task"""
    # Verify task exists and belongs to the user
    task = db.query(models.Task).filter(
        models.Task.task_id == task_id,
        models.Task.assigned_to == current_user.user_id
    ).first()
    
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    # Create upload directory if it doesn't exist
    upload_dir = os.path.join("uploads", "tasks", str(task_id))
    os.makedirs(upload_dir, exist_ok=True)
    
    # Generate a unique filename
    file_extension = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(upload_dir, unique_filename)
    
    # Save the file
    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())
    
    # Get file size
    file_size = os.path.getsize(file_path)
    
    # Create attachment record in the database
    new_attachment = models.TaskAttachment(
        task_id=task_id,
        file_name=file.filename,
        file_path=file_path,
        file_url=f"/uploads/tasks/{task_id}/{unique_filename}",
        file_type=file.content_type,
        file_size=file_size,
        uploaded_by=current_user.user_id
    )
    
    db.add(new_attachment)
    
    # Update progress description if provided
    if description:
        task.progress_description = description
    
    db.commit()
    db.refresh(new_attachment)
    
    return new_attachment

@router.get("/tasks/{task_id}/attachments", response_model=List[schemas.TaskAttachmentResponse])
async def get_task_attachments(
    task_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all attachments for a task"""
    # Verify task exists and belongs to the user
    task = db.query(models.Task).filter(
        models.Task.task_id == task_id,
        models.Task.assigned_to == current_user.user_id
    ).first()
    
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    attachments = db.query(models.TaskAttachment).filter(
        models.TaskAttachment.task_id == task_id
    ).order_by(models.TaskAttachment.created_at.desc()).all()
    
    return attachments

@router.put("/tasks/{task_id}/progress", response_model=schemas.TaskResponse)
async def update_task_progress(
    task_id: int,
    progress_data: schemas.TaskProgressUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update task progress information"""
    task = db.query(models.Task).filter(
        models.Task.task_id == task_id,
        models.Task.assigned_to == current_user.user_id
    ).first()
    
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    if progress_data.progress_description is not None:
        task.progress_description = progress_data.progress_description
    
    if progress_data.drive_link is not None:
        task.drive_link = progress_data.drive_link
        
    db.commit()
    db.refresh(task)
    
    return task

@router.get("/tasks/{task_id}/analyze-progress")
async def analyze_task_progress(
    task_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Analyze task progress using AI"""
    task = db.query(models.Task).filter(
        models.Task.task_id == task_id,
        models.Task.assigned_to == current_user.user_id
    ).first()
    
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    # Get task attachments
    attachments = db.query(models.TaskAttachment).filter(
        models.TaskAttachment.task_id == task_id
    ).all()
    
    # Build context for AI analysis
    context = {
        "task_title": task.title,
        "task_description": task.description,
        "task_status": task.status,
        "progress_description": task.progress_description,
        "estimated_time": task.estimated_time,
        "actual_time": task.actual_time,
        "attachment_count": len(attachments),
        "has_drive_link": task.drive_link is not None
    }
    
    # Use AI service to analyze progress
    analysis = AIService.analyze_task_progress(context)
    
    return analysis
