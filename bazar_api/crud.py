from sqlalchemy.orm import Session

from . import models, schemas


def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.user_id == user_id).first()


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()


def get_items(db: Session, skip: int = 0, limit: int = 100):
    print('\n\n\n',' pidiendo en bd','\n\n\n')
    return db.query(models.Product).offset(skip).limit(limit).all()
    # return ['hello']

def get_product(db: Session, id: str):
    return db.query(models.Product).filter(models.Product.parent_asin == id).first()

def get_product_name(db: Session, name: str, skip: int = 0, limit: int = 10):
    return db.query(models.Product).filter(models.Product.title.ilike(f"%{name}%")).offset(skip).limit(limit).all()

def create_user_item(db: Session, item: schemas.ProductCreate, user_id: int):
    db_item = models.Item(**item.dict(), owner_id=user_id)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def create_purchase(db: Session, purchase: schemas.PurchaseCreate):
    db_purchase = models.Purchase(user_id=purchase.user_id, parent_asin=purchase.parent_asin)
    db.add(db_purchase)
    db.commit()
    db.refresh(db_purchase)
    return db_purchase

