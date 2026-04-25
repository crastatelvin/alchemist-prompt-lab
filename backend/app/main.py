from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from starlette.responses import JSONResponse

from app.api.routes import limiter, router
from app.core.config import settings
from app.core.logging_utils import RequestContextMiddleware, configure_logging
from app.db.database import Base, engine

Base.metadata.create_all(bind=engine)
configure_logging()

app = FastAPI(title=settings.app_name)
app.state.limiter = limiter
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(SlowAPIMiddleware)
app.add_middleware(RequestContextMiddleware)
app.include_router(router)


@app.exception_handler(RateLimitExceeded)
async def ratelimit_handler(request, exc):
    return JSONResponse({"error": "Rate limit exceeded"}, status_code=429)
