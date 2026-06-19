from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import Employee
from schemas import EmployeeCreate
from dependencies import get_current_user

router = APIRouter(
    prefix="/employees",
    tags=["Employees"]
)


@router.post("/")
def create_employee(
    employee: EmployeeCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    emp = Employee(**employee.model_dump())

    db.add(emp)
    db.commit()
    db.refresh(emp)

    return emp


@router.get("/")
def get_employees(
    search: str = "",
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return db.query(Employee).filter(
        Employee.name.contains(search)
    ).all()


@router.put("/{employee_id}")
def update_employee(
    employee_id: int,
    employee: EmployeeCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    emp = db.get(Employee, employee_id)

    if not emp:
        raise HTTPException(
            status_code=404,
            detail="Employee not found"
        )

    for key, value in employee.model_dump().items():
        setattr(emp, key, value)

    db.commit()
    db.refresh(emp)

    return emp


@router.delete("/{employee_id}")
def delete_employee(
    employee_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    emp = db.get(Employee, employee_id)

    if not emp:
        raise HTTPException(
            status_code=404,
            detail="Employee not found"
        )

    db.delete(emp)
    db.commit()

    return {"message": "Deleted"}