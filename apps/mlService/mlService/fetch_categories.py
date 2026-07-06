import psycopg, os
from dotenv import load_dotenv

load_dotenv()

DB_NAME=os.getenv("DB_NAME")
DB_PASSWORD=os.getenv("DB_PASSWORD")
DB_USER=os.getenv("DB_USER")
DB_HOST=os.getenv("DB_HOST")

def fetch_categories(embedding):
    conn = psycopg.connect(
        host=DB_HOST,
        password=DB_PASSWORD,
        dbname=DB_NAME,
        user=DB_USER
    )

    cur = conn.cursor()

    vector = "[" + ",".join(map(str, embedding)) + "]"

    cur.execute("""
        SELECT category_name
        FROM ml.categories
        ORDER BY embedding <=> %s::vector
        LIMIT 3
    """, (vector,))

    categories = cur.fetchall()

    for category in categories:
        category = category[0]

    return categories