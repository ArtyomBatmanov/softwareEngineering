from sqlalchemy import Column, Float, DateTime, String
from sqlalchemy.dialects.postgresql import UUID
from app.database.connection import Base


class GradeView(Base):
    __tablename__ = "grades_view"
    __table_args__ = {'info': dict(is_view=True)}

    id = Column(UUID(as_uuid=True), primary_key=True)
    studentId = Column(UUID(as_uuid=True))
    studentFullName = Column(String)
    studentNumber = Column(String)
    subjectId = Column(UUID(as_uuid=True))
    subjectName = Column(String)
    grade = Column(Float)
    createRowTime = Column(DateTime(timezone=True))
