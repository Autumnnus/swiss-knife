---
description: Run SwissKnife locally without Docker
---

To run the application locally on your Mac, follow these steps:

1. **Install System Dependencies** (if not already installed):

```bash
brew install ffmpeg tesseract tesseract-lang redis
```

2. **Run the Local Startup Script**:
   // turbo

```bash
./start-local.sh
```

This script will:

- Start **Redis** in the background.
- Create a Python **virtual environment** and install requirements.
- Start the **FastAPI** server.
- Start the **Celery worker**.
- Install frontend dependencies and start the **Next.js** dev server.

3. **Access the Application**:

- Frontend: `http://localhost:3000`
- Backend API Docs: `http://localhost:8000/docs`

4. **Stop the Application**:
   Simply press `Ctrl+C` in the terminal where the script is running to stop all services.

**Note**: All processed files will be stored in `apps/api/storage` instead of the Docker volume.
