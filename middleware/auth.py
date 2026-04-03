"""
Auth middleware - JWT token verification.

This module handles:
1. Extracting the JWT token from request headers
2. Decoding and validating the token
3. Loading the user from the database

FastAPI "dependencies" are like middleware in Express or decorators in Flask.
They run before your route handler and can inject data (like the current user).
"""
from datetime import datetime, timedelta
from typing import Annotated

import bcrypt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from config import settings
from database import get_db
from models.user import User


# OAuth2PasswordBearer tells FastAPI where to look for the token
# It expects: Authorization: Bearer <token> in request headers
# tokenUrl is the endpoint where clients get tokens (for Swagger UI)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def hash_password(password: str) -> str:
    """
    Hash a plain text password using bcrypt.
    
    Never store plain passwords! This creates a one-way hash.
    Even if the database is stolen, attackers can't reverse the hash.
    """
    password_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password_bytes, salt).decode('utf-8')


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Check if a plain password matches the stored hash.
    
    Returns True if they match, False otherwise.
    """
    password_bytes = plain_password.encode('utf-8')
    hash_bytes = hashed_password.encode('utf-8')
    return bcrypt.checkpw(password_bytes, hash_bytes)


def create_access_token(user_id: int) -> str:
    """
    Create a JWT (JSON Web Token) for a user.
    
    The token contains:
    - sub (subject): the user's ID
    - exp (expiration): when the token expires
    
    The token is cryptographically signed with JWT_SECRET, so we can
    verify it wasn't tampered with when the client sends it back.
    """
    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    # The payload is the data stored inside the token
    payload = {
        "sub": str(user_id),  # Subject = user ID
        "exp": expire,         # Expiration time
    }
    
    # Sign the token with our secret key
    token = jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
    return token


async def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> User:
    """
    FastAPI dependency that extracts and validates the current user.
    
    This is used in route handlers like:
        @app.get("/auth/me")
        async def get_me(user: User = Depends(get_current_user)):
            return user
    
    The Depends() system:
    1. Extracts the token from Authorization header (oauth2_scheme)
    2. Gets a database session (get_db)
    3. Runs this function to validate and load the user
    4. Passes the User object to your route handler
    
    If anything fails, raises HTTPException (returns 401 to client).
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        # Decode the JWT token
        payload = jwt.decode(
            token, 
            settings.JWT_SECRET, 
            algorithms=[settings.JWT_ALGORITHM]
        )
        
        # Extract user ID from token payload
        user_id_str: str | None = payload.get("sub")
        if user_id_str is None:
            raise credentials_exception
            
        user_id = int(user_id_str)
        
    except JWTError:
        # Token is invalid, expired, or tampered with
        raise credentials_exception
    
    # Load the user from database
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    
    if user is None:
        # User was deleted after token was issued
        raise credentials_exception
    
    return user
