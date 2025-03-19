
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Boolean, ForeignKey, Text, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
import os
from dotenv import load_dotenv
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Get database connection details from environment variables
DB_USER = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "3306")
DB_NAME = os.getenv("DB_NAME", "hyperflow")

# Create database URL
DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# Create engine
try:
    engine = create_engine(DATABASE_URL)
    logger.info(f"Database connection established: {DB_HOST}:{DB_PORT}/{DB_NAME}")
except Exception as e:
    logger.error(f"Database connection error: {e}")
    raise

# Create sessionmaker
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create base class for models
Base = declarative_base()

# Dependency to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    try:
        # Create the database if it doesn't exist
        engine.execute(f"CREATE DATABASE IF NOT EXISTS {DB_NAME}")
        engine.execute(f"USE {DB_NAME}")
        
        # Create tables
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables created successfully")
        
        # Insert default roles if they don't exist
        from models import Role
        db = SessionLocal()
        default_roles = ["admin", "employee", "client", "marketing", "hr", "finance"]
        for role_name in default_roles:
            existing_role = db.query(Role).filter(Role.role_name == role_name).first()
            if not existing_role:
                db.add(Role(role_name=role_name))
        db.commit()
        logger.info("Default roles created successfully")
        
    except Exception as e:
        logger.error(f"Error initializing database: {e}")
        raise
