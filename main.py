from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import settings
from database import engine, Base
from models import User, Listing, ListingSave  # Import models so they're registered with Base
from routes.auth import router as auth_router
from routes.listings import router as listings_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager - runs code on startup and shutdown.
    
    The 'async with' pattern is like C's:
        setup();
        // ... app runs ...
        teardown();
    
    'yield' marks where the app runs between startup and shutdown.
    """
    # Startup: create database tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    yield  # App runs here
    
    # Shutdown: close database connections
    await engine.dispose()


# Create the FastAPI application
# The @app.get() decorator below registers a route handler (like registering
# a callback function for a specific URL path)
app = FastAPI(
    title="Student Swap API",
    description="Campus-to-campus peer-to-peer marketplace",
    version="0.1.0",
    lifespan=lifespan,
)

# CORS middleware - allows frontend on different port to call our API
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount routers - this adds all the /auth/* routes
app.include_router(auth_router)
app.include_router(listings_router)


@app.get("/")
async def home():
    """
    Health check endpoint.
    Returns a simple message to confirm the API is running.
    """
    return "Student Swap API is running! Hi Mk "
