
from pydantic import BaseModel, EmailStr, Field, validator
from typing import List, Optional, Dict, Any, Union
from datetime import datetime
from enum import Enum

# Enum definitions
class TaskStatusEnum(str, Enum):
    pending = "pending"
    in_progress = "in_progress"
    completed = "completed"
    cancelled = "cancelled"

class InvoiceStatusEnum(str, Enum):
    pending = "pending"
    paid = "paid"
    overdue = "overdue"

class FinancialRecordTypeEnum(str, Enum):
    expense = "expense"
    income = "income"

# Base schemas
class Token(BaseModel):
    access_token: str
    token_type: str
    expires_at: datetime
    user_id: int
    name: str
    email: str
    role: str

class TokenData(BaseModel):
    user_id: Optional[int] = None
    role: Optional[str] = None

# User schemas
class UserBase(BaseModel):
    name: str
    email: EmailStr

class UserCreate(UserBase):
    password: str
    role_id: int

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None

class UserResponse(UserBase):
    user_id: int
    role_id: int
    created_at: datetime
    
    class Config:
        orm_mode = True

# Role schemas
class RoleBase(BaseModel):
    role_name: str

class RoleCreate(RoleBase):
    pass

class RoleResponse(RoleBase):
    role_id: int
    
    class Config:
        orm_mode = True

# Client schemas
class ClientBase(BaseModel):
    client_name: str
    description: Optional[str] = None
    contact_info: Optional[str] = None

class ClientCreate(ClientBase):
    pass

class ClientUpdate(BaseModel):
    client_name: Optional[str] = None
    description: Optional[str] = None
    contact_info: Optional[str] = None

class ClientResponse(ClientBase):
    client_id: int
    created_at: datetime
    
    class Config:
        orm_mode = True

# Task schemas
class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    client_id: Optional[int] = None
    assigned_to: Optional[int] = None
    status: Optional[TaskStatusEnum] = TaskStatusEnum.pending
    estimated_time: Optional[float] = None

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    client_id: Optional[int] = None
    assigned_to: Optional[int] = None
    status: Optional[TaskStatusEnum] = None
    estimated_time: Optional[float] = None
    actual_time: Optional[float] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None

class TaskResponse(TaskBase):
    task_id: int
    actual_time: Optional[float] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        orm_mode = True

# Attendance schemas
class AttendanceBase(BaseModel):
    user_id: int
    work_date: datetime = Field(default_factory=datetime.now)

class AttendanceLogin(AttendanceBase):
    login_time: datetime = Field(default_factory=datetime.now)

class AttendanceLogout(BaseModel):
    attendance_id: int
    logout_time: datetime = Field(default_factory=datetime.now)

class AttendanceResponse(AttendanceBase):
    attendance_id: int
    login_time: Optional[datetime] = None
    logout_time: Optional[datetime] = None
    
    class Config:
        orm_mode = True

# AI schemas
class AIInsightBase(BaseModel):
    task_id: int
    insight: str

class AIInsightCreate(AIInsightBase):
    pass

class AIInsightResponse(AIInsightBase):
    insight_id: int
    created_at: datetime
    
    class Config:
        orm_mode = True

class AIModelBase(BaseModel):
    model_name: str
    model_type: str
    description: Optional[str] = None
    parameters: Optional[Dict[str, Any]] = None

class AIModelCreate(AIModelBase):
    pass

class AIModelResponse(AIModelBase):
    model_id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        orm_mode = True

# Invoice schemas
class InvoiceBase(BaseModel):
    client_id: int
    invoice_number: str
    amount: float
    due_date: Optional[datetime] = None
    status: InvoiceStatusEnum = InvoiceStatusEnum.pending

class InvoiceCreate(InvoiceBase):
    pass

class InvoiceUpdate(BaseModel):
    invoice_number: Optional[str] = None
    amount: Optional[float] = None
    due_date: Optional[datetime] = None
    status: Optional[InvoiceStatusEnum] = None

class InvoiceResponse(InvoiceBase):
    invoice_id: int
    created_at: datetime
    
    class Config:
        orm_mode = True

# Financial record schemas
class FinancialRecordBase(BaseModel):
    record_type: FinancialRecordTypeEnum
    amount: float
    description: Optional[str] = None
    record_date: datetime

class FinancialRecordCreate(FinancialRecordBase):
    pass

class FinancialRecordResponse(FinancialRecordBase):
    record_id: int
    created_at: datetime
    
    class Config:
        orm_mode = True

# Communication log schemas
class CommunicationLogBase(BaseModel):
    client_id: Optional[int] = None
    sender_id: int
    channel: str
    message: str

class CommunicationLogCreate(CommunicationLogBase):
    pass

class CommunicationLogResponse(CommunicationLogBase):
    log_id: int
    created_at: datetime
    
    class Config:
        orm_mode = True

# AI Request/Response schemas
class TaskAnalysisRequest(BaseModel):
    task_description: str
    client_history: Optional[List[Dict[str, Any]]] = None

class TaskAnalysisResponse(BaseModel):
    estimated_time: float
    task_complexity: str
    recommended_skills: List[str]
    potential_challenges: List[str]

class ClientInputAnalysisRequest(BaseModel):
    text: str
    client_id: Optional[int] = None

class ClientInputAnalysisResponse(BaseModel):
    key_requirements: List[str]
    sentiment: str
    priority_level: str
    suggested_tasks: List[Dict[str, Any]]

class MeetingAnalysisRequest(BaseModel):
    transcript: str
    meeting_type: str

class MeetingAnalysisResponse(BaseModel):
    summary: str
    action_items: List[Dict[str, Any]]
    key_insights: List[str]
    sentiment_analysis: Dict[str, Any]

class MarketingInsightRequest(BaseModel):
    campaign_data: Dict[str, Any]
    market_segment: Optional[str] = None
    time_period: Optional[str] = None

class MarketingInsightResponse(BaseModel):
    performance_analysis: Dict[str, Any]
    trend_identification: List[str]
    optimization_suggestions: List[Dict[str, Any]]
