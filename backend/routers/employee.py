
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, date

from database import get_db
import models
import schemas
from routers.auth import get_current_user

router = APIRouter()

@router.post("/attendance/login", response_model=schemas.AttendanceResponse)
async def log_attendance_login(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Log employee login time for attendance tracking"""
    today = date.today()
    
    # Check if there's already a login for today
    existing_attendance = db.query(models.EmployeeAttendance).filter(
        models.EmployeeAttendance.user_id == current_user.user_id,
        models.EmployeeAttendance.work_date == today
    ).first()
    
    if existing_attendance and existing_attendance.login_time:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Already logged in for today"
        )
    
    if existing_attendance:
        # Update existing record
        existing_attendance.login_time = datetime.now()
        db.commit()
        db.refresh(existing_attendance)
        return existing_attendance
    else:
        # Create new attendance record
        new_attendance = models.EmployeeAttendance(
            user_id=current_user.user_id,
            login_time=datetime.now(),
            work_date=today
        )
        db.add(new_attendance)
        db.commit()
        db.refresh(new_attendance)
        return new_attendance

@router.post("/attendance/logout", response_model=schemas.AttendanceResponse)
async def log_attendance_logout(
    attendance_data: schemas.AttendanceLogout,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Log employee logout time for attendance tracking"""
    attendance = db.query(models.EmployeeAttendance).filter(
        models.EmployeeAttendance.attendance_id == attendance_data.attendance_id,
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
            detail="Already logged out for this session"
        )
    
    attendance.logout_time = datetime.now()
    db.commit()
    db.refresh(attendance)
    return attendance

@router.get("/attendance/today", response_model=Optional[schemas.AttendanceResponse])
async def get_today_attendance(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get today's attendance record for the current user"""
    today = date.today()
    attendance = db.query(models.EmployeeAttendance).filter(
        models.EmployeeAttendance.user_id == current_user.user_id,
        models.EmployeeAttendance.work_date == today
    ).first()
    
    return attendance

@router.get("/attendance/history", response_model=List[schemas.AttendanceResponse])
async def get_attendance_history(
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get attendance history for the current user within a date range"""
    query = db.query(models.EmployeeAttendance).filter(
        models.EmployeeAttendance.user_id == current_user.user_id
    )
    
    if start_date:
        query = query.filter(models.EmployeeAttendance.work_date >= start_date)
    
    if end_date:
        query = query.filter(models.EmployeeAttendance.work_date <= end_date)
    
    return query.order_by(models.EmployeeAttendance.work_date.desc()).all()

@router.get("/tasks", response_model=List[schemas.TaskResponse])
async def get_user_tasks(
    status: Optional[schemas.TaskStatusEnum] = None,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get tasks assigned to the current user"""
    query = db.query(models.Task).filter(models.Task.assigned_to == current_user.user_id)
    
    if status:
        query = query.filter(models.Task.status == status)
    
    return query.order_by(models.Task.created_at.desc()).all()

@router.get("/tasks/{task_id}", response_model=schemas.TaskResponse)
async def get_task_details(
    task_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get details of a specific task"""
    task = db.query(models.Task).filter(
        models.Task.task_id == task_id,
        models.Task.assigned_to == current_user.user_id
    ).first()
    
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    return task

@router.put("/tasks/{task_id}/status", response_model=schemas.TaskResponse)
async def update_task_status(
    task_id: int,
    task_update: schemas.TaskUpdate,
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
            detail="Task not found"
        )
    
    if task_update.status:
        task.status = task_update.status
        
    if task_update.status == schemas.TaskStatusEnum.in_progress and not task.start_time:
        task.start_time = datetime.now()
        
    if task_update.status == schemas.TaskStatusEnum.completed and not task.end_time:
        task.end_time = datetime.now()
        if task.start_time:
            # Calculate actual time in hours
            time_diff = task.end_time - task.start_time
            task.actual_time = round(time_diff.total_seconds() / 3600, 2)  # Hours rounded to 2 decimal places
    
    db.commit()
    db.refresh(task)
    return task
