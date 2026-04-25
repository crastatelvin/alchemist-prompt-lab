# ALCHEMIST Prompt Engineering Lab

ALCHEMIST is a prompt engineering laboratory for running single and A/B prompt experiments with weighted scoring, technique templates, and analytics.

## Stack
- Backend: FastAPI + SQLAlchemy + Groq API wrapper
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
alembic upgrade head
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```

## Environment
- `GROQ_API_KEY`: Groq API key
- `GROQ_MODEL`: Groq model name
- `API_KEY`: API key used by backend routes
- `APP_ENV`: `development` or `production`
- `DB_URL`: SQLAlchemy URL (default SQLite)
- `CORS_ORIGINS`: comma-separated allowlist
  - Example: `http://localhost:5173,http://127.0.0.1:5173`

## Docker
```bash
cp backend/.env.example backend/.env
docker compose up --build
```

## Database Migrations
```bash
cd backend
alembic upgrade head
```

## Observability
- Request logs include a request correlation ID.
- Send your own header `x-request-id` or let the backend generate one.
- Response echoes `x-request-id` for traceability.

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

## Handoff Traceability
- Prompt execution/scoring pipeline: `backend/app/services/`
- A/B orchestration and progress events: `backend/app/services/experiment_runner.py`
- Typed API validation and security: `backend/app/db/schemas.py`, `backend/app/core/security.py`
- Persistence and migrations: `backend/app/db/`, `backend/alembic/`
- Frontend lab workflow and dashboards: `frontend/src/pages/LabPage.jsx` and `frontend/src/components/`
