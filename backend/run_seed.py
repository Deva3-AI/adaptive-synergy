
"""
Script to run the seed_data module
"""
import seed_data
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

if __name__ == "__main__":
    try:
        logger.info("Starting database seeding...")
        seed_data.seed_data()
        logger.info("Database seeding completed successfully!")
    except Exception as e:
        logger.error(f"Error during database seeding: {e}")
