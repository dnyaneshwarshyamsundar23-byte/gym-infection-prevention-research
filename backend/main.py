import os
from datetime import datetime, timedelta

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select
from sqlalchemy.orm import Session

from database import engine, get_db, Base
from models import Student, ModuleProgress
from schemas import SignupRequest, LoginRequest
from auth import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_student,
)

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Gym Infection Prevention Research API",
    version="1.1.0",
)

allowed_origins = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173",
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in allowed_origins],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "Gym Infection Prevention Research API is running."}


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.post("/api/auth/signup")
def signup(data: SignupRequest, db: Session = Depends(get_db)):
    participant_id = data.participant_id.strip().upper()
    email = data.email.lower().strip()
    name = data.name.strip()

    if len(name) < 2:
        raise HTTPException(status_code=400, detail="Please enter a valid name.")

    if len(participant_id) < 2:
        raise HTTPException(
            status_code=400, detail="Please enter a valid participant ID."
        )

    existing_participant = db.scalar(
        select(Student).where(Student.participant_id == participant_id)
    )
    if existing_participant:
        raise HTTPException(status_code=409, detail="Participant ID already exists.")

    existing_email = db.scalar(
        select(Student).where(Student.email == email)
    )
    if existing_email:
        raise HTTPException(status_code=409, detail="Email already registered.")

    student = Student(
        participant_id=participant_id,
        name=name,
        email=email,
        password_hash=hash_password(data.password),
    )
    db.add(student)
    db.commit()
    db.refresh(student)

    return {
        "message": "Account created successfully.",
        "participant_id": student.participant_id,
    }


@app.post("/api/auth/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    email = data.email.lower().strip()

    student = db.scalar(select(Student).where(Student.email == email))
    if not student or not verify_password(data.password, student.password_hash):
        raise HTTPException(
            status_code=401,
            detail="Incorrect email or password.",
        )

    return {
        "access_token": create_access_token(student),
        "token_type": "bearer",
        "participant_id": student.participant_id,
    }


@app.get("/api/me")
def get_student(
    student: Student = Depends(get_current_student),
    db: Session = Depends(get_db),
):
    now = datetime.utcnow()
    post_test_available_at = None
    post_test_available = False

    if student.intervention_completed_at:
        post_test_available_at = (
            student.intervention_completed_at + timedelta(days=7)
        )
        post_test_available = now >= post_test_available_at

    modules = db.scalars(
        select(ModuleProgress)
        .where(ModuleProgress.student_id == student.id)
        .order_by(ModuleProgress.module_number)
    ).all()

    completed_modules = [
        module.module_number for module in modules if module.completed
    ]

    return {
        "participant_id": student.participant_id,
        "name": student.name,
        "email": student.email,
        "pretest_completed": student.pretest_completed,
        "intervention_completed": student.intervention_completed,
        "intervention_completed_at": (
            student.intervention_completed_at.isoformat()
            if student.intervention_completed_at
            else None
        ),
        "posttest_completed": student.posttest_completed,
        "post_test_available": post_test_available,
        "post_test_available_at": (
            post_test_available_at.isoformat()
            if post_test_available_at
            else None
        ),
        "completed_modules": completed_modules,
    }


@app.post("/api/research/pretest-complete")
def complete_pretest(
    student: Student = Depends(get_current_student),
    db: Session = Depends(get_db),
):
    if not student.pretest_completed:
        student.pretest_completed = True
        db.commit()

    return {"message": "Pre-test completion recorded."}


@app.post("/api/research/module/{module_number}")
def complete_module(
    module_number: int,
    student: Student = Depends(get_current_student),
    db: Session = Depends(get_db),
):
    if not student.pretest_completed:
        raise HTTPException(
            status_code=400,
            detail="Complete the pre-test first.",
        )

    if module_number < 1 or module_number > 12:
        raise HTTPException(
            status_code=400,
            detail="Invalid module number.",
        )

    existing = db.scalar(
        select(ModuleProgress).where(
            ModuleProgress.student_id == student.id,
            ModuleProgress.module_number == module_number,
        )
    )

    if existing:
        existing.completed = True
        if existing.completed_at is None:
            existing.completed_at = datetime.utcnow()
    else:
        db.add(
            ModuleProgress(
                student_id=student.id,
                module_number=module_number,
                completed=True,
                completed_at=datetime.utcnow(),
            )
        )

    db.commit()

    completed_count = db.query(ModuleProgress).filter(
        ModuleProgress.student_id == student.id,
        ModuleProgress.completed.is_(True),
    ).count()

    if completed_count >= 12 and not student.intervention_completed:
        student.intervention_completed = True
        student.intervention_completed_at = datetime.utcnow()
        db.commit()

    return {
        "message": "Module completion recorded.",
        "completed_modules": completed_count,
        "intervention_completed": student.intervention_completed,
    }


@app.post("/api/research/posttest-complete")
def complete_posttest(
    student: Student = Depends(get_current_student),
    db: Session = Depends(get_db),
):
    if not student.intervention_completed_at:
        raise HTTPException(
            status_code=400,
            detail="Intervention has not been completed.",
        )

    available_at = student.intervention_completed_at + timedelta(days=7)

    if datetime.utcnow() < available_at:
        raise HTTPException(
            status_code=403,
            detail="Post-test is not available yet.",
        )

    if not student.posttest_completed:
        student.posttest_completed = True
        db.commit()

    return {"message": "Post-test completion recorded."}
