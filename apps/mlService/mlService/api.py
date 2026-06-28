from fastapi import APIRouter
from .redis_queue import push_event

router = APIRouter(prefix="/event", tags=["api"])

@router.post("/")
def create_event(payload: dict):
    push_event(payload)
    return {"status": "queued"}