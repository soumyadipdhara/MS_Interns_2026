from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.models.employee import EmployeeStatus


class EmployeeBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    department: str = Field(..., min_length=1, max_length=100)
    designation: str = Field(..., min_length=1, max_length=100)
    joining_date: date
    status: Optional[EmployeeStatus] = EmployeeStatus.ACTIVE


class EmployeeCreate(EmployeeBase):
    employee_code: Optional[str] = None


class EmployeeUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    email: Optional[EmailStr] = None
    department: Optional[str] = None
    designation: Optional[str] = None
    joining_date: Optional[date] = None
    status: Optional[EmployeeStatus] = None


class EmployeeOut(EmployeeBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    employee_code: str
    created_at: datetime
    updated_at: Optional[datetime] = None


class EmployeeListResponse(BaseModel):
    total: int
    items: list[EmployeeOut]
