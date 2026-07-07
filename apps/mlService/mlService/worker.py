import json
import os

import redis
from dotenv import load_dotenv

from .fetch_categories import fetch_categories
from .fetch_laws import fetch_laws
from .generate_statement import generate_statement
from .get_pgvector import get_pgvector

load_dotenv()


def create_redis():
    r = redis.Redis(
        host=os.getenv("REDIS_HOST") or "redis",
        port=int(os.getenv("REDIS_PORT") or "6379"),
        decode_responses=True,
        socket_timeout=None,
    )
    r.xadd("ml_tasks", {"init": "true"})
    r.xadd("ml_results", {"init": "true"})
    r.xadd("ml_errors", {"init": "true"})
    try:
        r.xgroup_create(
            name="ml_tasks",
            groupname="ml-workers",
            id="$",
            mkstream=True,
        )
    except Exception as e:
        print(e)
        print("Skipping group creation")

    return r


def run_worker():
    r = create_redis()

    while True:
        result = r.xreadgroup(
            groupname="ml-workers",
            consumername="worker-1",
            streams={"ml_tasks": ">"},
            count=10,
            block=0,
        )

        if not result:
            continue

        if not result:
            continue

        for stream_name, messages in result:
            if stream_name != "ml_tasks":
                continue

            for msg_id, data in messages:
                if data.get("init") == "true":
                    r.xack("ml_tasks", "ml-workers", msg_id)
                    continue

                task_id = data.get("id") or "unknown"

                try:
                    statement, categories = process_message(data)

                    r.xadd(
                        "ml_results",
                        {
                            "statement": statement,
                            "id": task_id,
                            "categories": json.dumps(categories),
                        },
                    )

                    r.xack("ml_tasks", "ml-workers", msg_id)
                    print(f"✅ Заявку {task_id} успішно оброблено!")
                except Exception as e:
                    print(f"❌ Помилка обробки повідомлення {msg_id}: {e}")
                    r.xack("ml_tasks", "ml-workers", msg_id)
                    r.xadd("ml_errors", {"id": task_id})


def process_message(data):
    pgvector = get_pgvector(data["text"])
    laws = fetch_laws(pgvector)
    categories = fetch_categories(pgvector)

    statement = generate_statement(
        data["text"],
        laws,
        data["address"],
        {"longitude": data["longitude"], "latitude": data["latitude"]},
        {
            "id": data["requester_id"],
            "email": data["requester_email"],
            "fullName": data["requester_fullName"]
            if data["requester_fullName"]
            else None,
            "address": data["address"] if data["address"] else None,
            "phone": data["requester_phone"] if data["requester_phone"] else None,
        },
        data["createdAt"],
    )

    return statement.text, categories
