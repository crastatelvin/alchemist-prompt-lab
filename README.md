# ALCHEMIST Prompt Engineering Lab

ALCHEMIST is a prompt engineering laboratory for running single and A/B prompt experiments with weighted scoring, technique templates, and analytics.

## Stack
- Backend: FastAPI + SQLAlchemy + Gemini API wrapper
- Frontend: React + Vite
- Data: SQLite
- CI: GitHub Actions
- DevOps: Docker + docker-compose

## Quick Start

### Backend
```bash
cd backend
cp .env.example .env
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```

## Environment
- `GEMINI_API_KEY`: Gemini API key
- `API_KEY`: API key used by backend routes
- `APP_ENV`: `development` or `production`
- `DB_URL`: SQLAlchemy URL (default SQLite)
- `CORS_ORIGINS`: comma-separated allowlist

## Docker
```bash
cp backend/.env.example backend/.env
docker compose up --build
```

## API
- `GET /`
- `GET /health`
- `GET /ready`
- `POST /run`
- `GET /experiments`
- `GET /stats`
- `GET /techniques`
- `GET /techniques/{id}`
- `WS /ws`
