import json
import os

import psycopg
from dotenv import load_dotenv

from .worker import run_worker

load_dotenv()


def create_schema():
    conn = psycopg.connect(
        host=os.getenv("DB_HOST"),
        dbname=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
    )

    with conn:  # noqa: SIM117
        with conn.cursor() as cur:
            cur.execute("CREATE SCHEMA IF NOT EXISTS ml;")

            cur.execute("""
                CREATE EXTENSION IF NOT EXISTS vector;
            """)

            cur.execute("""
                CREATE TABLE IF NOT EXISTS ml.law_embeddings (
                    id BIGSERIAL PRIMARY KEY,
                    law_name TEXT NOT NULL,
                    url TEXT NOT NULL,
                    article TEXT NOT NULL,
                    embedding VECTOR(1024) NOT NULL
                );
            """)

            if os.getenv("LOAD_SCRIPT", "").lower() == "true":
                cur.execute("SELECT EXISTS (SELECT 1 FROM ml.law_embeddings LIMIT 1);")
                db_not_empty = cur.fetchone()[0]

                if db_not_empty:
                    print("law_embeddings already contains data. Skipping import.")
                else:
                    with open("/data/laws_database.json", encoding="utf-8") as f:
                        data = json.load(f)

                    for item in data["items"]:
                        vector = "[" + ",".join(map(str, item["embedding"])) + "]"

                        cur.execute(
                            """
                            INSERT INTO ml.law_embeddings (law_name, url, article, embedding)
                            VALUES (%s, %s, %s, %s::vector)
                            """,  # noqa: E501
                            (
                                item["law_name"],
                                item["url"],
                                item["article"],
                                vector,
                            ),
                        )

                    conn.commit()


print("Service is started!")
create_schema()
run_worker()
