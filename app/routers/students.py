from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from uuid import UUID

from app.database.connection import get_db
from app.models.student import Student as StudentModel
from app.models.grade import Grade as GradeModel
from app.schemas.student import Student, StudentCreate, StudentUpdate

router = APIRouter(prefix="/students", tags=["students"])


@router.post("/", response_model=Student, status_code=201)
def create_student(student: StudentCreate, db: Session = Depends(get_db)):
    db_student = db.query(StudentModel).filter(StudentModel.studentNumber == student.studentNumber).first()
    if db_student:
        raise HTTPException(status_code=400, detail="Student number already registered")

    new_student = StudentModel(**student.model_dump())
    db.add(new_student)
    db.commit()
    db.refresh(new_student)
    return new_student


@router.get("/", response_model=List[Student])
def get_students(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    students = db.query(StudentModel).offset(skip).limit(limit).all()
    return students


@router.get("/{student_id}", response_model=Student)
def get_student(student_id: UUID, db: Session = Depends(get_db)):
    student = db.query(StudentModel).filter(StudentModel.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student


@router.get("/{student_id}/average")
def get_student_average(student_id: UUID, db: Session = Depends(get_db)):
    student = db.query(StudentModel).filter(StudentModel.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    avg_grade = db.query(func.avg(GradeModel.grade)).filter(GradeModel.studentId == student_id).scalar()

    if avg_grade is None:
        return {
            "studentId": str(student_id),
            "studentFullName": student.fullName,
            "averageGrade": None,
            "message": "No grades found for this student"
        }

    return {
        "studentId": str(student_id),
        "studentFullName": student.fullName,
        "averageGrade": round(float(avg_grade), 2)
    }


@router.put("/{student_id}", response_model=Student)
def update_student(student_id: UUID, student_update: StudentUpdate, db: Session = Depends(get_db)):
    student = db.query(StudentModel).filter(StudentModel.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    update_data = student_update.model_dump(exclude_unset=True)

    if "studentNumber" in update_data and update_data["studentNumber"] != student.studentNumber:
        existing = db.query(StudentModel).filter(StudentModel.studentNumber == update_data["studentNumber"]).first()
        if existing:
            raise HTTPException(status_code=400, detail="Student number already registered")

    for field, value in update_data.items():
        setattr(student, field, value)

    db.commit()
    db.refresh(student)
    return student


@router.delete("/{student_id}", status_code=204)
def delete_student(student_id: UUID, db: Session = Depends(get_db)):
    student = db.query(StudentModel).filter(StudentModel.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    db.delete(student)
    db.commit()
    return None
