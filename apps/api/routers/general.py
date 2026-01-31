import os
from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from celery.result import AsyncResult
from core.config import settings
from worker import celery_app

router = APIRouter()

@router.get("/health")
def health_check():
    return {
        "status": "healthy",
        "project": settings.PROJECT_NAME,
        "version": "1.0.0"
    }

@router.get("/ping-celery")
def ping_celery():
    # Submit a simple task
    task = celery_app.send_task("test_task", args=["hello world"])
    return {"task_id": task.id, "status": "submitted"}

@router.get("/tasks/{task_id}")
def get_task_status(task_id: str):
    task_result = AsyncResult(task_id, app=celery_app)
    
    # Use .info instead of .result to avoid exception deserialization issues
    info = task_result.info
    result = None
    error = None
    step = None

    if task_result.status == "SUCCESS":
        result = info
    elif task_result.status == "FAILURE":
        error = str(info)
    elif isinstance(info, dict):
        # This handles custom states like 'PROCESSING' with metadata
        step = info.get("step")
        result = info.get("result")
        if not error:
            error = info.get("error")

    return {
        "task_id": task_id,
        "status": task_result.status,
        "result": result,
        "error": error,
        "step": step
    }

@router.get("/download/{filename}")
def download_file(filename: str):
    file_path = os.path.join(f"{settings.STORAGE_PATH}/downloads", filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(file_path, filename=filename)

@router.get("/downloads")
def list_downloads():
    download_dir = f"{settings.STORAGE_PATH}/downloads"
    if not os.path.exists(download_dir):
        return []
    
    files = []
    for f in os.listdir(download_dir):
        if os.path.isfile(os.path.join(download_dir, f)) and not f.startswith('.'):
            stats = os.stat(os.path.join(download_dir, f))
            files.append({
                "filename": f,
                "size": stats.st_size,
                "created_at": stats.st_ctime
            })
    
    # Sort by created_at descending
    files.sort(key=lambda x: x['created_at'], reverse=True)
    return files

