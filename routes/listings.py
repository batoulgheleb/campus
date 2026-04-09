"""
Listing routes - CRUD, search/filter, and save/unsave endpoints.
"""
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy import and_, delete, desc, func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from database import get_db
from middleware.auth import get_current_user, get_current_user_optional
from models.listing import Listing, ListingSave
from models.user import User
from schemas.listing import (
    ListingCardResponse,
    ListingCreate,
    ListingDetailResponse,
    ListingListResponse,
    ListingUpdate,
    SaveListingResponse,
    SellerSummary,
)


router = APIRouter(prefix="/listings", tags=["Listings"])


def _normalize_condition(condition: str) -> str:
    """
    Normalize condition values so frontend can send either:
    - 'like new' or
    - 'like_new'
    """
    return condition.replace("_", " ").strip().lower()


async def _is_saved(db: AsyncSession, user_id: int, listing_id: int) -> bool:
    result = await db.execute(
        select(ListingSave).where(
            ListingSave.user_id == user_id,
            ListingSave.listing_id == listing_id,
        )
    )
    return result.scalar_one_or_none() is not None


def _to_seller_summary(user: User) -> SellerSummary:
    return SellerSummary(
        id=user.id,
        name=user.username,
        avatar=user.avatar_url,
        rating=user.rating,
    )


async def _to_card_response(
    db: AsyncSession,
    listing: Listing,
    current_user: User | None,
) -> ListingCardResponse:
    saved = False
    if current_user is not None:
        saved = await _is_saved(db, current_user.id, listing.id)

    spec_tag: str | None = None
    category_normalized = listing.category.strip().lower()
    if listing.size and (
        "clothing" in category_normalized
        or "shoes" in category_normalized
        or "sports" in category_normalized
    ):
        spec_tag = listing.size

    return ListingCardResponse(
        id=listing.id,
        title=listing.title,
        price=listing.price,
        category=listing.category,
        condition=listing.condition,
        spec_tag=spec_tag,
        image=listing.images[0] if listing.images else None,
        seller=_to_seller_summary(listing.seller),
        likes=listing.likes,
        saved=saved,
        sold=not listing.is_active,
        created_at=listing.created_at,
    )


@router.get("", response_model=ListingListResponse)
async def list_listings(
    db: Annotated[AsyncSession, Depends(get_db)],
    q: str | None = Query(default=None),
    category: str | None = Query(default=None),
    condition: list[str] | None = Query(default=None),
    min_price: float | None = Query(default=None, ge=0),
    max_price: float | None = Query(default=None, ge=0),
    sort: str = Query(default="newest"),
    limit: int = Query(default=20, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    current_user: Annotated[User | None, Depends(get_current_user_optional)] = None,
) -> ListingListResponse:
    filters = [Listing.is_active.is_(True)]

    if q:
        filters.append(Listing.title.ilike(f"%{q}%"))

    if category:
        filters.append(func.lower(Listing.category) == category.strip().lower())

    if condition:
        normalized_conditions = [_normalize_condition(c) for c in condition if c.strip()]
        if normalized_conditions and "any" not in normalized_conditions:
            condition_filters = [
                func.lower(Listing.condition) == normalized for normalized in normalized_conditions
            ]
            filters.append(or_(*condition_filters))

    if min_price is not None:
        filters.append(Listing.price >= min_price)

    if max_price is not None:
        filters.append(Listing.price <= max_price)

    base_query = select(Listing).where(and_(*filters)).options(selectinload(Listing.seller))
    count_query = select(func.count(Listing.id)).where(and_(*filters))

    if sort == "price_asc":
        base_query = base_query.order_by(Listing.price.asc(), Listing.created_at.desc())
    elif sort == "price_desc":
        base_query = base_query.order_by(Listing.price.desc(), Listing.created_at.desc())
    elif sort == "popularity":
        base_query = base_query.order_by(Listing.likes.desc(), Listing.created_at.desc())
    else:
        base_query = base_query.order_by(Listing.created_at.desc())

    base_query = base_query.limit(limit).offset(offset)

    listings_result = await db.execute(base_query)
    listings = listings_result.scalars().all()

    total_result = await db.execute(count_query)
    total = total_result.scalar_one()

    items: list[ListingCardResponse] = []
    for listing in listings:
        items.append(await _to_card_response(db, listing, current_user))

    return ListingListResponse(items=items, total=total, limit=limit, offset=offset)


@router.get("/{listing_id}", response_model=ListingDetailResponse)
async def get_listing(
    listing_id: int,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User | None, Depends(get_current_user_optional)] = None,
) -> ListingDetailResponse:
    result = await db.execute(
        select(Listing)
        .where(Listing.id == listing_id, Listing.is_active.is_(True))
        .options(selectinload(Listing.seller))
    )
    listing = result.scalar_one_or_none()
    if listing is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Listing not found")

    saved = False
    if current_user is not None:
        saved = await _is_saved(db, current_user.id, listing.id)

    return ListingDetailResponse(
        id=listing.id,
        title=listing.title,
        description=listing.description,
        price=listing.price,
        category=listing.category,
        condition=listing.condition,
        images=listing.images,
        size=listing.size,
        color=listing.color,
        location=listing.location,
        seller=_to_seller_summary(listing.seller),
        likes=listing.likes,
        saved=saved,
        is_active=listing.is_active,
        created_at=listing.created_at,
        updated_at=listing.updated_at,
    )


