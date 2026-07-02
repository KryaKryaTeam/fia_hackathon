from celery import Celery
from dotenv import load_dotenv
import os

load_dotenv()

celery = Celery(
    "ml_service",
    broker=f"redis://redis:{os.getenv("REDIS_PORT")}/0",
)