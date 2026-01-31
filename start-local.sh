#!/bin/bash

# Define colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Starting SwissKnife Local Development Environment...${NC}"

# 1. Start Redis (if not running)
if ! pgrep -x "redis-server" > /dev/null
then
    echo -e "${GREEN}Starting Redis...${NC}"
    redis-server --daemonize yes
else
    echo -e "${BLUE}Redis is already running.${NC}"
fi

# 2. Setup Python environment
echo -e "${GREEN}Setting up Python environment...${NC}"
cd apps/api
if [ ! -d ".venv" ]; then
    python3 -m venv .venv
fi
source .venv/bin/activate
pip install -r requirements.txt

# 3. Start Backend API
echo -e "${GREEN}Starting FastAPI...${NC}"
uvicorn main:app --host 0.0.0.0 --port 8000 --reload &
API_PID=$!

# 4. Start Celery Worker
echo -e "${GREEN}Starting Celery Worker...${NC}"
celery -A worker.celery_app worker --loglevel=info &
WORKER_PID=$!

# 5. Setup and Start Frontend
echo -e "${GREEN}Starting Frontend...${NC}"
cd ../web
npm install
npm run dev &
WEB_PID=$!

echo -e "${BLUE}All systems started!${NC}"
echo -e "API: http://localhost:8000"
echo -e "Web: http://localhost:3000"
echo -e "Press Ctrl+C to stop all services."

# Trap SIGINT (Ctrl+C) to kill background processes
trap "kill $API_PID $WORKER_PID $WEB_PID; exit" SIGINT

wait
