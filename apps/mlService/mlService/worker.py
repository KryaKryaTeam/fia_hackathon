import json
import os

import redis
from dotenv import load_dotenv

load_dotenv()
r = redis.Redis(
    host=os.getenv("REDIS_HOST"), port=os.getenv("REDIS_PORT"), decode_responses=True
)


def handle_event(event: dict):
    print("🔥 received:", event)

    # fake ML logic placeholder
    result = {"input": event, "prediction": "something"}

    print("✅ result:", result)


def run():
    print("🚀 worker running...")

    while True:
        _, raw = r.blpop("ml_events")

        if not raw:
            continue

        try:
            event = json.loads(raw)
        except json.JSONDecodeError:
            print("⚠️ bad message in queue:", raw)
            continue

        handle_event(event)


if __name__ == "__main__":
    run()
