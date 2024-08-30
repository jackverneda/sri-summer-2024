from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import timedelta

from . import crud, models, schemas, auth, engine

from .database import SessionLocal
from .database import engine as edb

models.Base.metadata.create_all(bind=edb)

app = FastAPI()

SECRET_KEY = "tu_clave_secreta_aqui"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost:4200",
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)


@app.get("/users/", response_model=list[schemas.User])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = crud.get_users(db, skip=skip, limit=limit)
    return users


@app.get("/users/{user_id}", response_model=schemas.User)
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user


@app.post("/users/{user_id}/products/", response_model=schemas.Product)
def create_item_for_user(
    user_id: int, item: schemas.ProductCreate, db: Session = Depends(get_db)
):
    return crud.create_user_item(db=db, item=item, user_id=user_id)


@app.get("/products/", response_model=list[schemas.Product])
def read_items(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    items = crud.get_items(db, skip=skip, limit=limit)
    return items

@app.get("/products/{id}", response_model=schemas.Product)
def get_product(id: str, db: Session = Depends(get_db)):
    item = crud.get_product(db, id)
    return item

@app.get("/products/name/{name}", response_model=list[schemas.Product])
def get_product_name(name: str, db: Session = Depends(get_db)):
    items = crud.get_product_name(db, name)
    return items

@app.get("/products/suggestion/{user_id}", response_model=list[schemas.Product])
@app.get("/products/suggestion/{user_id}")
def suggest(user_id: str, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return engine.suggest_products(db, user_id)



@app.post("/purchases")
def buy(purchase: schemas.PurchaseCreate, db: Session = Depends(get_db)):
    # Verificar si el usuario existe
    db_user = db.query(models.User).filter(models.User.user_id == purchase.user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    # Verificar si el producto existe
    db_product = db.query(models.Product).filter(models.Product.parent_asin == purchase.parent_asin).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")

    # Crear y guardar la nueva compra
    db_purchase = crud.create_purchase(db, purchase)

    return {"message": "Purchase simulated successfully", "purchase": db_purchase}

@app.post("/auth/login")
async def login(form: schemas.UserCreate, db: Session = Depends(get_db)):
    user = auth.authenticate_user(db, form.email, form.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/auth/signup")
async def signup(form: schemas.UserCreate, db: Session = Depends(get_db)):
    user = auth.create_user(db, form)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}