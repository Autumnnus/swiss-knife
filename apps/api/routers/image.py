from fastapi import APIRouter, UploadFile, File, Form
from core.config import settings
from typing import Optional
import shutil
import os
import uuid
import json

router = APIRouter()

@router.post("/process")
def process_image(
    file: UploadFile = File(...), 
    action: str = Form(...), 
    params: Optional[str] = Form(None)
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
        
    parsed_params = json.loads(params) if params else {}
        
    task = celery_app.send_task(
        "process_image",
        args=[file_path, action, parsed_params]
    )
    
    return {"task_id": task.id, "status": "queued", "original_filename": file.filename}

@router.post("/ocr")
def ocr_image(file: UploadFile = File(...), lang: str = Form("eng")):
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
        "ocr_image",
        args=[file_path, lang]
    )
    
    return {"task_id": task.id, "status": "queued", "original_filename": file.filename}
