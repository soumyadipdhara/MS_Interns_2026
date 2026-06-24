from sqlalchemy.orm import Session
from sqlalchemy import or_, func
from fastapi import HTTPException
from app.models.employee import Employee
from app.schemas.employee import EmployeeCreate, EmployeeUpdate
import random
import string


def generate_employee_id(db: Session) -> str:
    while True:
        emp_id = "EMP" + "".join(random.choices(string.digits, k=5))
        if not db.query(Employee).filter(Employee.employee_id == emp_id).first():
            return emp_id


def get_employees(
    db: Session,
    search: str = None,
    department: str = None,
    status: str = None,
    designation: str = None,
    skip: int = 0,
    limit: int = 100,
):
    query = db.query(Employee)
    if search:
        query = query.filter(
            or_(
                Employee.name.ilike(f"%{search}%"),
                Employee.email.ilike(f"%{search}%"),
                Employee.department.ilike(f"%{search}%"),
                Employee.designation.ilike(f"%{search}%"),
                Employee.employee_id.ilike(f"%{search}%"),
            )
        )
    if department:
        query = query.filter(Employee.department == department)
    if status:
        query = query.filter(Employee.status == status)
    if designation:
        query = query.filter(Employee.designation == designation)

    total = query.count()
    employees = query.order_by(Employee.name).offset(skip).limit(limit).all()
    return total, employees


def get_employee(db: Session, employee_id: int) -> Employee:
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    return employee


def get_departments(db: Session):
    """Return all unique departments."""
    results = db.query(Employee.department).distinct().order_by(Employee.department).all()
    return [r[0] for r in results]


def get_designations(db: Session):
    """Return all unique designations."""
    results = db.query(Employee.designation).distinct().order_by(Employee.designation).all()
    return [r[0] for r in results]


def create_employee(db: Session, data: EmployeeCreate) -> Employee:
    if db.query(Employee).filter(Employee.email.ilike(data.email)).first():
        raise HTTPException(status_code=400, detail="An employee with this email already exists")
    employee = Employee(
        employee_id=generate_employee_id(db),
        **data.model_dump()
    )
    db.add(employee)
    db.commit()
    db.refresh(employee)
    return employee


def update_employee(db: Session, employee_id: int, data: EmployeeUpdate) -> Employee:
    employee = get_employee(db, employee_id)
    update_data = data.model_dump(exclude_unset=True)
    if "email" in update_data:
        existing = db.query(Employee).filter(
            Employee.email.ilike(update_data["email"]),
            Employee.id != employee_id
        ).first()
        if existing:
            raise HTTPException(status_code=400, detail="Email already used by another employee")
    for field, value in update_data.items():
        setattr(employee, field, value)
    db.commit()
    db.refresh(employee)
    return employee


def delete_employee(db: Session, employee_id: int):
    from app.models.task import Task
    employee = get_employee(db, employee_id)
    # Unassign tasks before deleting
    db.query(Task).filter(Task.assigned_employee_id == employee_id).update(
        {"assigned_employee_id": None}
    )
    db.delete(employee)
    db.commit()
    return {"message": f"Employee {employee.name} deleted successfully"}


def get_employee_stats(db: Session) -> dict:
    """Per-department and status breakdown for dashboard."""
    dept_stats = db.query(
        Employee.department,
        func.count(Employee.id).label("total"),
        func.sum(
            func.case((Employee.status == "Active", 1), else_=0)
        ).label("active")
    ).group_by(Employee.department).all()

    return {
        "by_department": [
            {"department": d, "total": t, "active": a or 0}
            for d, t, a in dept_stats
        ]
    }
