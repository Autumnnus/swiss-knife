from fastapi import APIRouter, UploadFile, File
from core.config import settings

router = APIRouter()

import shutil
import os
import uuid

@router.post("/video")
def convert_video(file: UploadFile = File(...), target_format: str = "mp3"):
    from worker import celery_app
    
    # Ensure upload directory exists
    upload_dir = f"{settings.STORAGE_PATH}/uploads"
    os.makedirs(upload_dir, exist_ok=True)
    
    # Save uploaded file
    file_id = str(uuid.uuid4())
    file_ext = os.path.splitext(file.filename)[1]
    saved_filename = f"{file_id}{file_ext}"
    file_path = f"{upload_dir}/{saved_filename}"
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # Trigger Task
    task = celery_app.send_task(
        "convert_media",
        args=[file_path, target_format]
    )
    
    return {"task_id": task.id, "status": "queued", "original_filename": file.filename}
