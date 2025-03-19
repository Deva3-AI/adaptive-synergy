
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from datetime import datetime, date, timedelta
import logging

from database import get_db
import models
import schemas
from routers.auth import get_current_user
from services.ai_service import AIService

router = APIRouter()

@router.get("/invoices", response_model=List[schemas.InvoiceResponse])
async def get_invoices(
    status: Optional[schemas.InvoiceStatusEnum] = None,
    client_id: Optional[int] = None,
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get list of invoices with optional filtering"""
    query = db.query(models.Invoice)
    
    if status:
        query = query.filter(models.Invoice.status == status)
    
    if client_id:
        query = query.filter(models.Invoice.client_id == client_id)
    
    invoices = query.order_by(models.Invoice.created_at.desc()).offset(skip).limit(limit).all()
    return invoices

@router.post("/invoices", response_model=schemas.InvoiceResponse)
async def create_invoice(
    invoice: schemas.InvoiceCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new invoice"""
    # Verify client exists
    client = db.query(models.Client).filter(models.Client.client_id == invoice.client_id).first()
    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Client not found"
        )
    
    # Check if invoice number already exists
    existing_invoice = db.query(models.Invoice).filter(models.Invoice.invoice_number == invoice.invoice_number).first()
    if existing_invoice:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invoice number already exists"
        )
    
    db_invoice = models.Invoice(**invoice.dict())
    db.add(db_invoice)
    db.commit()
    db.refresh(db_invoice)
    return db_invoice

@router.get("/invoices/{invoice_id}", response_model=schemas.InvoiceResponse)
async def get_invoice(
    invoice_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific invoice by ID"""
    invoice = db.query(models.Invoice).filter(models.Invoice.invoice_id == invoice_id).first()
    if not invoice:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invoice not found"
        )
    return invoice

@router.patch("/invoices/{invoice_id}/status", response_model=schemas.InvoiceResponse)
async def update_invoice_status(
    invoice_id: int,
    status: schemas.InvoiceStatusEnum,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update the status of an invoice"""
    invoice = db.query(models.Invoice).filter(models.Invoice.invoice_id == invoice_id).first()
    if not invoice:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invoice not found"
        )
    
    invoice.status = status
    db.commit()
    db.refresh(invoice)
    return invoice

