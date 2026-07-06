import json
import os

import psycopg
from dotenv import load_dotenv

from .worker import run_worker

load_dotenv()

def import_embeddings(cur, json_path, table, columns, text_fields):
    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    if isinstance(data, dict):
        data = data["items"]

    for item in data:
        vector = "[" + ",".join(map(str, item["embedding"])) + "]"

        values = [item[field] for field in text_fields]
        placeholders = ", ".join(["%s"] * len(values))

        vector = "[" + ",".join(map(str, item["embedding"])) + "]"
        values.append(vector)

        cur.execute(
            f"""
            INSERT INTO {table} ({columns}, embedding)
            VALUES ({placeholders}, %s::vector)
            """,
            values,
        )

def create_schema():
    conn = psycopg.connect(
        host=os.getenv("DB_HOST"),
        dbname=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
    )

    with conn:
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

            cur.execute("""
                CREATE TABLE IF NOT EXISTS ml.categories (
                    id BIGSERIAL PRIMARY KEY,
                    category_name TEXT NOT NULL,
                    embedding VECTOR(1024) NOT NULL
                );
            """)

            if os.getenv("LOAD_SCRIPT", "").lower() == "true":
                cur.execute("SELECT EXISTS (SELECT 1 FROM ml.law_embeddings LIMIT 1)")
                laws_not_empty = cur.fetchone()[0]

                cur.execute("SELECT EXISTS (SELECT 1 FROM ml.categories LIMIT 1)")
                categories_not_empty = cur.fetchone()[0]

                if laws_not_empty:
                    print("law_embeddings already contains data. Skipping import.")
                else:
                    import_embeddings(
                        cur,
                        "/data/laws_database.json",
                        "ml.law_embeddings",
                        "law_name, url, article",
                        ["law_name", "url", "article"],
                    )

                if categories_not_empty:
                    print("categories already contains data. Skipping import.")
                else:
                    import_embeddings(
                        cur,
                        "/data/categories.json",
                        "ml.categories",
                        "category_name",
                        ["text"],
                    )


print("Service is started!")
create_schema()
run_worker()
