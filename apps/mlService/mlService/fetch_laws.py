import os

import psycopg
from dotenv import load_dotenv

load_dotenv()

def fetch_laws(embedding):
    conn = psycopg.connect(
        host=os.getenv("DB_HOST"),
        dbname=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD")
    )

    cur = conn.cursor()

    vector = "[" + ",".join(map(str, embedding)) + "]"

    cur.execute("""
        SELECT id, law_name, article
        FROM ml.law_embeddings
        ORDER BY embedding <=> %s::vector
        LIMIT 5;
    """, (vector,))
    
    laws = cur.fetchall()

    return laws