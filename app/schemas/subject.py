from pydantic import BaseModel, Field
from uuid import UUID


class SubjectBase(BaseModel):
    name: str = Field(..., min_length=1)


class SubjectCreate(SubjectBase):
    pass


class SubjectUpdate(BaseModel):
    name: str | None = None


class Subject(SubjectBase):
    id: UUID

    class Config:
        from_attributes = True
