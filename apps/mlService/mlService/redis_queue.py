import redis
import json
import os
from dotenv import load_dotenv

load_dotenv()

r = redis.Redis(host=os.getenv("REDIS_HOST"), port=os.getenv("REDIS_PORT"), decode_responses=True)

def push_event(event: dict):
    r.rpush(os.getenv("QUEUE_NAME"), json.dumps(event))