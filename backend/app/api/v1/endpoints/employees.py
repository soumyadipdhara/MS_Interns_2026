from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.core.database import get_db
from app.core.security import get_current_user, get_current_admin
from app.schemas.employee import EmployeeCreate, EmployeeUpdate, EmployeeOut, EmployeeListResponse
from app.services import employee_service

router = APIRouter(prefix="/employees", tags=["Employees"])


@router.get("/departments", tags=["Employees"])
def list_departments(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Return all unique departments in use."""
    return employee_service.get_departments(db)


@router.get("/designations", tags=["Employees"])
def list_designations(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Return all unique designations in use."""
    return employee_service.get_designations(db)


@router.get("/stats", tags=["Employees"])
def employee_stats(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_admin),
):
    return employee_service.get_employee_stats(db)


@router.get("", response_model=EmployeeListResponse)
def list_employees(
    search: Optional[str] = Query(None),
    department: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    designation: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    total, employees = employee_service.get_employees(
        db,
        search=search,
        department=department,
        status=status,
        designation=designation,
        skip=skip,
        limit=limit,
    )
    return {"total": total, "employees": employees}


@router.get("/{employee_id}", response_model=EmployeeOut)
def get_employee(
    employee_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return employee_service.get_employee(db, employee_id)


@router.post("", response_model=EmployeeOut, status_code=201)
def create_employee(
    data: EmployeeCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_admin),
):
    return employee_service.create_employee(db, data)


@router.put("/{employee_id}", response_model=EmployeeOut)
def update_employee(
    employee_id: int,
    data: EmployeeUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_admin),
):
    return employee_service.update_employee(db, employee_id, data)


@router.delete("/{employee_id}")
def delete_employee(
    employee_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_admin),
):
    return employee_service.delete_employee(db, employee_id)
