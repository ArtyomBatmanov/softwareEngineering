from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from uuid import UUID

from app.database.connection import get_db
from app.models.subject import Subject as SubjectModel
from app.models.grade import Grade as GradeModel
from app.schemas.subject import Subject, SubjectCreate, SubjectUpdate

router = APIRouter(prefix="/subjects", tags=["subjects"])


@router.post("/", response_model=Subject, status_code=201)
def create_subject(subject: SubjectCreate, db: Session = Depends(get_db)):
    new_subject = SubjectModel(**subject.model_dump())
    db.add(new_subject)
    db.commit()
    db.refresh(new_subject)
    return new_subject


@router.get("/", response_model=List[Subject])
def get_subjects(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    subjects = db.query(SubjectModel).offset(skip).limit(limit).all()
    return subjects


@router.get("/{subject_id}", response_model=Subject)
def get_subject(subject_id: UUID, db: Session = Depends(get_db)):
    subject = db.query(SubjectModel).filter(SubjectModel.id == subject_id).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    return subject


@router.get("/{subject_id}/average")
def get_subject_average(subject_id: UUID, db: Session = Depends(get_db)):
    subject = db.query(SubjectModel).filter(SubjectModel.id == subject_id).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")

    avg_grade = db.query(func.avg(GradeModel.grade)).filter(GradeModel.subjectId == subject_id).scalar()

    if avg_grade is None:
        return {
            "subjectId": str(subject_id),
            "subjectName": subject.name,
            "averageGrade": None,
            "message": "No grades found for this subject"
        }

    return {
        "subjectId": str(subject_id),
        "subjectName": subject.name,
        "averageGrade": round(float(avg_grade), 2)
    }


@router.put("/{subject_id}", response_model=Subject)
def update_subject(subject_id: UUID, subject_update: SubjectUpdate, db: Session = Depends(get_db)):
    subject = db.query(SubjectModel).filter(SubjectModel.id == subject_id).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")

    update_data = subject_update.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(subject, field, value)

    db.commit()
    db.refresh(subject)
    return subject


@router.delete("/{subject_id}", status_code=204)
def delete_subject(subject_id: UUID, db: Session = Depends(get_db)):
    subject = db.query(SubjectModel).filter(SubjectModel.id == subject_id).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")

    db.delete(subject)
    db.commit()
    return None
