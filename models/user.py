"""
User model - represents a user in the database.

In C terms, this is like defining a struct that maps directly to a database table.
Each instance of User = one row in the "users" table.
"""
from datetime import datetime
from sqlalchemy import String, DateTime, Float, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship

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
    
    # ===== VERIFICATION FIELDS =====
    # These track whether the user has proven they're a student.
    # For now we ignore these (allow everyone), but the schema is ready.
    
    # Has the user completed verification? (can they fully use the app?)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    
    # How did they verify? 'email' = clicked link, 'document' = uploaded student ID
    verification_method: Mapped[str | None] = mapped_column(String(20), nullable=True)
    
    # Status of their verification: 'pending', 'approved', 'rejected'
    # For email: goes straight to 'approved' when they click link
    # For document: starts 'pending', admin manually approves/rejects
    verification_status: Mapped[str | None] = mapped_column(String(20), nullable=True)
    
    # S3 URL of uploaded student ID image (if verification_method='document')
    student_id_image_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    
    # When they verified via email (clicked the link)
    email_verified_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    
    # When the account was created
    created_at: Mapped[datetime] = mapped_column(
        DateTime, 
        default=datetime.utcnow  # Automatically set to current time
    )

    # Listings this user has posted for sale.
    listings: Mapped[list["Listing"]] = relationship(back_populates="seller")

    # Listings this user has saved/favorited.
    saved_listings: Mapped[list["Listing"]] = relationship(
        secondary="listing_saves",
        back_populates="saved_by",
    )

    def __repr__(self) -> str:
        """String representation for debugging (like printf for objects)"""
        return f"<User {self.username} ({self.email})>"