@router.get("/financial-records", response_model=List[schemas.FinancialRecordResponse])
async def get_financial_records(
    record_type: Optional[schemas.FinancialRecordTypeEnum] = None,
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get financial records with optional filtering"""
    query = db.query(models.FinancialRecord)
    
    if record_type:
        query = query.filter(models.FinancialRecord.record_type == record_type)
    
    if start_date:
        query = query.filter(models.FinancialRecord.record_date >= start_date)
    
    if end_date:
        query = query.filter(models.FinancialRecord.record_date <= end_date)
    
    records = query.order_by(models.FinancialRecord.record_date.desc()).offset(skip).limit(limit).all()
    return records

@router.post("/financial-records", response_model=schemas.FinancialRecordResponse)
async def create_financial_record(
    record: schemas.FinancialRecordCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new financial record"""
    db_record = models.FinancialRecord(**record.dict())
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return db_record

@router.get("/financial-summary", response_model=Dict[str, Any])
async def get_financial_summary(
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get financial summary and statistics"""
    # Set default date range if not provided
    if not start_date:
        start_date = datetime.now().date() - timedelta(days=90)
    if not end_date:
        end_date = datetime.now().date()
    
    # Get financial records in date range
    records = db.query(models.FinancialRecord).filter(
        models.FinancialRecord.record_date >= start_date,
        models.FinancialRecord.record_date <= end_date
    ).all()
    
    # Get invoices in date range
    invoices = db.query(models.Invoice).filter(
        models.Invoice.created_at >= start_date,
        models.Invoice.created_at <= end_date
    ).all()
    
    # Convert to dictionaries for AI service
    record_dicts = []
    for r in records:
        record_dict = {
            "record_id": r.record_id,
            "record_type": r.record_type.value,
            "amount": r.amount,
            "description": r.description,
            "record_date": r.record_date.isoformat()
        }
        record_dicts.append(record_dict)
    
    # Use AI service to analyze financial data
    financial_analysis = AIService.analyze_financial_data(record_dicts)
    
    # Calculate additional metrics
    total_revenue = sum(r.amount for r in records if r.record_type == models.FinancialRecordType.income)
    total_expenses = sum(r.amount for r in records if r.record_type == models.FinancialRecordType.expense)
    
    # Invoices statistics
    total_invoiced = sum(i.amount for i in invoices)
    paid_invoices = sum(i.amount for i in invoices if i.status == models.InvoiceStatus.paid)
    pending_invoices = sum(i.amount for i in invoices if i.status == models.InvoiceStatus.pending)
    overdue_invoices = sum(i.amount for i in invoices if i.status == models.InvoiceStatus.overdue)
    
    # Monthly breakdown
    monthly_breakdown = {}
    for record in records:
        month = record.record_date.strftime("%Y-%m")
        if month not in monthly_breakdown:
            monthly_breakdown[month] = {"income": 0, "expense": 0, "profit": 0}
        
        if record.record_type == models.FinancialRecordType.income:
            monthly_breakdown[month]["income"] += record.amount
        elif record.record_type == models.FinancialRecordType.expense:
            monthly_breakdown[month]["expense"] += record.amount
            
        monthly_breakdown[month]["profit"] = monthly_breakdown[month]["income"] - monthly_breakdown[month]["expense"]
    
    # Convert to sorted list for better usability
    monthly_data = []
    for month, data in sorted(monthly_breakdown.items()):
        monthly_data.append({
            "month": month,
            "income": data["income"],
            "expense": data["expense"],
            "profit": data["profit"]
        })
    
    return {
        "period": {
            "start_date": start_date.isoformat(),
            "end_date": end_date.isoformat()
        },
        "summary": {
            "total_revenue": total_revenue,
            "total_expenses": total_expenses,
            "net_profit": total_revenue - total_expenses,
            "profit_margin": ((total_revenue - total_expenses) / total_revenue) * 100 if total_revenue > 0 else 0
        },
        "invoices": {
            "total_invoiced": total_invoiced,
            "paid_invoices": paid_invoices,
            "pending_invoices": pending_invoices,
            "overdue_invoices": overdue_invoices,
            "collection_rate": (paid_invoices / total_invoiced) * 100 if total_invoiced > 0 else 0
        },
        "monthly_breakdown": monthly_data,
        "analysis": financial_analysis
    }

@router.post("/analyze-cost", response_model=Dict[str, Any])
async def analyze_cost(
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Analyze costs and team hours"""
    # Set default date range if not provided
    if not start_date:
        start_date = datetime.now().date() - timedelta(days=90)
    if not end_date:
        end_date = datetime.now().date()
    
    # Get employees
    employees = db.query(models.User).all()
    
    # Get attendance records
    attendance = db.query(models.EmployeeAttendance).filter(
        models.EmployeeAttendance.work_date >= start_date,
        models.EmployeeAttendance.work_date <= end_date
    ).all()
    
    # Get completed tasks
    tasks = db.query(models.Task).filter(
        models.Task.status == models.TaskStatus.completed,
        models.Task.end_time >= start_date,
        models.Task.end_time <= end_date
    ).all()
    
    # Calculate hours worked by employee
    employee_hours = {}
    for record in attendance:
        if record.login_time and record.logout_time:
            hours = (record.logout_time - record.login_time).total_seconds() / 3600
            
            if record.user_id not in employee_hours:
                employee_hours[record.user_id] = 0
                
            employee_hours[record.user_id] += hours
    
    # Get employee details and create final employee data
    employee_data = []
    for emp in employees:
        hours = employee_hours.get(emp.user_id, 0)
        
        # Get employee completed tasks
        emp_tasks = [t for t in tasks if t.assigned_to == emp.user_id]
        task_hours = sum(t.actual_time or 0 for t in emp_tasks)
        
        # Assuming average hourly rate (would come from payroll system in real app)
        hourly_rate = 25  # Default hourly rate
        
        employee_data.append({
            "user_id": emp.user_id,
            "name": emp.name,
            "hours_worked": hours,
            "task_hours": task_hours,
            "productivity_ratio": (task_hours / hours) if hours > 0 else 0,
            "cost": hours * hourly_rate
        })
    
    # Calculate department/role distribution
    role_distribution = {}
    for emp in employees:
        role = db.query(models.Role).filter(models.Role.role_id == emp.role_id).first()
        role_name = role.role_name if role else "Unknown"
        
        if role_name not in role_distribution:
            role_distribution[role_name] = {
                "count": 0,
                "hours": 0,
                "cost": 0
            }
        
        role_distribution[role_name]["count"] += 1
        role_distribution[role_name]["hours"] += employee_hours.get(emp.user_id, 0)
        role_distribution[role_name]["cost"] += employee_hours.get(emp.user_id, 0) * 25  # Default hourly rate
    
    # Calculate client project costs
    client_costs = {}
    for task in tasks:
        if task.client_id and task.actual_time:
            if task.client_id not in client_costs:
                client = db.query(models.Client).filter(models.Client.client_id == task.client_id).first()
                client_name = client.client_name if client else f"Client {task.client_id}"
                
                client_costs[task.client_id] = {
                    "client_id": task.client_id,
                    "client_name": client_name,
                    "hours": 0,
                    "cost": 0,
                    "task_count": 0
                }
            
            client_costs[task.client_id]["hours"] += task.actual_time
            client_costs[task.client_id]["cost"] += task.actual_time * 25  # Default hourly rate
            client_costs[task.client_id]["task_count"] += 1
    
    # Convert client costs to list
    client_cost_list = list(client_costs.values())
    
    # Calculate totals
    total_hours = sum(emp["hours_worked"] for emp in employee_data)
    total_cost = sum(emp["cost"] for emp in employee_data)
    total_task_hours = sum(emp["task_hours"] for emp in employee_data)
    avg_productivity = (total_task_hours / total_hours) if total_hours > 0 else 0
    
    return {
        "period": {
            "start_date": start_date.isoformat(),
            "end_date": end_date.isoformat()
        },
        "summary": {
            "total_employees": len(employees),
            "total_hours": total_hours,
            "total_cost": total_cost,
            "total_task_hours": total_task_hours,
            "productivity_ratio": avg_productivity
        },
        "employee_data": employee_data,
        "role_distribution": [{"role": role, **data} for role, data in role_distribution.items()],
        "client_costs": client_cost_list
    }
