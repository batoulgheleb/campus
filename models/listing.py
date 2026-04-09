"""
Listing models - marketplace listings and saved-listing relation table.
"""
from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, JSON, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base

if TYPE_CHECKING:
    from models.user import User


class Listing(Base):
    """SQLAlchemy ORM model for items listed in the marketplace."""

    __tablename__ = "listings"

    id: Mapped[int] = mapped_column(primary_key=True)
    seller_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)

    title: Mapped[str] = mapped_column(String(200), index=True)
    description: Mapped[str] = mapped_column(String(2000))
    price: Mapped[float] = mapped_column(Float)
    category: Mapped[str] = mapped_column(String(100), index=True)
    condition: Mapped[str] = mapped_column(String(50), index=True)

    size: Mapped[str | None] = mapped_column(String(20), nullable=True)
    color: Mapped[str | None] = mapped_column(String(50), nullable=True)
    location: Mapped[str | None] = mapped_column(String(255), nullable=True)
    images: Mapped[list[str]] = mapped_column(JSON, default=list)

    is_active: Mapped[bool] = mapped_column(Boolean, default=True, index=True)
    likes: Mapped[int] = mapped_column(Integer, default=0)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )

    seller: Mapped["User"] = relationship(back_populates="listings")
    saved_by: Mapped[list["User"]] = relationship(
        secondary="listing_saves",
        back_populates="saved_listings",
    )


class ListingSave(Base):
    """Join table tracking which users saved which listings."""

    __tablename__ = "listing_saves"

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), primary_key=True)
    listing_id: Mapped[int] = mapped_column(ForeignKey("listings.id"), primary_key=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
