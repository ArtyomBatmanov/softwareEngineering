# Student Journal System API

REST API для управления студенческим журналом (Лабораторная работа, Вариант 2)

## Описание

Система управления студенческим журналом с тремя основными сущностями:
- **Студенты** (Students) - ФИО, номер студенческого билета, дата поступления, email
- **Предметы** (Subjects) - название курса, описание, количество кредитов, семестр
- **Оценки** (Grades) - связь студента и предмета, оценка, дата

## Технологический стек

- FastAPI
- SQLAlchemy
- PostgreSQL
- Docker & Docker Compose
- Pydantic

## Структура проекта

```
.
├── app/
│   ├── database/
│   │   └── connection.py      # Настройка подключения к БД
│   ├── models/                # SQLAlchemy модели
│   │   ├── student.py
│   │   ├── subject.py
│   │   └── grade.py
│   ├── schemas/               # Pydantic схемы
│   │   ├── student.py
│   │   ├── subject.py
│   │   └── grade.py
│   └── routers/               # API endpoints
│       ├── students.py
│       ├── subjects.py
│       └── grades.py
├── main.py                    # Главный файл приложения
├── requirements.txt
├── Dockerfile
└── docker-compose.yml
```

## Запуск проекта


```bash
# Запуск приложения
docker compose up --build

# Или в фоновом режиме
docker compose up --build -d

# Остановка
docker compose down

# Остановка с удалением volumes
docker compose down -v
```


## API Endpoints

После запуска API будет доступен по адресу: `http://localhost:8000`

### Документация

- Swagger UI: http://localhost:8000/docs

### Students (Студенты)

- `POST /students/` - Создать нового студента
- `GET /students/` - Получить список всех студентов
- `GET /students/{student_id}` - Получить студента по ID
- `GET /students/{student_id}/average` - Получить средний балл студента
- `PUT /students/{student_id}` - Обновить студента
- `DELETE /students/{student_id}` - Удалить студента

### Subjects (Предметы)

- `POST /subjects/` - Создать новый предмет
- `GET /subjects/` - Получить список всех предметов
- `GET /subjects/{subject_id}` - Получить предмет по ID
- `GET /subjects/{subject_id}/average` - Получить средний балл по предмету
- `PUT /subjects/{subject_id}` - Обновить предмет
- `DELETE /subjects/{subject_id}` - Удалить предмет

### Grades (Оценки)

- `POST /grades/` - Создать новую оценку
- `GET /grades/` - Получить список всех оценок
- `GET /grades/{grade_id}` - Получить оценку по ID
- `PUT /grades/{grade_id}` - Обновить оценку
- `DELETE /grades/{grade_id}` - Удалить оценку


## Функционал расчёта среднего балла

API предоставляет эндпоинты для расчёта среднего балла:

1. **По студенту** (`GET /students/{student_id}/average`) - возвращает средний балл по всем предметам конкретного студента
2. **По предмету** (`GET /subjects/{subject_id}/average`) - возвращает средний балл всех студентов по конкретному предмету