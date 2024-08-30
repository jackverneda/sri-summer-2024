from pydantic import BaseModel
from datetime import datetime

class ProductBase(BaseModel):
    title: str
    description: list[str] | str | None = None
    rating_number: float
    average_rating: float
    price: float | None = None
    images: list[dict]


class ProductCreate(ProductBase):
    pass


class Product(ProductBase):
    parent_asin: str
    details: dict
    # buyers: list[int] = []

    class Config:
        orm_mode = True


class UserBase(BaseModel):
    email: str


class UserCreate(UserBase):
    password: str


class User(UserBase):
    user_id: int
    # purchase: list[Product] = []

    class Config:
        orm_mode = True

class PurchaseBase(BaseModel):
    user_id: int
    parent_asin: str

class PurchaseCreate(PurchaseBase):
    pass

class Purchase(PurchaseBase):
    purchase_id: int
    purchase_timestamp: datetime

    class Config:
        orm_mode = True