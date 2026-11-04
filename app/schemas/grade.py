from pydantic import BaseModel, Field
from datetime import datetime
from uuid import UUID


class GradeBase(BaseModel):
    studentId: UUID
    subjectId: UUID
    grade: float = Field(..., ge=0, le=100)


class GradeCreate(GradeBase):
    pass


class GradeUpdate(BaseModel):
    studentId: UUID | None = None
    subjectId: UUID | None = None
    grade: float | None = Field(None, ge=0, le=100)


class Grade(GradeBase):
    id: UUID
    createRowTime: datetime

    class Config:
        from_attributes = True


class GradeWithDetails(BaseModel):
    id: UUID
    studentId: UUID
    studentFullName: str
    studentNumber: str
    subjectId: UUID
    subjectName: str
    grade: float
    createRowTime: datetime

    class Config:
        from_attributes = True
