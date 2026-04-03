"""
User model - represents a user in the database.

In C terms, this is like defining a struct that maps directly to a database table.
Each instance of User = one row in the "users" table.
"""
from datetime import datetime
from sqlalchemy import String, DateTime, Float
from sqlalchemy.orm import Mapped, mapped_column

from database import Base


class User(Base):
    """
    SQLAlchemy ORM model for the users table.
    
    The __tablename__ tells SQLAlchemy what to name the table in PostgreSQL.
    Each attribute with Mapped[] becomes a column in that table.
    """
    __tablename__ = "users"

    # Primary key - unique identifier for each user
    # Similar to: struct User { int id; ... } but auto-generated
    id: Mapped[int] = mapped_column(primary_key=True)
    
    # User's email - must be unique, used for login
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    
    # Username - displayed publicly
    username: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    
    # Password hash - NEVER store plain text passwords!
    # We store the bcrypt hash, not the actual password
    password_hash: Mapped[str] = mapped_column(String(255))
    
    # University name (e.g., "University of Manchester")
    university: Mapped[str] = mapped_column(String(255))
    
    # Optional profile picture URL
    avatar_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    
    # User's rating (average from reviews, starts at 0)
    rating: Mapped[float] = mapped_column(Float, default=0.0)
    
    # Environmental impact tracking (kg of CO2 saved by buying used)
    carbon_saved: Mapped[float] = mapped_column(Float, default=0.0)
    
    # When the account was created
    created_at: Mapped[datetime] = mapped_column(
        DateTime, 
        default=datetime.utcnow  # Automatically set to current time
    )

    def __repr__(self) -> str:
        """String representation for debugging (like printf for objects)"""
        return f"<User {self.username} ({self.email})>"
