import os

from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer

load_dotenv()

model = SentenceTransformer(
    "microsoft/harrier-oss-v1-0.6b",
    cache_folder=os.getenv("HF_CACHE"),
    trust_remote_code=True,
    model_kwargs={"torch_dtype": "auto"},
)

def get_pgvector(text: str):
    embedding = model.encode(
        text,
        prompt_name="web_search_query"
    )

    return embedding