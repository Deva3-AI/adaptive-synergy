
"""
Script to seed the database with initial client and employee data
"""
import sys
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models
from datetime import datetime
import logging

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
        
        # Add clients
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
        
        # Add employees
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
        
        for emp_data in employees_data:
            existing_user = db.query(models.User).filter(models.User.email == emp_data["email"]).first()
            if existing_user:
                logger.info(f"Employee already exists: {emp_data['name']}")
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
            logger.info(f"Added employee: {emp_data['name']}")
            
            # Create a sample task for each employee with a client
            if len(clients) > 0:
                client_list = list(clients.values())
                client_index = hash(emp_data["name"]) % len(client_list)
                client = client_list[client_index]
                
                task = models.Task(
                    title=f"Sample task for {emp_data['name']}",
                    description=f"This is a sample task assigned to {emp_data['name']} for client {client.client_name}",
                    client_id=client.client_id,
                    assigned_to=new_user.user_id,
                    status=models.TaskStatus.pending,
                    estimated_time=8.0
                )
                db.add(task)
                logger.info(f"Added sample task for {emp_data['name']}")
                
                # Add communication log entry
                comm_log = models.CommunicationLog(
                    client_id=client.client_id,
                    sender_id=new_user.user_id,
                    channel="Email",
                    message=f"Initial contact regarding project with {client.client_name}"
                )
                db.add(comm_log)
        
        # Create some financial records for testing
        for i in range(5):
            record = models.FinancialRecord(
                record_type=models.FinancialRecordType.income,
                amount=1000 * (i + 1),
                description=f"Payment from client {i + 1}",
                record_date=datetime.now()
            )
            db.add(record)
            
            expense = models.FinancialRecord(
                record_type=models.FinancialRecordType.expense,
                amount=500 * (i + 1),
                description=f"Office expense {i + 1}",
                record_date=datetime.now()
            )
            db.add(expense)
        
        # Create some invoices
        for client_name, client in list(clients.items())[:5]:  # Create invoices for first 5 clients
            invoice = models.Invoice(
                client_id=client.client_id,
                invoice_number=f"INV-{client.client_id}-{datetime.now().strftime('%Y%m%d')}",
                amount=1500.00,
                due_date=datetime.now(),
                status=models.InvoiceStatus.pending
            )
            db.add(invoice)
            logger.info(f"Added invoice for client: {client_name}")
        
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
