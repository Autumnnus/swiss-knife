from celery import Celery
from core.config import settings
from services.youtube_service import youtube_service
from services.media_service import media_service

celery_app = Celery(
    "worker",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
)

@celery_app.task(name="download_youtube", bind=True)
def download_youtube_task(self, url: str, format: str, quality: str):
    self.update_state(state='PROCESSING', meta={'step': 'downloading'})
    try:
        result = youtube_service.download_video(url, format, quality)
        return result
    except Exception as e:
        self.update_state(state='FAILURE', meta={'error': str(e)})
        raise e

@celery_app.task(name="convert_media", bind=True)
def convert_media_task(self, input_path: str, target_format: str):
    self.update_state(state='PROCESSING', meta={'step': 'converting'})
    try:
        result = media_service.convert_file(input_path, target_format)
        return result
    except Exception as e:
        self.update_state(state='FAILURE', meta={'error': str(e)})
        raise e
