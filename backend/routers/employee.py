
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

@router.post("/attendance/start", response_model=schemas.AttendanceResponse)
async def start_work(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Start work and log login time"""
    # Check if already logged in today
    today = datetime.now().date()
    existing_attendance = db.query(models.EmployeeAttendance).filter(
        models.EmployeeAttendance.user_id == current_user.user_id,
        models.EmployeeAttendance.work_date == today
    ).first()
    
    if existing_attendance and existing_attendance.login_time and not existing_attendance.logout_time:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You are already logged in today. Please log out first."
        )
    
    # Create new attendance record
    attendance = models.EmployeeAttendance(
        user_id=current_user.user_id,
        login_time=datetime.now(),
        work_date=today
    )
    db.add(attendance)
    db.commit()
    db.refresh(attendance)
    
    return attendance

@router.post("/attendance/stop", response_model=schemas.AttendanceResponse)
async def stop_work(attendance_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Stop work and log logout time"""
    attendance = db.query(models.EmployeeAttendance).filter(
        models.EmployeeAttendance.attendance_id == attendance_id,
        models.EmployeeAttendance.user_id == current_user.user_id
    ).first()
    
    if not attendance:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Attendance record not found"
        )
    
    if attendance.logout_time:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already logged out for this session"
        )
    
    attendance.logout_time = datetime.now()
    db.commit()
    db.refresh(attendance)
    
    return attendance

@router.get("/attendance/today", response_model=schemas.AttendanceResponse)
async def get_today_attendance(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get today's attendance record"""
    today = datetime.now().date()
    attendance = db.query(models.EmployeeAttendance).filter(
        models.EmployeeAttendance.user_id == current_user.user_id,
        models.EmployeeAttendance.work_date == today
    ).first()
    
    if not attendance:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No attendance record found for today"
        )
    
    return attendance

@router.get("/attendance/history", response_model=List[schemas.AttendanceResponse])
async def get_attendance_history(
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get attendance history for a date range"""
    if not start_date:
        start_date = datetime.now().date() - timedelta(days=30)
    if not end_date:
        end_date = datetime.now().date()
    
    attendance = db.query(models.EmployeeAttendance).filter(
        models.EmployeeAttendance.user_id == current_user.user_id,
        models.EmployeeAttendance.work_date >= start_date,
        models.EmployeeAttendance.work_date <= end_date
    ).order_by(models.EmployeeAttendance.work_date.desc()).all()
    
    return attendance

@router.get("/tasks", response_model=List[schemas.TaskResponse])
async def get_employee_tasks(
    status: Optional[schemas.TaskStatusEnum] = None,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get tasks assigned to the employee"""
    query = db.query(models.Task).filter(models.Task.assigned_to == current_user.user_id)
    
    if status:
        query = query.filter(models.Task.status == status)
    
    tasks = query.order_by(models.Task.created_at.desc()).all()
    return tasks

@router.get("/tasks/{task_id}", response_model=schemas.TaskResponse)
async def get_employee_task(
    task_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific task assigned to the employee"""
    task = db.query(models.Task).filter(
        models.Task.task_id == task_id,
        models.Task.assigned_to == current_user.user_id
    ).first()
    
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found or not assigned to you"
        )
    
    return task

@router.patch("/tasks/{task_id}/status", response_model=schemas.TaskResponse)
async def update_task_status(
    task_id: int,
    task_status: schemas.TaskStatusEnum,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update the status of a task"""
    task = db.query(models.Task).filter(
        models.Task.task_id == task_id,
        models.Task.assigned_to == current_user.user_id
    ).first()
    
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found or not assigned to you"
        )
    
    # If starting task, set start time
    if task_status == schemas.TaskStatusEnum.in_progress and task.status != schemas.TaskStatusEnum.in_progress:
        task.start_time = datetime.now()
    
    # If completing task, set end time
    if task_status == schemas.TaskStatusEnum.completed and task.status != schemas.TaskStatusEnum.completed:
        task.end_time = datetime.now()
        
        # Calculate actual time if start time exists
        if task.start_time:
            hours = (task.end_time - task.start_time).total_seconds() / 3600
            task.actual_time = hours
    
    task.status = task_status
    db.commit()
    db.refresh(task)
    
    return task

@router.post("/analyze-task", response_model=schemas.TaskAnalysisResponse)
async def analyze_task(
    request: schemas.TaskAnalysisRequest,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Use AI to analyze a task and estimate completion time"""
    result = AIService.predict_task_timeline(
        task_description=request.task_description,
        client_history=request.client_history
    )
    
    return result
