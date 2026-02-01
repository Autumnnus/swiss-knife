from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.config import settings
from routers import general, visual, media, text

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set all CORS enabled origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(general.router, prefix=settings.API_V1_STR, tags=["general"])
app.include_router(media.router, prefix=f"{settings.API_V1_STR}/media", tags=["media"])
app.include_router(visual.router, prefix=f"{settings.API_V1_STR}/visual", tags=["visual"])
app.include_router(text.router, prefix=f"{settings.API_V1_STR}/text", tags=["text"])

@app.get("/")
def root():
    return {"message": "Welcome to SwissKnife API", "docs": "/docs"}