@router.get("/mine", response_model=ListingListResponse)
async def list_my_listings(
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
) -> ListingListResponse:
    base_query = (
        select(Listing)
        .where(Listing.seller_id == current_user.id)
        .options(selectinload(Listing.seller))
        .order_by(Listing.created_at.desc())
        .limit(limit)
        .offset(offset)
    )
    count_query = select(func.count(Listing.id)).where(Listing.seller_id == current_user.id)

    listings_result = await db.execute(base_query)
    listings = listings_result.scalars().all()

    total_result = await db.execute(count_query)
    total = total_result.scalar_one()

    items: list[ListingCardResponse] = []
    for listing in listings:
        items.append(await _to_card_response(db, listing, current_user))

    return ListingListResponse(items=items, total=total, limit=limit, offset=offset)


@router.post("", response_model=ListingDetailResponse, status_code=status.HTTP_201_CREATED)
async def create_listing(
    payload: ListingCreate,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> ListingDetailResponse:
    listing = Listing(
        seller_id=current_user.id,
        title=payload.title.strip(),
        description=payload.description.strip(),
        price=payload.price,
        category=payload.category.strip(),
        condition=payload.condition.strip(),
        images=payload.images,
        size=payload.size.strip() if payload.size else None,
        color=payload.color.strip() if payload.color else None,
        location=payload.location.strip() if payload.location else None,
    )
    db.add(listing)
    await db.commit()
    await db.refresh(listing)
    await db.refresh(current_user)

    return ListingDetailResponse(
        id=listing.id,
        title=listing.title,
        description=listing.description,
        price=listing.price,
        category=listing.category,
        condition=listing.condition,
        images=listing.images,
        size=listing.size,
        color=listing.color,
        location=listing.location,
        seller=_to_seller_summary(current_user),
        likes=listing.likes,
        saved=False,
        is_active=listing.is_active,
        created_at=listing.created_at,
        updated_at=listing.updated_at,
    )


@router.patch("/{listing_id}", response_model=ListingDetailResponse)
async def update_listing(
    listing_id: int,
    payload: ListingUpdate,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> ListingDetailResponse:
    result = await db.execute(
        select(Listing)
        .where(Listing.id == listing_id)
        .options(selectinload(Listing.seller))
    )
    listing = result.scalar_one_or_none()
    if listing is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Listing not found")

    if listing.seller_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not your listing")

    updates = payload.model_dump(exclude_unset=True)
    for field, value in updates.items():
        if isinstance(value, str):
            value = value.strip()
        setattr(listing, field, value)

    await db.commit()
    await db.refresh(listing)
    await db.refresh(current_user)

    saved = await _is_saved(db, current_user.id, listing.id)
    return ListingDetailResponse(
        id=listing.id,
        title=listing.title,
        description=listing.description,
        price=listing.price,
        category=listing.category,
        condition=listing.condition,
        images=listing.images,
        size=listing.size,
        color=listing.color,
        location=listing.location,
        seller=_to_seller_summary(current_user),
        likes=listing.likes,
        saved=saved,
        is_active=listing.is_active,
        created_at=listing.created_at,
        updated_at=listing.updated_at,
    )


@router.delete("/{listing_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_listing(
    listing_id: int,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> Response:
    result = await db.execute(select(Listing).where(Listing.id == listing_id))
    listing = result.scalar_one_or_none()
    if listing is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Listing not found")

    if listing.seller_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not your listing")

    listing.is_active = False
    await db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post("/{listing_id}/mark-sold", response_model=ListingDetailResponse)
async def mark_listing_as_sold(
    listing_id: int,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> ListingDetailResponse:
    result = await db.execute(
        select(Listing)
        .where(Listing.id == listing_id)
        .options(selectinload(Listing.seller))
    )
    listing = result.scalar_one_or_none()
    if listing is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Listing not found")

    if listing.seller_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not your listing")

    listing.is_active = False
    await db.commit()
    await db.refresh(listing)

    saved = await _is_saved(db, current_user.id, listing.id)
    return ListingDetailResponse(
        id=listing.id,
        title=listing.title,
        description=listing.description,
        price=listing.price,
        category=listing.category,
        condition=listing.condition,
        images=listing.images,
        size=listing.size,
        color=listing.color,
        location=listing.location,
        seller=_to_seller_summary(listing.seller),
        likes=listing.likes,
        saved=saved,
        is_active=listing.is_active,
        created_at=listing.created_at,
        updated_at=listing.updated_at,
    )


@router.post("/{listing_id}/save", response_model=SaveListingResponse)
async def toggle_save_listing(
    listing_id: int,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> SaveListingResponse:
    listing_result = await db.execute(select(Listing).where(Listing.id == listing_id, Listing.is_active.is_(True)))
    listing = listing_result.scalar_one_or_none()
    if listing is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Listing not found")

    save_result = await db.execute(
        select(ListingSave).where(
            ListingSave.user_id == current_user.id,
            ListingSave.listing_id == listing_id,
        )
    )
    existing = save_result.scalar_one_or_none()

    if existing:
        await db.delete(existing)
        listing.likes = max(0, listing.likes - 1)
        saved = False
    else:
        db.add(ListingSave(user_id=current_user.id, listing_id=listing_id))
        listing.likes += 1
        saved = True

    await db.commit()
    await db.refresh(listing)
    return SaveListingResponse(saved=saved, likes=listing.likes)


@router.get("/{listing_id}/similar", response_model=ListingListResponse)
async def get_similar_listings(
    listing_id: int,
    db: Annotated[AsyncSession, Depends(get_db)],
    limit: int = Query(default=12, ge=1, le=50),
    current_user: Annotated[User | None, Depends(get_current_user_optional)] = None,
) -> ListingListResponse:
    base_result = await db.execute(select(Listing).where(Listing.id == listing_id, Listing.is_active.is_(True)))
    base_listing = base_result.scalar_one_or_none()
    if base_listing is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Listing not found")

    similar_result = await db.execute(
        select(Listing)
        .where(
            Listing.is_active.is_(True),
            Listing.id != listing_id,
            Listing.category == base_listing.category,
        )
        .options(selectinload(Listing.seller))
        .order_by(desc(Listing.created_at))
        .limit(limit)
    )
    listings = similar_result.scalars().all()

    items: list[ListingCardResponse] = []
    for listing in listings:
        items.append(await _to_card_response(db, listing, current_user))

    return ListingListResponse(items=items, total=len(items), limit=limit, offset=0)
