from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.db.database import Base, engine
from app.models import employee, task, user  # noqa: F401 - ensures models are registered
from app.routers import auth, dashboard, employees, tasks

Base.metadata.create_all(bind=engine)
print(f"[WorkSphere] Using database: {settings.database_url}")

app = FastAPI(
    title="WorkSphere API",
    description="Employee & Task Tracking Platform API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(employees.router)
app.include_router(tasks.router)
app.include_router(dashboard.router)


@app.get("/")
def root():
    return {"message": "WorkSphere API is running", "docs": "/docs"}


@app.get("/api/health")
def health_check():
    return {"status": "ok"}
