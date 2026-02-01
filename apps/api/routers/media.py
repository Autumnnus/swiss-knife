from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from pydantic import BaseModel
from typing import Optional
from core.config import settings
import shutil
import os
import uuid

router = APIRouter()

class DownloadRequest(BaseModel):
    url: str
    format: str = "mp4"
    quality: str = "best"

@router.post("/download")
def download_media(request: DownloadRequest):
    """
    Download video from YouTube, Twitter, Instagram etc.
    """
    from worker import celery_app
    task = celery_app.send_task(
        "download_youtube", # Reusing generic downloader
        args=[request.url, request.format, request.quality]
    )
    return {"task_id": task.id, "status": "queued"}

@router.post("/convert")
def convert_media(
    file: UploadFile = File(...), 
    target_format: str = Form("mp3")
):
    from worker import celery_app
    
    upload_dir = f"{settings.STORAGE_PATH}/uploads"
    os.makedirs(upload_dir, exist_ok=True)
    
    file_id = str(uuid.uuid4())
    file_ext = os.path.splitext(file.filename)[1]
    saved_filename = f"{file_id}{file_ext}"
    file_path = f"{upload_dir}/{saved_filename}"
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    task = celery_app.send_task(
        "convert_media",
        args=[file_path, target_format]
    )
    
    return {"task_id": task.id, "status": "queued", "original_filename": file.filename}

@router.post("/compress")
def compress_media_endpoint(
    file: UploadFile = File(...),
    crf: int = Form(28)
):
    from worker import celery_app
    
    upload_dir = f"{settings.STORAGE_PATH}/uploads"
    os.makedirs(upload_dir, exist_ok=True)
    
    file_id = str(uuid.uuid4())
    file_ext = os.path.splitext(file.filename)[1]
    saved_filename = f"{file_id}{file_ext}"
    file_path = f"{upload_dir}/{saved_filename}"
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    task = celery_app.send_task(
        "compress_media",
        args=[file_path, crf]
    )
    
    return {"task_id": task.id, "status": "queued", "original_filename": file.filename}

@router.post("/cut")
def cut_media_endpoint(
    file: UploadFile = File(...),
    start_time: str = Form(...),
    end_time: str = Form(...)
):
    from worker import celery_app
    
    upload_dir = f"{settings.STORAGE_PATH}/uploads"
    os.makedirs(upload_dir, exist_ok=True)
    
    file_id = str(uuid.uuid4())
    file_ext = os.path.splitext(file.filename)[1]
    saved_filename = f"{file_id}{file_ext}"
    file_path = f"{upload_dir}/{saved_filename}"
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    task = celery_app.send_task(
        "cut_media",
        args=[file_path, start_time, end_time]
    )
    
    return {"task_id": task.id, "status": "queued", "original_filename": file.filename}

@router.post("/gif")
def create_gif_endpoint(
    file: UploadFile = File(...),
    fps: int = Form(10),
    width: int = Form(480)
):
    from worker import celery_app
    
    upload_dir = f"{settings.STORAGE_PATH}/uploads"
    os.makedirs(upload_dir, exist_ok=True)
    
    file_id = str(uuid.uuid4())
    file_ext = os.path.splitext(file.filename)[1]
    saved_filename = f"{file_id}{file_ext}"
    file_path = f"{upload_dir}/{saved_filename}"
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    task = celery_app.send_task(
        "create_gif",
        args=[file_path, fps, width]
    )
    
    return {"task_id": task.id, "status": "queued", "original_filename": file.filename}
