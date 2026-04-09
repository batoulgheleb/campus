"""
Listing schemas - request/response models for listing APIs.
"""
from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


SortOption = Literal["newest", "price_asc", "price_desc", "popularity"]


class SellerSummary(BaseModel):
    id: int
    name: str
    avatar: str | None = None
    rating: float


class ListingCreate(BaseModel):
    title: str = Field(min_length=3, max_length=200)
    description: str = Field(min_length=10, max_length=2000)
    price: float = Field(gt=0)
    category: str = Field(min_length=2, max_length=100)
    condition: str = Field(min_length=2, max_length=50)
    images: list[str] = Field(min_length=1, max_length=10)
    size: str | None = Field(default=None, max_length=20)
    color: str | None = Field(default=None, max_length=50)
    location: str | None = Field(default=None, max_length=255)


class ListingUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=3, max_length=200)
    description: str | None = Field(default=None, min_length=10, max_length=2000)
    price: float | None = Field(default=None, gt=0)
    category: str | None = Field(default=None, min_length=2, max_length=100)
    condition: str | None = Field(default=None, min_length=2, max_length=50)
    images: list[str] | None = Field(default=None, min_length=1, max_length=10)
    size: str | None = Field(default=None, max_length=20)
    color: str | None = Field(default=None, max_length=50)
    location: str | None = Field(default=None, max_length=255)
    is_active: bool | None = None


class ListingCardResponse(BaseModel):
    id: int
    title: str
    price: float
    category: str
    condition: str
    spec_tag: str | None = None
    image: str | None
    seller: SellerSummary
    likes: int
    saved: bool
    sold: bool = False
    created_at: datetime


class ListingDetailResponse(BaseModel):
    id: int
    title: str
    description: str
    price: float
    category: str
    condition: str
    images: list[str]
    size: str | None
    color: str | None
    location: str | None
    seller: SellerSummary
    likes: int
    saved: bool
    is_active: bool
    created_at: datetime
    updated_at: datetime


class ListingListResponse(BaseModel):
    items: list[ListingCardResponse]
    total: int
    limit: int
    offset: int


class SaveListingResponse(BaseModel):
    saved: bool
    likes: int
