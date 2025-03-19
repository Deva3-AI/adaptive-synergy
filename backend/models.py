
from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, ForeignKey, Text, Enum, JSON
from sqlalchemy.orm import relationship
from database import Base
import enum
from datetime import datetime

# Enum definitions
class TaskStatus(enum.Enum):
    pending = "pending"
    in_progress = "in_progress"
    completed = "completed"
    cancelled = "cancelled"

class InvoiceStatus(enum.Enum):
    pending = "pending"
    paid = "paid"
    overdue = "overdue"

class FinancialRecordType(enum.Enum):
    expense = "expense"
    income = "income"

# Model definitions
class Role(Base):
    __tablename__ = "roles"
    
    role_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    role_name = Column(String(50), unique=True, nullable=False)
    
    users = relationship("User", back_populates="role")

class User(Base):
    __tablename__ = "users"
    
    user_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role_id = Column(Integer, ForeignKey("roles.role_id"), nullable=False)
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)
    
    role = relationship("Role", back_populates="users")
    tasks = relationship("Task", back_populates="assigned_user")
    attendance = relationship("EmployeeAttendance", back_populates="user")
    communication_logs = relationship("CommunicationLog", back_populates="sender")

class Client(Base):
    __tablename__ = "clients"
    
    client_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    client_name = Column(String(100), nullable=False)
    description = Column(Text)
    contact_info = Column(String(255))
    created_at = Column(DateTime, default=datetime.now)
    
    tasks = relationship("Task", back_populates="client")
    invoices = relationship("Invoice", back_populates="client")
    communication_logs = relationship("CommunicationLog", back_populates="client")

class Task(Base):
    __tablename__ = "tasks"
    
    task_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    client_id = Column(Integer, ForeignKey("clients.client_id"))
    assigned_to = Column(Integer, ForeignKey("users.user_id"))
    status = Column(Enum(TaskStatus), default=TaskStatus.pending)
    estimated_time = Column(Float)
    actual_time = Column(Float)
    start_time = Column(DateTime)
    end_time = Column(DateTime)
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)
    
    client = relationship("Client", back_populates="tasks")
    assigned_user = relationship("User", back_populates="tasks")
    ai_insights = relationship("AIInsight", back_populates="task")

class EmployeeAttendance(Base):
    __tablename__ = "employee_attendance"
    
    attendance_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    login_time = Column(DateTime)
    logout_time = Column(DateTime)
    work_date = Column(DateTime, nullable=False)
    
    user = relationship("User", back_populates="attendance")

class CommunicationLog(Base):
    __tablename__ = "communication_logs"
    
    log_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    client_id = Column(Integer, ForeignKey("clients.client_id"))
    sender_id = Column(Integer, ForeignKey("users.user_id"))
    channel = Column(String(50))
    message = Column(Text)
    created_at = Column(DateTime, default=datetime.now)
    
    client = relationship("Client", back_populates="communication_logs")
    sender = relationship("User", back_populates="communication_logs")

class Invoice(Base):
    __tablename__ = "invoices"
    
    invoice_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    client_id = Column(Integer, ForeignKey("clients.client_id"), nullable=False)
    invoice_number = Column(String(50), unique=True, nullable=False)
    amount = Column(Float, nullable=False)
    due_date = Column(DateTime)
    status = Column(Enum(InvoiceStatus), default=InvoiceStatus.pending)
    created_at = Column(DateTime, default=datetime.now)
    
    client = relationship("Client", back_populates="invoices")

class FinancialRecord(Base):
    __tablename__ = "financial_records"
    
    record_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    record_type = Column(Enum(FinancialRecordType), nullable=False)
    amount = Column(Float, nullable=False)
    description = Column(Text)
    record_date = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.now)

class AIInsight(Base):
    __tablename__ = "ai_insights"
    
    insight_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    task_id = Column(Integer, ForeignKey("tasks.task_id"), nullable=False)
    insight = Column(Text)
    created_at = Column(DateTime, default=datetime.now)
    
    task = relationship("Task", back_populates="ai_insights")

class AIModel(Base):
    __tablename__ = "ai_models"
    
    model_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    model_name = Column(String(100), nullable=False)
    model_type = Column(String(50), nullable=False)
    description = Column(Text)
    parameters = Column(JSON)
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)
