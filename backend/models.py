from datetime import datetime

from sqlalchemy import (
    String,
    Integer,
    Boolean,
    DateTime,
    ForeignKey
)

from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base


class Student(Base):

    __tablename__ = "students"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True
    )

    participant_id: Mapped[str] = mapped_column(
        String(50),
        unique=True,
        index=True
    )

    name: Mapped[str] = mapped_column(
        String(150)
    )

    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        index=True
    )

    password_hash: Mapped[str] = mapped_column(
        String(500)
    )

    pretest_completed: Mapped[bool] = mapped_column(
        Boolean,
        default=False
    )

    intervention_completed: Mapped[bool] = mapped_column(
        Boolean,
        default=False
    )

    intervention_completed_at: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True
    )

    posttest_completed: Mapped[bool] = mapped_column(
        Boolean,
        default=False
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow
    )


class ModuleProgress(Base):

    __tablename__ = "module_progress"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True
    )

    student_id: Mapped[int] = mapped_column(
        ForeignKey("students.id"),
        index=True
    )

    module_number: Mapped[int] = mapped_column(
        Integer
    )

    completed: Mapped[bool] = mapped_column(
        Boolean,
        default=False
    )

    completed_at: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True
    )