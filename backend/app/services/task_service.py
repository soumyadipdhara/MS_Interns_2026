from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_
from fastapi import HTTPException
from app.models.task import Task
from app.models.employee import Employee
from app.schemas.task import TaskCreate, TaskUpdate
import random
import string


def generate_task_id(db: Session) -> str:
    while True:
        task_id = "TSK" + "".join(random.choices(string.digits, k=5))
        if not db.query(Task).filter(Task.task_id == task_id).first():
            return task_id


def get_employee_by_user_email(db: Session, user_email: str):
    """Link logged-in user to employee record via matching email."""
    return db.query(Employee).filter(
        Employee.email.ilike(user_email)
    ).first()


def get_tasks(
    db: Session,
    search: str = None,
    status: str = None,
    priority: str = None,
    employee_id: int = None,
    current_user=None,
    skip: int = 0,
    limit: int = 100,
):
    query = db.query(Task).options(joinedload(Task.assigned_employee))

    # If regular user → only show tasks assigned to their employee record
    if current_user and current_user.role != "admin":
        linked_employee = get_employee_by_user_email(db, current_user.email)
        if linked_employee:
            query = query.filter(Task.assigned_employee_id == linked_employee.id)
        else:
            # User has no linked employee record → show empty
            return 0, []

    if search:
        query = query.filter(
            or_(
                Task.title.ilike(f"%{search}%"),
                Task.task_id.ilike(f"%{search}%"),
                Task.description.ilike(f"%{search}%"),
            )
        )
    if status:
        query = query.filter(Task.status == status)
    if priority:
        query = query.filter(Task.priority == priority)
    if employee_id:
        query = query.filter(Task.assigned_employee_id == employee_id)

    total = query.count()
    tasks = query.order_by(Task.created_at.desc()).offset(skip).limit(limit).all()
    return total, tasks


def get_task(db: Session, task_id: int) -> Task:
    task = db.query(Task).options(
        joinedload(Task.assigned_employee)
    ).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


def create_task(db: Session, data: TaskCreate) -> Task:
    if data.assigned_employee_id:
        employee = db.query(Employee).filter(
            Employee.id == data.assigned_employee_id
        ).first()
        if not employee:
            raise HTTPException(status_code=404, detail="Employee not found")
    task = Task(
        task_id=generate_task_id(db),
        **data.model_dump()
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return get_task(db, task.id)


def update_task(db: Session, task_id: int, data: TaskUpdate, current_user=None) -> Task:
    task = get_task(db, task_id)

    # Non-admin users can only update status of their own assigned tasks
    if current_user and current_user.role != "admin":
        linked_employee = get_employee_by_user_email(db, current_user.email)
        if not linked_employee or task.assigned_employee_id != linked_employee.id:
            raise HTTPException(
                status_code=403,
                detail="You can only update tasks assigned to you"
            )
        # Only allow status change for regular users
        update_data = {}
        if data.status:
            update_data["status"] = data.status
    else:
        update_data = data.model_dump(exclude_unset=True)
        if "assigned_employee_id" in update_data and update_data["assigned_employee_id"]:
            employee = db.query(Employee).filter(
                Employee.id == update_data["assigned_employee_id"]
            ).first()
            if not employee:
                raise HTTPException(status_code=404, detail="Employee not found")

    for field, value in update_data.items():
        setattr(task, field, value)
    db.commit()
    db.refresh(task)
    return get_task(db, task.id)


def delete_task(db: Session, task_id: int):
    task = get_task(db, task_id)
    db.delete(task)
    db.commit()
    return {"message": "Task deleted successfully"}


def get_dashboard_stats(db: Session, current_user=None) -> dict:
    total_employees = db.query(Employee).count()
    active_employees = db.query(Employee).filter(Employee.status == "Active").count()
    total_tasks = db.query(Task).count()
    pending_tasks = db.query(Task).filter(Task.status == "Pending").count()
    in_progress_tasks = db.query(Task).filter(Task.status == "In Progress").count()
    completed_tasks = db.query(Task).filter(Task.status == "Completed").count()

    # Per-department employee count
    from sqlalchemy import func
    dept_counts = db.query(
        Employee.department,
        func.count(Employee.id).label("count")
    ).group_by(Employee.department).all()

    # Priority breakdown
    priority_counts = db.query(
        Task.priority,
        func.count(Task.id).label("count")
    ).group_by(Task.priority).all()

    # If regular user, also return their personal stats
    personal = None
    if current_user and current_user.role != "admin":
        linked_employee = get_employee_by_user_email(db, current_user.email)
        if linked_employee:
            my_total = db.query(Task).filter(Task.assigned_employee_id == linked_employee.id).count()
            my_pending = db.query(Task).filter(
                Task.assigned_employee_id == linked_employee.id,
                Task.status == "Pending"
            ).count()
            my_in_progress = db.query(Task).filter(
                Task.assigned_employee_id == linked_employee.id,
                Task.status == "In Progress"
            ).count()
            my_completed = db.query(Task).filter(
                Task.assigned_employee_id == linked_employee.id,
                Task.status == "Completed"
            ).count()
            personal = {
                "my_total_tasks": my_total,
                "my_pending": my_pending,
                "my_in_progress": my_in_progress,
                "my_completed": my_completed,
                "employee_name": linked_employee.name,
                "department": linked_employee.department,
            }

    return {
        "total_employees": total_employees,
        "active_employees": active_employees,
        "inactive_employees": total_employees - active_employees,
        "total_tasks": total_tasks,
        "pending_tasks": pending_tasks,
        "in_progress_tasks": in_progress_tasks,
        "completed_tasks": completed_tasks,
        "department_breakdown": [
            {"department": d, "count": c} for d, c in dept_counts
        ],
        "priority_breakdown": [
            {"priority": p, "count": c} for p, c in priority_counts
        ],
        "personal": personal,
    }
