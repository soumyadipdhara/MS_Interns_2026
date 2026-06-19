from datetime import date
from pydantic import BaseModel, EmailStr


class UserRegister(BaseModel):
    username: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    username: str
    password: str


class EmployeeCreate(BaseModel):
    employee_id: str
    name: str
    email: EmailStr
    department: str
    designation: str
    joining_date: date
    status: str


class EmployeeResponse(EmployeeCreate):
    id: int

    class Config:
        from_attributes = True


class TaskCreate(BaseModel):
    title: str
    description: str
    priority: str
    due_date: date
    employee_id: int


class TaskResponse(TaskCreate):
    id: int
    status: str

    class Config:
        from_attributes = True