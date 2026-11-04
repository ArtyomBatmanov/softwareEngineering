from fastapi import FastAPI
from app.routers import students, subjects, grades
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Student Journal System",
    description="REST API для управления студенческим журналом",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
