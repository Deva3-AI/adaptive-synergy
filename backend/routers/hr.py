
from fastapi import APIRouter, Depends, HTTPException, status, Query, File, UploadFile
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from datetime import datetime, date, timedelta
import logging
import json

from database import get_db
import models
import schemas
from routers.auth import get_current_user
from services.ai_service import AIService

router = APIRouter()

@router.get("/employees", response_model=List[schemas.UserResponse])
async def get_employees(
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all employees"""
    employees = db.query(models.User).offset(skip).limit(limit).all()
    return employees

@router.get("/employees/{user_id}", response_model=schemas.UserResponse)
async def get_employee(
    user_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific employee by ID"""
    employee = db.query(models.User).filter(models.User.user_id == user_id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found"
        )
    return employee

@router.get("/employees/{user_id}/attendance", response_model=List[schemas.AttendanceResponse])
async def get_employee_attendance(
    user_id: int,
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get attendance records for a specific employee"""
    # Set default date range if not provided
    if not start_date:
        start_date = datetime.now().date() - timedelta(days=30)
    if not end_date:
        end_date = datetime.now().date()
    
    attendance = db.query(models.EmployeeAttendance).filter(
        models.EmployeeAttendance.user_id == user_id,
        models.EmployeeAttendance.work_date >= start_date,
        models.EmployeeAttendance.work_date <= end_date
    ).order_by(models.EmployeeAttendance.work_date.desc()).all()
    
    return attendance

@router.get("/employees/{user_id}/tasks", response_model=List[schemas.TaskResponse])
async def get_employee_assigned_tasks(
    user_id: int,
    status: Optional[schemas.TaskStatusEnum] = None,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get tasks assigned to a specific employee"""
    query = db.query(models.Task).filter(models.Task.assigned_to == user_id)
    
    if status:
        query = query.filter(models.Task.status == status)
    
    tasks = query.order_by(models.Task.created_at.desc()).all()
    return tasks

@router.post("/analyze-performance", response_model=Dict[str, Any])
async def analyze_employee_performance(
    user_id: int,
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Analyze employee performance using AI"""
    # Set default date range if not provided
    if not start_date:
        start_date = datetime.now().date() - timedelta(days=30)
    if not end_date:
        end_date = datetime.now().date()
    
    # Check if employee exists
    employee = db.query(models.User).filter(models.User.user_id == user_id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found"
        )
    
    # Get attendance data
    attendance_data = db.query(models.EmployeeAttendance).filter(
        models.EmployeeAttendance.user_id == user_id,
        models.EmployeeAttendance.work_date >= start_date,
        models.EmployeeAttendance.work_date <= end_date
    ).all()
    
    # Get task data
    task_data = db.query(models.Task).filter(
        models.Task.assigned_to == user_id,
        models.Task.created_at >= start_date,
        models.Task.created_at <= end_date
    ).all()
    
    # Convert to dictionaries for AI service
    attendance_dicts = []
    for a in attendance_data:
        attendance_dict = {
            "user_id": a.user_id,
            "login_time": a.login_time.isoformat() if a.login_time else None,
            "logout_time": a.logout_time.isoformat() if a.logout_time else None,
            "work_date": a.work_date.isoformat()
        }
        attendance_dicts.append(attendance_dict)
    
    task_dicts = []
    for t in task_data:
        task_dict = {
            "task_id": t.task_id,
            "title": t.title,
            "status": t.status.value,
            "estimated_time": t.estimated_time,
            "actual_time": t.actual_time,
            "start_time": t.start_time.isoformat() if t.start_time else None,
            "end_time": t.end_time.isoformat() if t.end_time else None
        }
        task_dicts.append(task_dict)
    
    # Use AI service to analyze performance
    performance_analysis = AIService.analyze_employee_performance(
        attendance_data=attendance_dicts,
        task_data=task_dicts
    )
    
    # Add employee info and date range to result
    result = {
        "employee": {
            "user_id": employee.user_id,
            "name": employee.name,
            "email": employee.email
        },
        "date_range": {
            "start_date": start_date.isoformat(),
            "end_date": end_date.isoformat()
        },
        **performance_analysis
    }
    
    return result

@router.post("/resume-analysis", response_model=Dict[str, Any])
async def analyze_resume(
    position: str,
    resume: UploadFile = File(...),
    current_user: models.User = Depends(get_current_user)
):
    """Analyze a resume for recruitment using AI"""
    try:
        # Read resume content
        resume_content = await resume.read()
        resume_text = resume_content.decode("utf-8")
        
        # Create prompt for OpenAI
        prompt = f"""
        Analyze this resume for a {position} position:
        
        Resume:
        {resume_text}
        
        Provide:
        1. Key skills identified
        2. Years of experience
        3. Education summary
        4. Relevant experience highlights
        5. Skills match score (0-100) for the position
        6. Strengths
        7. Gaps or areas for improvement
        8. Overall recommendation (Reject, Consider, Interview, Strong Candidate)
        
        Format as JSON with these keys:
        - key_skills (array)
        - years_experience (number)
        - education (string)
        - relevant_experience (array)
        - skills_match_score (number)
        - strengths (array)
        - gaps (array)
        - recommendation (string)
        """
        
        # Call OpenAI API
        import openai
        import json
        
        response = openai.ChatCompletion.create(
            model="gpt-4o",
            messages=[{"role": "system", "content": "You are an HR recruitment specialist that analyzes resumes and provides structured assessments. Always respond with valid JSON."},
                      {"role": "user", "content": prompt}]
        )
        
        response_text = response.choices[0].message.content.strip()
        
        # Extract JSON if embedded in text
        import re
        json_match = re.search(r'```json\s*(.*?)\s*```', response_text, re.DOTALL)
        if json_match:
            response_text = json_match.group(1)
        
        analysis = json.loads(response_text)
        
        # Add metadata
        analysis["metadata"] = {
            "position": position,
            "resume_filename": resume.filename,
            "analyzed_at": datetime.now().isoformat()
        }
        
        return analysis
        
    except Exception as e:
        logging.error(f"Error analyzing resume: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error analyzing resume"
        )

@router.get("/attendance-stats", response_model=Dict[str, Any])
async def get_attendance_stats(
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get attendance statistics across all employees"""
    # Set default date range if not provided
    if not start_date:
        start_date = datetime.now().date() - timedelta(days=30)
    if not end_date:
        end_date = datetime.now().date()
    
    # Get all attendance records in date range
    attendance = db.query(models.EmployeeAttendance).filter(
        models.EmployeeAttendance.work_date >= start_date,
        models.EmployeeAttendance.work_date <= end_date
    ).all()
    
    # Get all employees
    employees = db.query(models.User).all()
    total_employees = len(employees)
    
    # Group attendance by date
    attendance_by_date = {}
    for record in attendance:
        date_str = record.work_date.isoformat()
        if date_str not in attendance_by_date:
            attendance_by_date[date_str] = []
        attendance_by_date[date_str].append(record)
    
    # Calculate daily stats
    daily_stats = []
    for date_str, records in attendance_by_date.items():
        present_count = len(records)
        absent_count = total_employees - present_count
        late_count = sum(1 for r in records if r.login_time and r.login_time.time() > datetime.strptime("09:15:00", "%H:%M:%S").time())
        
        daily_stats.append({
            "date": date_str,
            "present": present_count,
            "absent": absent_count,
            "late": late_count,
            "attendance_rate": (present_count / total_employees) * 100 if total_employees > 0 else 0
        })
    
    # Sort by date
    daily_stats.sort(key=lambda x: x["date"])
    
    # Calculate averages
    avg_present = sum(day["present"] for day in daily_stats) / len(daily_stats) if daily_stats else 0
    avg_absent = sum(day["absent"] for day in daily_stats) / len(daily_stats) if daily_stats else 0
    avg_late = sum(day["late"] for day in daily_stats) / len(daily_stats) if daily_stats else 0
    avg_attendance_rate = sum(day["attendance_rate"] for day in daily_stats) / len(daily_stats) if daily_stats else 0
    
    return {
        "period": {
            "start_date": start_date.isoformat(),
            "end_date": end_date.isoformat()
        },
        "summary": {
            "total_employees": total_employees,
            "avg_present": avg_present,
            "avg_absent": avg_absent,
            "avg_late": avg_late,
            "avg_attendance_rate": avg_attendance_rate
        },
        "daily_stats": daily_stats
    }
