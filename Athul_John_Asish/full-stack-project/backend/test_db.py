from database import SessionLocal
from models import User

db = SessionLocal()

user = db.query(User).filter(User.username == "admin").first()

print("Before:", user.role)

user.role = "admin"

db.commit()
db.refresh(user)

print("After:", user.role)