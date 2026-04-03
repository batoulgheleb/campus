"""
Auth schemas - Pydantic models for authentication requests/responses.

Pydantic models are like C structs with automatic validation.
When a request comes in, FastAPI uses these to:
1. Parse the JSON body
2. Validate all fields (correct types, constraints)
3. Return helpful error messages if validation fails
"""
from pydantic import BaseModel, EmailStr, Field


class RegisterRequest(BaseModel):
    """
    What the client sends when registering a new account.
    
    Field() lets us add constraints - like assert() in C but automatic.
    EmailStr is a special type that validates email format.
    """
    email: EmailStr  # Must be valid email format
    username: str = Field(min_length=3, max_length=50)  # 3-50 chars
    password: str = Field(min_length=8)  # At least 8 chars
    university: str = Field(min_length=2, max_length=255)


class LoginRequest(BaseModel):
    """What the client sends when logging in."""
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    """
    What we return after successful login.
    
    The access_token is a JWT (JSON Web Token) - a signed string that
    contains the user's ID. The client stores this and sends it with
    every request to prove they're logged in.
    """
    access_token: str
    token_type: str = "bearer"  # Standard OAuth2 token type
