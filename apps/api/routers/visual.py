from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from core.config import settings
from typing import Optional, List
import shutil
import os
import uuid
import json

router = APIRouter()

def save_upload(file: UploadFile) -> str:
    upload_dir = f"{settings.STORAGE_PATH}/uploads"
    os.makedirs(upload_dir, exist_ok=True)
    file_id = str(uuid.uuid4())
    file_ext = os.path.splitext(file.filename)[1]
    saved_filename = f"{file_id}{file_ext}"
    file_path = f"{upload_dir}/{saved_filename}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return file_path

@router.post("/process")
def process_single_image(
    file: UploadFile = File(...), 
    action: str = Form(...), 
    params: Optional[str] = Form(None)
):
    from worker import celery_app
    file_path = save_upload(file)
    parsed_params = json.loads(params) if params else {}
    task = celery_app.send_task("process_image", args=[file_path, action, parsed_params])
    return {"task_id": task.id, "status": "queued", "original_filename": file.filename}

@router.post("/batch-process")
def process_multiple_images(
    files: List[UploadFile] = File(...),
    action: str = Form("convert"),
    params: Optional[str] = Form(None)
):
    from worker import celery_app
    task_ids = []
    parsed_params = json.loads(params) if params else {}
    for file in files:
        file_path = save_upload(file)
        task = celery_app.send_task("process_image", args=[file_path, action, parsed_params])
        task_ids.append({"task_id": task.id, "filename": file.filename})
    return {"tasks": task_ids, "status": "queued"}

@router.post("/ocr")
def ocr_image(file: UploadFile = File(...), lang: str = Form("eng")):
    from worker import celery_app
    file_path = save_upload(file)
    task = celery_app.send_task("ocr_image", args=[file_path, lang])
    return {"task_id": task.id, "status": "queued", "original_filename": file.filename}

@router.post("/remove-bg")
def remove_background(file: UploadFile = File(...)):
    from worker import celery_app
    file_path = save_upload(file)
    task = celery_app.send_task("process_image", args=[file_path, "remove_bg", {"format": "PNG"}])
    return {"task_id": task.id, "status": "queued", "original_filename": file.filename}
