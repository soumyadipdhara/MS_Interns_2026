"""
Run this script once after installing dependencies to create an initial
admin user and a few sample employees/tasks so you can explore the app
immediately.

Usage:
    python -m app.seed
"""
from datetime import date, timedelta

from app.core.security import get_password_hash
from app.db.database import Base, SessionLocal, engine
from app.models.employee import Employee, EmployeeStatus
from app.models.task import Task, TaskPriority, TaskStatus
from app.models.user import User, UserRole

Base.metadata.create_all(bind=engine)


def seed():
    db = SessionLocal()
    try:
        if db.query(User).filter(User.email == "admin@worksphere.com").first():
            print("Seed data already exists. Skipping.")
            return

        admin = User(
            full_name="Admin User",
            email="admin@worksphere.com",
            hashed_password=get_password_hash("Admin@123"),
            role=UserRole.ADMIN,
        )
        regular_user = User(
            full_name="Demo User",
            email="user@worksphere.com",
            hashed_password=get_password_hash("User@123"),
            role=UserRole.USER,
        )
        db.add_all([admin, regular_user])
        db.commit()

        employees = [
            Employee(
                employee_code="EMP0001",
                name="Priya Sharma",
                email="priya.sharma@worksphere.com",
                department="Engineering",
                designation="Senior Software Engineer",
                joining_date=date(2022, 3, 15),
                status=EmployeeStatus.ACTIVE,
            ),
            Employee(
                employee_code="EMP0002",
                name="Rahul Verma",
                email="rahul.verma@worksphere.com",
                department="Engineering",
                designation="Software Engineer",
                joining_date=date(2023, 7, 1),
                status=EmployeeStatus.ACTIVE,
            ),
            Employee(
                employee_code="EMP0003",
                name="Ananya Iyer",
                email="ananya.iyer@worksphere.com",
                department="Human Resources",
                designation="HR Manager",
                joining_date=date(2021, 1, 10),
                status=EmployeeStatus.ACTIVE,
            ),
            Employee(
                employee_code="EMP0004",
                name="Vikram Singh",
                email="vikram.singh@worksphere.com",
                department="Sales",
                designation="Sales Executive",
                joining_date=date(2020, 11, 20),
                status=EmployeeStatus.INACTIVE,
            ),
        ]
        db.add_all(employees)
        db.commit()

        today = date.today()
        tasks = [
            Task(
                title="Set up CI/CD pipeline",
                description="Configure GitHub Actions for automated testing and deployment.",
                priority=TaskPriority.HIGH,
                due_date=today + timedelta(days=5),
                assigned_employee_id=employees[0].id,
                status=TaskStatus.IN_PROGRESS,
            ),
            Task(
                title="Fix login page bug",
                description="Resolve the validation error on the registration form.",
                priority=TaskPriority.MEDIUM,
                due_date=today + timedelta(days=2),
                assigned_employee_id=employees[1].id,
                status=TaskStatus.PENDING,
            ),
            Task(
                title="Conduct quarterly review",
                description="Prepare and conduct Q2 performance reviews for the team.",
                priority=TaskPriority.MEDIUM,
                due_date=today + timedelta(days=10),
                assigned_employee_id=employees[2].id,
                status=TaskStatus.PENDING,
            ),
            Task(
                title="Update onboarding docs",
                description="Refresh onboarding documentation with new policies.",
                priority=TaskPriority.LOW,
                due_date=today - timedelta(days=1),
                assigned_employee_id=employees[2].id,
                status=TaskStatus.COMPLETED,
            ),
        ]
        db.add_all(tasks)
        db.commit()

        print("Seed data created successfully!")
        print("-" * 50)
        print("Admin login: admin@worksphere.com / Admin@123")
        print("User login:  user@worksphere.com  / User@123")
        print("-" * 50)
    finally:
        db.close()


if __name__ == "__main__":
    seed()
