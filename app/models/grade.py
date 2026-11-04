from sqlalchemy import Column, Float, DateTime, ForeignKey, String, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.database.connection import Base


class Grade(Base):
    __tablename__ = "grades"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid(), index=True)
    studentId = Column(UUID(as_uuid=True), ForeignKey("students.id"), nullable=False)
    subjectId = Column(UUID(as_uuid=True), ForeignKey("subjects.id"), nullable=False)
    grade = Column(Float, nullable=False)
    createRowTime = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
