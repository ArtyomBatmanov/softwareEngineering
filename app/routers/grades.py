from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.database.connection import get_db
from app.models.grade import Grade as GradeModel
from app.models.student import Student as StudentModel
from app.models.subject import Subject as SubjectModel
from app.models.grade_view import GradeView
from app.schemas.grade import Grade, GradeCreate, GradeUpdate, GradeWithDetails

router = APIRouter(prefix="/grades", tags=["grades"])


@router.post("/", response_model=Grade, status_code=201)
def create_grade(grade: GradeCreate, db: Session = Depends(get_db)):
    student = db.query(StudentModel).filter(StudentModel.id == grade.studentId).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    subject = db.query(SubjectModel).filter(SubjectModel.id == grade.subjectId).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")

    new_grade = GradeModel(**grade.model_dump())
    db.add(new_grade)
    db.commit()
    db.refresh(new_grade)
    return new_grade


@router.get("/", response_model=List[GradeWithDetails])
def get_grades(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    grades = db.query(GradeView).offset(skip).limit(limit).all()
    return grades


@router.get("/{grade_id}", response_model=GradeWithDetails)
def get_grade(grade_id: UUID, db: Session = Depends(get_db)):
    grade = db.query(GradeView).filter(GradeView.id == grade_id).first()
    if not grade:
        raise HTTPException(status_code=404, detail="Grade not found")
    return grade


@router.put("/{grade_id}", response_model=Grade)
def update_grade(grade_id: UUID, grade_update: GradeUpdate, db: Session = Depends(get_db)):
    grade = db.query(GradeModel).filter(GradeModel.id == grade_id).first()
    if not grade:
        raise HTTPException(status_code=404, detail="Grade not found")

    update_data = grade_update.model_dump(exclude_unset=True)

    if "studentId" in update_data:
        student = db.query(StudentModel).filter(StudentModel.id == update_data["studentId"]).first()
        if not student:
            raise HTTPException(status_code=404, detail="Student not found")

    if "subjectId" in update_data:
        subject = db.query(SubjectModel).filter(SubjectModel.id == update_data["subjectId"]).first()
        if not subject:
            raise HTTPException(status_code=404, detail="Subject not found")

    for field, value in update_data.items():
        setattr(grade, field, value)

    db.commit()
    db.refresh(grade)
    return grade


@router.delete("/{grade_id}", status_code=204)
def delete_grade(grade_id: UUID, db: Session = Depends(get_db)):
    grade = db.query(GradeModel).filter(GradeModel.id == grade_id).first()
    if not grade:
        raise HTTPException(status_code=404, detail="Grade not found")

    db.delete(grade)
    db.commit()
    return None
