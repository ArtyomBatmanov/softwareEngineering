from sqlalchemy import Column, String, Date
from sqlalchemy.dialects.postgresql import UUID
import uuid
from app.database.connection import Base


class Student(Base):
    __tablename__ = "students"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    fullName = Column(String, nullable=False)
    studentNumber = Column(String, unique=True, nullable=False, index=True)
    enrollmentDate = Column(Date, nullable=False)
