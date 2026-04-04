"""
User schemas - Pydantic models for user data in responses.

These control what user data we expose in API responses.
We NEVER include password_hash in responses - that stays in the DB only.
"""
from datetime import datetime
from pydantic import BaseModel, EmailStr


class UserResponse(BaseModel):
    """
    User data returned in API responses.
    
    Notice: no password field! We never send password hashes to clients.
    
    model_config with from_attributes=True tells Pydantic it can read
    data directly from SQLAlchemy model attributes (like user.email).
    """
    id: int
    email: EmailStr
    username: str
    university: str
    avatar_url: str | None
    rating: float
    carbon_saved: float
    is_verified: bool
    verification_method: str | None
    verification_status: str | None
    created_at: datetime

    model_config = {"from_attributes": True}
