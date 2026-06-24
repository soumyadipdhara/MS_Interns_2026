from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional
from datetime import date, datetime


VALID_STATUSES = {"Active", "Inactive"}
VALID_DEPARTMENTS = {
    "Engineering", "Product", "Design", "Marketing",
    "Sales", "HR", "Finance", "Operations", "Legal", "Customer Support"
}
VALID_PRIORITIES = {"Low", "Medium", "High", "Critical"}


class EmployeeBase(BaseModel):
    name: str
    email: EmailStr
    department: str
    designation: str
    joining_date: date
    status: str = "Active"

    @field_validator("name")
    @classmethod
    def name_not_empty(cls, v):
        if not v or not v.strip():
            raise ValueError("Name cannot be empty")
        if len(v.strip()) < 2:
            raise ValueError("Name must be at least 2 characters")
        return v.strip()

    @field_validator("status")
    @classmethod
    def validate_status(cls, v):
        if v not in VALID_STATUSES:
            raise ValueError(f"Status must be one of: {', '.join(VALID_STATUSES)}")
        return v

    @field_validator("department")
    @classmethod
    def validate_department(cls, v):
        if not v or not v.strip():
            raise ValueError("Department cannot be empty")
        return v.strip()

    @field_validator("designation")
    @classmethod
    def validate_designation(cls, v):
        if not v or not v.strip():
            raise ValueError("Designation cannot be empty")
        return v.strip()

    class Config:
        from_attributes = True


class EmployeeCreate(EmployeeBase):
    pass


class EmployeeUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    department: Optional[str] = None
    designation: Optional[str] = None
    joining_date: Optional[date] = None
    status: Optional[str] = None

    @field_validator("status")
    @classmethod
    def validate_status(cls, v):
        if v is not None and v not in VALID_STATUSES:
            raise ValueError(f"Status must be one of: {', '.join(VALID_STATUSES)}")
        return v


class EmployeeOut(EmployeeBase):
    id: int
    employee_id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class EmployeeListResponse(BaseModel):
    total: int
    employees: list[EmployeeOut]
