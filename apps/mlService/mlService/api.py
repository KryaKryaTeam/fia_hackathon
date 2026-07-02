from fastapi import APIRouter
from .tasks import handle_event

router = APIRouter(prefix="/event", tags=["api"])


@router.post("/")
def create_event(payload: dict):
    handle_event(payload)
    return {"status": "queued"}
