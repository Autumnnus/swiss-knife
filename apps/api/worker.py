from celery import Celery
from core.config import settings
from services.youtube_service import youtube_service
from services.media_service import media_service
from services.image_service import image_service

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
    result = youtube_service.download_video(url, format, quality)
    return result

@celery_app.task(name="convert_media", bind=True)
def convert_media_task(self, input_path: str, target_format: str):
    self.update_state(state='PROCESSING', meta={'step': 'converting'})
    try:
        result = media_service.convert_file(input_path, target_format)
        return result
    finally:
        if os.path.exists(input_path):
            os.remove(input_path)

@celery_app.task(name="process_image", bind=True)
def process_image_task(self, input_path: str, action: str, params: dict):
    self.update_state(state='PROCESSING', meta={'step': action})
    try:
        result = image_service.process_image(input_path, action, params)
        return result
    finally:
        if os.path.exists(input_path):
            os.remove(input_path)

@celery_app.task(name="ocr_image", bind=True)
def ocr_image_task(self, input_path: str, lang: str):
    self.update_state(state='PROCESSING', meta={'step': 'ocr'})
    try:
        result = image_service.extract_text(input_path, lang)
        return result
    finally:
        if os.path.exists(input_path):
            os.remove(input_path)

@celery_app.task(name="compress_media", bind=True)
def compress_media_task(self, input_path: str, crf: int):
    self.update_state(state='PROCESSING', meta={'step': 'compressing'})
    try:
        result = media_service.compress_video(input_path, crf)
        return result
    finally:
        if os.path.exists(input_path):
            os.remove(input_path)

@celery_app.task(name="cut_media", bind=True)
def cut_media_task(self, input_path: str, start_time: str, end_time: str):
    self.update_state(state='PROCESSING', meta={'step': 'cutting'})
    try:
        result = media_service.cut_video(input_path, start_time, end_time)
        return result
    finally:
        if os.path.exists(input_path):
            os.remove(input_path)

@celery_app.task(name="create_gif", bind=True)
def create_gif_task(self, input_path: str, fps: int, width: int):
    self.update_state(state='PROCESSING', meta={'step': 'creating_gif'})
    try:
        result = media_service.create_gif(input_path, fps, width)
        return result
    finally:
        if os.path.exists(input_path):
            os.remove(input_path)
