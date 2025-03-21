
"""
Script to seed the database with initial client and employee data
"""
import sys
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models
from datetime import datetime, timedelta
import logging
import random

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def seed_data():
    db = SessionLocal()
    try:
        # Add roles if they don't exist
        roles = {
            "CEO": None,
            "Growth strategist": None,
            "Sr.Graphic Designer": None,
            "Sr.Video Editior": None,
            "Sr.Branding Expert": None,
            "Sr.Wordpress Developer": None,
            "Jr.HR": None,
            "Jr.Wordpress Developer": None,
            "SEO expert": None,
            "Jr.Graphic Designer": None,
            "Sr.SEO Specalist": None,
            "Creative & accounts office": None,
            "Chief Visionary Growth officer": None,
            "Senior website designer": None,
            "Operation Head": None,
            "Business development officer": None,
            "admin": None,
            "employee": None,
            "client": None,
            "marketing": None,
            "hr": None,
            "finance": None,
        }
        
        # Add roles to database
        for role_name in roles:
            existing_role = db.query(models.Role).filter(models.Role.role_name == role_name).first()
            if existing_role:
                roles[role_name] = existing_role
            else:
                new_role = models.Role(role_name=role_name)
                db.add(new_role)
                db.flush()
                roles[role_name] = new_role
                logger.info(f"Added role: {role_name}")
        
        # Add clients with specific communication channels
        clients_data = [
            {"name": "Social Land", "description": "Uses Discord for communication and Google doc, Asana for tasks", "contact_info": "client@socialland.com"},
            {"name": "Koala Digital", "description": "Uses Slack for communication and Trello for tasks", "contact_info": "client@koaladigital.com"},
            {"name": "AC Digital", "description": "Uses Email for communication and tasks", "contact_info": "client@acdigital.com"},
            {"name": "Muse Digital", "description": "Uses Email and Whatsapp for communication and Whatsapp for tasks", "contact_info": "client@musedigital.com"},
            {"name": "Internet People", "description": "Uses Whatsapp for communication and Whatsapp, Base Camp for tasks", "contact_info": "client@internetpeople.com"},
            {"name": "Philip", "description": "Uses Whatsapp for communication and tasks", "contact_info": "philip@client.com"},
            {"name": "Website Architect", "description": "Uses Whatsapp, Slack for communication and Whatsapp and Slack for tasks", "contact_info": "client@websitearchitect.com"},
            {"name": "Justin", "description": "Uses Email, Whatsapp for communication and Whatsapp for tasks", "contact_info": "justin@client.com"},
            {"name": "Mark Intrinsic", "description": "Uses Whatsapp for communication and tasks", "contact_info": "mark@intrinsic.com"},
            {"name": "Mario", "description": "Uses Whatsapp, Email for communication and Whatsapp, Email for tasks", "contact_info": "mario@client.com"}
        ]
        
        clients = {}
        for client_data in clients_data:
            existing_client = db.query(models.Client).filter(models.Client.client_name == client_data["name"]).first()
            if existing_client:
                clients[client_data["name"]] = existing_client
                logger.info(f"Client already exists: {client_data['name']}")
            else:
                new_client = models.Client(
                    client_name=client_data["name"],
                    description=client_data["description"],
                    contact_info=client_data["contact_info"]
                )
                db.add(new_client)
                db.flush()
                clients[client_data["name"]] = new_client
                logger.info(f"Added client: {client_data['name']}")
        
        # Parse date function
        def parse_date(date_str):
            if not date_str:
                return None
            try:
                return datetime.strptime(date_str, "%d/%m/%y")
            except ValueError:
                try:
                    return datetime.strptime(date_str, "%d/%m/%Y")
                except ValueError:
                    logger.error(f"Could not parse date: {date_str}")
                    return None
        
        # Add employees with specific details
        employees_data = [
            {"name": "Raje", "joining_date": "23/05/23", "emp_id": "2301", "dob": "23/06/1998", "email": "raje.brandingbeez@gmail.com", "role": "CEO"},
            {"name": "Priya", "joining_date": "09/10/23", "emp_id": "2317", "dob": "12/03/2000", "email": "priya.brandingbeez@gmail.com", "role": "Growth strategist"},
            {"name": "Mani", "joining_date": "16/10/23", "emp_id": "2402", "dob": "16/05/2002", "email": "mani.brandingbeez@gmail.com", "role": "Sr.Graphic Designer"},
            {"name": "Dinesh", "joining_date": "30/10/23", "emp_id": "2320", "dob": "22/08/2000", "email": "dinesh.brandingbeez@gmail.com", "role": "Sr.Video Editior"},
            {"name": "Shadik", "joining_date": "27/12/21", "emp_id": "2102", "dob": "28/08/1998", "email": "shadik.brandingbeez@gmail.com", "role": "Sr.Branding Expert"},
            {"name": "Sanjay", "joining_date": "04/12/23", "emp_id": "2321", "dob": "28/01/1999", "email": "sanjay.brandingbeez@gmail.com", "role": "Sr.Wordpress Developer"},
            {"name": "Athira", "joining_date": "20/05/25", "emp_id": "2402", "dob": "29/06/2000", "email": "athira.brandingbeez@gmail.com", "role": "Jr.HR"},
            {"name": "Nijanthan", "joining_date": "17/04/24", "emp_id": "2322", "dob": "29/07/2001", "email": "niju.brandingbeez@gmail.com", "role": "Jr.Wordpress Developer"},
            {"name": "Yuva", "joining_date": "18/03/24", "emp_id": "2401", "dob": "14/10/1999", "email": "yuva.brandingbeez@gmail.com", "role": "SEO expert"},
            {"name": "Mithra", "joining_date": "03/06/24", "emp_id": "2403", "dob": "30/01/2002", "email": "mithra.brandingbeez@gmail.com", "role": "Jr.Graphic Designer"},
            {"name": "Kohila", "joining_date": "01/07/24", "emp_id": "2404", "dob": "30/12/1996", "email": "kohila.brandingbeez@gmail.com", "role": "Sr.SEO Specalist"},
            {"name": "Vishnu", "joining_date": "04/06/22", "emp_id": "2315", "dob": "15/01/1996", "email": "vishnu.brandingbeez@gmail.com", "role": "Creative & accounts office"},
            {"name": "Charan", "joining_date": "21/10/25", "emp_id": "2406", "dob": "19/12/1995", "email": "charan.brandingbeez@gmail.com", "role": "Chief Visionary Growth officer"},
            {"name": "Jayakumar", "joining_date": "02/12/25", "emp_id": "2408", "dob": "01/12/2000", "email": "jay.brandingbeez@gmail.com", "role": "Senior website designer"},
            {"name": "Gopal", "joining_date": "02/01/25", "emp_id": "2409", "dob": "12/06/1991", "email": "gopal.brandingbeez@gmail.com", "role": "Operation Head"},
            {"name": "Shalini", "joining_date": "18/12/25", "emp_id": "2401", "dob": "31/12/2000", "email": "shalini.brandingbeez@gmail.com", "role": "Business development officer"}
        ]
        
        # Default password (hashed) - use a secure password in production
        default_password_hash = "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW"  # password: admin123
        
        # List of task titles for more variety
        task_titles = [
            "Website redesign",
            "Social media campaign",
            "Logo design",
            "SEO optimization",
            "Content creation",
            "Email marketing",
            "PPC advertising",
            "Brand strategy",
            "Mobile app development",
            "Video production",
            "Graphic design",
            "WordPress development"
        ]
        
        # Priority levels
        priorities = ["High", "Medium", "Low"]
        
        # Task status options
        statuses = ["pending", "in_progress", "completed", "cancelled"]
        status_weights = [0.3, 0.4, 0.2, 0.1]  # Probability weights for random selection
        
        created_employees = []
        
        for emp_data in employees_data:
            existing_user = db.query(models.User).filter(models.User.email == emp_data["email"]).first()
            if existing_user:
                logger.info(f"Employee already exists: {emp_data['name']}")
                created_employees.append(existing_user)
                continue
                
            role = roles.get(emp_data["role"])
            if not role:
                logger.error(f"Role not found: {emp_data['role']}")
                continue
                
            new_user = models.User(
                name=emp_data["name"],
                email=emp_data["email"],
                password_hash=default_password_hash,
                role_id=role.role_id
            )
            db.add(new_user)
            db.flush()
            created_employees.append(new_user)
            logger.info(f"Added employee: {emp_data['name']}")
            
        # Add attendance records for employees
        for employee in created_employees:
            # Today's attendance (if working hours)
            current_hour = datetime.now().hour
            if 9 <= current_hour <= 18:  # Working hours
                # Check if attendance already exists
                existing_attendance = db.query(models.EmployeeAttendance).filter(
                    models.EmployeeAttendance.user_id == employee.user_id,
                    models.EmployeeAttendance.work_date == datetime.now().date()
                ).first()
                
                if not existing_attendance:
                    login_time = datetime.combine(datetime.now().date(), datetime.strptime('09:00', '%H:%M').time())
                    attendance = models.EmployeeAttendance(
                        user_id=employee.user_id,
                        login_time=login_time,
                        work_date=datetime.now().date()
                    )
                    db.add(attendance)
                    logger.info(f"Added today's attendance for {employee.name}")
            
            # Previous days' attendance (last 7 days)
            for day in range(1, 8):
                work_date = (datetime.now() - timedelta(days=day)).date()
                # Skip weekends
                if work_date.weekday() >= 5:  # 5 is Saturday, 6 is Sunday
                    continue
                    
                # Check if attendance already exists
                existing_attendance = db.query(models.EmployeeAttendance).filter(
                    models.EmployeeAttendance.user_id == employee.user_id,
                    models.EmployeeAttendance.work_date == work_date
                ).first()
                
                if not existing_attendance:
                    login_time = datetime.combine(work_date, datetime.strptime('09:00', '%H:%M').time())
                    logout_time = datetime.combine(work_date, datetime.strptime('18:00', '%H:%M').time())
                    attendance = models.EmployeeAttendance(
                        user_id=employee.user_id,
                        login_time=login_time,
                        logout_time=logout_time,
                        work_date=work_date
                    )
                    db.add(attendance)
        
        # Create tasks for employees with realistic status and progress
        if created_employees and clients:
            client_list = list(clients.values())
            
            # Create multiple tasks for each employee
            for employee in created_employees:
                # Assign 2-5 tasks per employee
                num_tasks = random.randint(2, 5)
                
                for i in range(num_tasks):
                    client = random.choice(client_list)
                    
                    # Random task status with weighted selection
                    status = random.choices(statuses, weights=status_weights)[0]
                    
                    # Progress based on status
                    if status == "completed":
                        progress = 100
                    elif status == "in_progress":
                        progress = random.randint(30, 95)
                    elif status == "pending":
                        progress = 0
                    else:  # cancelled
                        progress = random.randint(0, 80)
                    
                    # Estimated and actual time
                    estimated_time = random.uniform(2.0, 16.0)
                    actual_time = 0.0
                    if status == "completed":
                        actual_time = estimated_time * random.uniform(0.8, 1.2)  # +/- 20% from estimate
                    elif status == "in_progress":
                        actual_time = estimated_time * (progress / 100) * random.uniform(0.8, 1.2)
                    
                    # Due date
                    due_days = random.randint(-5, 15)  # Some tasks are past due
                    start_date = None
                    end_date = None
                    
                    if status == "in_progress" or status == "completed":
                        start_date = datetime.now() - timedelta(days=random.randint(1, 10))
                    
                    if status == "completed":
                        end_date = start_date + timedelta(days=random.randint(1, 5))
                    
                    # Task title with client name
                    task_title = f"{random.choice(task_titles)} for {client.client_name}"
                    task_description = f"This is a {status} task assigned to {employee.name} for client {client.client_name}"
                    
                    # Create the task
                    task = models.Task(
                        title=task_title,
                        description=task_description,
                        client_id=client.client_id,
                        assigned_to=employee.user_id,
                        status=getattr(models.TaskStatus, status),
                        estimated_time=round(estimated_time, 2),
                        actual_time=round(actual_time, 2),
                        start_time=start_date,
                        end_time=end_date
                    )
                    db.add(task)
                    db.flush()
                    
                    # Add task metadata for frontend display (as AI insights)
                    insight_data = {
                        "priority": random.choice(priorities),
                        "progress": progress,
                        "communication_channel": client.description.split("Uses ")[1].split(" for communication")[0] if "Uses " in client.description else "Email"
                    }
                    
                    insight = models.AIInsight(
                        task_id=task.task_id,
                        insight=str(insight_data)
                    )
                    db.add(insight)
                    
                    # Add communication log entry for this task
                    comm_log = models.CommunicationLog(
                        client_id=client.client_id,
                        sender_id=employee.user_id,
                        channel=insight_data["communication_channel"].split(", ")[0],
                        message=f"Discussion regarding {task_title} with {client.client_name}"
                    )
                    db.add(comm_log)
                    
                    logger.info(f"Added task '{task_title}' for {employee.name} (Status: {status})")
        
        # Create some financial records for testing
        for i in range(10):
            # Income records for each client
            for client_name, client in list(clients.items()):
                # Multiple income entries per client
                for j in range(random.randint(1, 3)):
                    amount = random.randint(800, 15000)
                    date_offset = random.randint(0, 365)
                    record_date = datetime.now() - timedelta(days=date_offset)
                    
                    record = models.FinancialRecord(
                        record_type=models.FinancialRecordType.income,
                        amount=amount,
                        description=f"Payment from {client_name} for services",
                        record_date=record_date
                    )
                    db.add(record)
            
            # Expense records
            expense_categories = ["Office rent", "Utilities", "Salaries", "Software subscriptions", 
                                "Equipment", "Marketing", "Travel", "Training", "Miscellaneous"]
            
            expense = models.FinancialRecord(
                record_type=models.FinancialRecordType.expense,
                amount=random.randint(200, 5000),
                description=f"{random.choice(expense_categories)} expense",
                record_date=datetime.now() - timedelta(days=random.randint(0, 365))
            )
            db.add(expense)
        
        # Create invoices for clients
        for client_name, client in list(clients.items()):
            # Create 1-3 invoices per client
            for i in range(random.randint(1, 3)):
                # Random status with weighted probabilities
                status = random.choices(
                    ["pending", "paid", "overdue"], 
                    weights=[0.4, 0.5, 0.1]
                )[0]
                
                # Due date based on status
                if status == "overdue":
                    due_date = datetime.now() - timedelta(days=random.randint(1, 30))
                elif status == "paid":
                    due_date = datetime.now() - timedelta(days=random.randint(5, 60))
                else:  # pending
                    due_date = datetime.now() + timedelta(days=random.randint(5, 30))
                
                # Generate invoice number
                invoice_number = f"INV-{client.client_id}-{i+1}-{datetime.now().strftime('%Y%m%d')}"
                
                # Amount based on client size (just for demonstration)
                base_amount = 1000
                if "Digital" in client_name:
                    base_amount = 2500
                elif "Land" in client_name or "Architect" in client_name:
                    base_amount = 5000
                    
                amount = base_amount + random.randint(100, 1000)
                
                invoice = models.Invoice(
                    client_id=client.client_id,
                    invoice_number=invoice_number,
                    amount=amount,
                    due_date=due_date,
                    status=getattr(models.InvoiceStatus, status)
                )
                db.add(invoice)
                logger.info(f"Added {status} invoice for client: {client_name}")
        
        # Commit all changes
        db.commit()
        logger.info("Database seed completed successfully")
        
    except Exception as e:
        db.rollback()
        logger.error(f"Error seeding database: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    logger.info("Starting database seeding...")
    seed_data()
