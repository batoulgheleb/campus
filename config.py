from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables.
    Pydantic Settings automatically reads from .env file and environment.
    
    Similar to a C struct, but with automatic type conversion and validation.
    """
    
    # Database
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/studentswap"
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379"
    
    # JWT Auth
    JWT_SECRET: str = "change-me-in-production"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # Stripe (for later)
    STRIPE_SECRET_KEY: str = ""
    STRIPE_WEBHOOK_SECRET: str = ""
    STRIPE_PLATFORM_FEE_PERCENT: int = 4
    
    # AWS S3 (for later)
    AWS_ACCESS_KEY_ID: str = ""
    AWS_SECRET_ACCESS_KEY: str = ""
    S3_BUCKET_NAME: str = "studentswap-images"
    S3_REGION: str = "eu-west-2"
    
    # Frontend
    FRONTEND_URL: str = "http://localhost:3000"
    
    # This tells Pydantic to read from a .env file
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


# Single instance used throughout the app (like a global in C)
settings = Settings()
