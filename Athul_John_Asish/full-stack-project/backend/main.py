from fastapi import FastAPI
from database import Base, engine

from routers import auth, employees, tasks
from fastapi.middleware.cors import CORSMiddleware
# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title="WorkSphere API",
    description="Employee & Task Tracking Platform",
    version="1.0.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Root endpoint
@app.get("/")
def root():
    return {"message": "WorkSphere API is running"}

# Include routers (modules)
app.include_router(auth.router)
app.include_router(employees.router)
app.include_router(tasks.router)