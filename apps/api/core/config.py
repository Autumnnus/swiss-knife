from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "SwissKnife API"
    API_V1_STR: str = "/api/v1"
    
    # Redis & Celery
    REDIS_URL: str = "redis://localhost:6379/1"
    CELERY_BROKER_URL: str = "redis://localhost:6379/0"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/0"
    STORAGE_PATH: str = "./storage"

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
