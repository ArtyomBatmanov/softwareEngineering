from fastapi import FastAPI
from app.routers import students, subjects, grades

app = FastAPI(
    title="Student Journal System",
    description="REST API для управления студенческим журналом",
    version="1.0.0"
)

app.include_router(students.router)
app.include_router(subjects.router)
app.include_router(grades.router)


@app.get("/")
def read_root():
    return {
        "message": "Student Journal System API",
        "endpoints": {
            "students": "/students",
            "subjects": "/subjects",
            "grades": "/grades",
            "docs": "/docs"
        }
    }
