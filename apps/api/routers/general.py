from fastapi import APIRouter, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
from celery.result import AsyncResult
from core.config import settings
from worker import celery_app
import os

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

def remove_file(path: str):
    """Background task to remove file after download"""
    try:
        if os.path.exists(path):
            os.remove(path)
            # Also try to remove the source upload if it exists
            # This is a bit tricky as we don't always have the input path here
    except Exception:
        pass

@router.get("/download/{filename}")
def download_file(filename: str, background_tasks: BackgroundTasks):
    file_path = os.path.join(f"{settings.STORAGE_PATH}/downloads", filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    
    background_tasks.add_task(remove_file, file_path)
    return FileResponse(file_path, filename=filename)

