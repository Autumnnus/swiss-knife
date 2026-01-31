from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class DownloadRequest(BaseModel):
    url: str
    format: str = "mp4"
    quality: str = "best"

@router.post("/download")
def download_video(request: DownloadRequest):
    from worker import celery_app
    task = celery_app.send_task(
        "download_youtube",
        args=[request.url, request.format, request.quality]
    )
    return {"task_id": task.id, "status": "queued"}
