from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.deps import get_current_user
from app.db.database import get_db
from app.models.employee import Employee, EmployeeStatus
from app.models.task import Task, TaskStatus
from app.models.user import User

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])


@router.get("/stats")
def get_stats(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    total_employees = db.query(Employee).count()
    active_employees = (
        db.query(Employee).filter(Employee.status == EmployeeStatus.ACTIVE).count()
    )
    inactive_employees = total_employees - active_employees

    total_tasks = db.query(Task).count()
    pending_tasks = db.query(Task).filter(Task.status == TaskStatus.PENDING).count()
    in_progress_tasks = db.query(Task).filter(Task.status == TaskStatus.IN_PROGRESS).count()
    completed_tasks = db.query(Task).filter(Task.status == TaskStatus.COMPLETED).count()

    dept_rows = (
        db.query(Employee.department, func.count(Employee.id))
        .group_by(Employee.department)
        .all()
    )
    department_breakdown = [{"department": d, "count": c} for d, c in dept_rows]

    return {
        "employees": {
            "total": total_employees,
            "active": active_employees,
            "inactive": inactive_employees,
        },
        "tasks": {
            "total": total_tasks,
            "pending": pending_tasks,
            "in_progress": in_progress_tasks,
            "completed": completed_tasks,
        },
        "department_breakdown": department_breakdown,
    }
