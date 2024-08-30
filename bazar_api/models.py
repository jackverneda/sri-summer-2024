from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Float, JSON, DateTime, func
from sqlalchemy.orm import relationship

from .database import Base


class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)

    purchases = relationship("Purchase", back_populates="user")


class Product(Base):
    __tablename__ = "products"

    parent_asin = Column(String, primary_key=True)
    title = Column(String, index=True)
    # description = Column(String, index=True)
    # owner_id = Column(Integer, ForeignKey("users.user_id"))
    main_category = Column(String, index=True)
    average_rating = Column(Float, index=True)
    rating_number = Column(Float, index=True)
    features = Column(JSON, index=True)
    description = Column(JSON, index=True)
    price = Column(Float, index=True)
    images = Column(JSON, index=True)
    videos = Column(JSON, index=True)
    store = Column(String, index=True)
    categories = Column(JSON, index=True)
    details = Column(JSON, index=True)
    bought_together = Column(JSON, index=True)

    # buyers = relationship("User", back_populates="purchase")

class Purchase(Base):
    __tablename__ = "purchases"

    purchase_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.user_id'))
    parent_asin = Column(String, ForeignKey('products.parent_asin'))
    purchase_timestamp = Column(DateTime, default=func.now())

    user = relationship("User", back_populates="purchases")

class Embedding(Base):
    __tablename__ = "embeddings"

    parent_asin = Column(String, ForeignKey('product.parent_asin'))
    index = Column(Integer,primary_key=True, index=True)
    embedding = Column(JSON)