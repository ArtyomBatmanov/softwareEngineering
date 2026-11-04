from pydantic import BaseModel, Field
from datetime import date
from uuid import UUID


class StudentBase(BaseModel):
    fullName: str = Field(..., min_length=1)
    studentNumber: str = Field(..., min_length=1)
    enrollmentDate: date


class StudentCreate(StudentBase):
    pass


class StudentUpdate(BaseModel):
    fullName: str | None = None
    studentNumber: str | None = None
    enrollmentDate: date | None = None


class Student(StudentBase):
    id: UUID

    class Config:
        from_attributes = True
