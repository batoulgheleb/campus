from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase

from config import settings


# Async engine for PostgreSQL (uses asyncpg driver under the hood)
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=True,  # Log SQL queries (disable in production)
)

# Session factory - creates new database sessions
# Similar to a connection pool in C database libraries
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


class Base(DeclarativeBase):
    """
    Base class for all ORM models.
    Every model (User, Listing, etc.) will inherit from this.
    Similar to a base struct that all other structs extend.
    """
    pass


async def get_db():
    """
    Dependency that provides a database session to route handlers.
    
    This is a Python generator (yield keyword). FastAPI calls it before
    each request to get a session, then closes it after the response.
    
    Similar to:
        db = open_connection();
        handle_request(db);
        close_connection(db);
    But the yield makes cleanup automatic even if an error occurs.
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
