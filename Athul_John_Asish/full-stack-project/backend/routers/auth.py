from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import User
from schemas import UserRegister, UserLogin
from auth import hash_password, verify_password, create_access_token

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/register")
def register(user: UserRegister, db: Session = Depends(get_db)):

    existing = db.query(User).filter(
        User.username == user.username
    ).first()

    if existing:
        raise HTTPException(400, "Username already exists")

    new_user = User(
        username=user.username,
        email=user.email,
        password=hash_password(user.password),
        role="user"
    )

    db.add(new_user)
    db.commit()

    return {"message": "User created"}


# @router.post("/login")
# def login(user: UserLogin, db: Session = Depends(get_db)):

#     db_user = db.query(User).filter(
#         User.username == user.username
#     ).first()

#     if not db_user:
#         raise HTTPException(401, "Invalid credentials")

#     if not verify_password(
#         user.password,
#         db_user.password
#     ):
#         raise HTTPException(401, "Invalid credentials")

#     token = create_access_token(
#         {
#             "sub": db_user.username,
#             "role": db_user.role
#         }
#     )

#     return {
#         "access_token": token,
#         "token_type": "bearer"
#     }
@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):

    db_user = db.query(User).filter(
        User.username == user.username
    ).first()

    print("Entered username:", user.username)
    print("DB user:", db_user)

    if not db_user:
        print("USER NOT FOUND")
        raise HTTPException(401, "Invalid credentials")

    result = verify_password(
        user.password,
        db_user.password
    )

    print("Password valid:", result)

    if not result:
        raise HTTPException(401, "Invalid credentials")

    token = create_access_token(
        {
            "sub": db_user.username,
            "role": db_user.role
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "role":db_user.role
    }