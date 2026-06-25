import enum

from sqlalchemy import Column, Integer, String, Enum, DateTime
from sqlalchemy.sql import func

from app.db.database import Base


class UserRole(str, enum.Enum):
    ADMIN = "admin"
    USER = "user"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    full_name = Column(String(100), nullable=False)

    email = Column(String(255), unique=True, index=True, nullable=False)

    hashed_password = Column(String(255), nullable=False)

    role = Column(
        Enum(UserRole, name="user_role"),   # ✅ FIX: named enum for DB stability
        default=UserRole.USER,
        nullable=False
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )