import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    app_name: str = "ALCHEMIST Prompt Engineering Lab"
    app_env: str = os.getenv("APP_ENV", "development")
    gemini_api_key: str = os.getenv("GEMINI_API_KEY", "")
    api_key: str = os.getenv("API_KEY", "")
    db_url: str = os.getenv("DB_URL", "sqlite:///./alchemist.db")
    cors_origins: list[str] = [
        origin.strip()
        for origin in os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
        if origin.strip()
    ]
    request_limit_per_minute: str = "30/minute"


settings = Settings()
