"""
Auth routes - registration, login, and user info endpoints.

Routes are "thin" - they handle HTTP stuff (parsing requests, returning responses)
but delegate business logic to services or keep it minimal.

The @router.post() decorator is like registering a callback:
    "When someone POSTs to /auth/register, call this function"
"""
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from models.user import User
from schemas.auth import RegisterRequest, LoginRequest, TokenResponse
from schemas.user import UserResponse
from middleware.auth import hash_password, verify_password, create_access_token, get_current_user


# APIRouter groups related endpoints together
# prefix="/auth" means all routes here start with /auth
router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(
    request: RegisterRequest,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> User:
    """
    Register a new user account.
    
    1. Check if email/username already exists
    2. Hash the password (never store plain text!)
    3. Create the user in database
    4. Return the created user (without password)
    
    response_model=UserResponse tells FastAPI to:
    - Filter the response to only include UserResponse fields
    - Generate correct OpenAPI docs
    """
    # Check if email already registered
    result = await db.execute(select(User).where(User.email == request.email))
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Check if username taken
    result = await db.execute(select(User).where(User.username == request.username))
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken"
        )
    
    # Create new user with hashed password
    user = User(
        email=request.email,
        username=request.username,
        password_hash=hash_password(request.password),
        university=request.university,
    )
    
    db.add(user)
    await db.commit()
    await db.refresh(user)  # Reload to get the auto-generated ID
    
    return user


@router.post("/login", response_model=TokenResponse)
async def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> TokenResponse:
    """
    Log in and get an access token.
    
    We use OAuth2PasswordRequestForm which expects form data with:
    - username (we use email here)
    - password
    
    This format is required for Swagger UI's "Authorize" button to work.
    The "username" field contains the email address.
    
    Returns a JWT token the client stores and sends with future requests.
    """
    # Find user by email (form_data.username contains the email)
    result = await db.execute(select(User).where(User.email == form_data.username))
    user = result.scalar_one_or_none()
    
    # Check if user exists and password is correct
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create and return the access token
    access_token = create_access_token(user.id)
    return TokenResponse(access_token=access_token)


@router.get("/me", response_model=UserResponse)
async def get_me(
    current_user: Annotated[User, Depends(get_current_user)],
) -> User:
    """
    Get the current logged-in user's info.
    
    This is a PROTECTED route - requires a valid JWT token.
    
    The magic happens in Depends(get_current_user):
    1. Extracts token from Authorization header
    2. Validates and decodes the JWT
    3. Loads the user from database
    4. Passes the User object to this function
    
    If the token is missing/invalid, returns 401 before this code runs.
    """
    return current_user
