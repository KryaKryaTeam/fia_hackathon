from fastapi import FastAPI
from .api import router
import uvicorn
import os
from dotenv import load_dotenv

load_dotenv()
app = FastAPI()
app.include_router(router)

def main():
    uvicorn.run("mlService.__main__:app", host=os.getenv("API_HOST"), port=int(os.getenv("API_PORT")), reload=True)

if __name__ == "__main__":
    print("MlService has started.")
    main()