import React, { useState, useEffect } from 'react';
import { gradesApi, studentsApi, subjectsApi, type GradeWithDetails, type GradeCreate, type GradeUpdate, type Student, type Subject } from '../api';
import { Modal } from '../components/Modal';

export const GradesPage: React.FC = () => {
  const [grades, setGrades] = useState<GradeWithDetails[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [studentFilter, setStudentFilter] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGrade, setEditingGrade] = useState<GradeWithDetails | null>(null);
  const [formData, setFormData] = useState<GradeCreate>({
    studentId: '',
    subjectId: '',
    grade: 0,
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [gradesRes, studentsRes, subjectsRes] = await Promise.all([
        gradesApi.getAll(),
        studentsApi.getAll(),
        subjectsApi.getAll(),
      ]);
      setGrades(gradesRes.data);
      setStudents(studentsRes.data);
      setSubjects(subjectsRes.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredGrades = grades.filter((g) => {
    const matchesSearch = 
      g.studentFullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.studentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.subjectName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStudent = !studentFilter || g.studentId === studentFilter;
    const matchesSubject = !subjectFilter || g.subjectId === subjectFilter;
    return matchesSearch && matchesStudent && matchesSubject;
  });

  const openCreateModal = () => {
    setEditingGrade(null);
    setFormData({ studentId: '', subjectId: '', grade: 0 });
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (grade: GradeWithDetails) => {
    setEditingGrade(grade);
    setFormData({
      studentId: grade.studentId,
      subjectId: grade.subjectId,
      grade: grade.grade,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);

    try {
      if (editingGrade) {
        await gradesApi.update(editingGrade.id, formData);
      } else {
        await gradesApi.create(formData);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Ошибка сохранения');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Удалить эту оценку?')) return;
    try {
      await gradesApi.delete(id);
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка удаления');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.type === 'number' ? Number(e.target.value) : e.target.value });
  };

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 className="card-title">Оценки</h2>
          <button className="btn btn-primary" onClick={openCreateModal}>
            Добавить оценку
          </button>
        </div>

        <div className="search-form">
          <input
            type="text"
            className="search-input"
            placeholder="Поиск по студенту, предмету, номеру..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="form-select"
            style={{ width: 'auto', minWidth: '200px' }}
            value={studentFilter}
            onChange={(e) => setStudentFilter(e.target.value)}
          >
            <option value="">Все студенты</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>{s.fullName} ({s.studentNumber})</option>
            ))}
          </select>
          <select
            className="form-select"
            style={{ width: 'auto', minWidth: '200px' }}
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
          >
            <option value="">Все предметы</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <div className="loading">Загрузка...</div>
        ) : filteredGrades.length === 0 ? (
          <div className="empty-state">Оценки не найдены</div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Студент</th>
                  <th>Номер студенческого</th>
                  <th>Предмет</th>
                  <th>Оценка</th>
                  <th>Дата</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {filteredGrades.map((grade) => (
                  <tr key={grade.id}>
                    <td>{grade.studentFullName}</td>
                    <td>{grade.studentNumber}</td>
                    <td>{grade.subjectName}</td>
                    <td>
                      <span className={`badge ${grade.grade >= 70 ? 'badge-success' : grade.grade >= 50 ? 'badge-warning' : 'badge-danger'}`}>
                        {grade.grade}
                      </span>
                    </td>
                    <td>{new Date(grade.createRowTime).toLocaleDateString('ru-RU')}</td>
                    <td>
                      <button className="btn btn-secondary btn-sm" onClick={() => openEditModal(grade)}>
                        Редактировать
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(grade.id)}>
                        Удалить
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingGrade ? 'Редактировать оценку' : 'Добавить оценку'}>
        <form onSubmit={handleSubmit}>
          {formError && <div className="alert alert-error">{formError}</div>}
          <div className="form-group">
            <label className="form-label" htmlFor="studentId">Студент *</label>
            <select
              id="studentId"
              name="studentId"
              className="form-select"
              value={formData.studentId}
              onChange={handleInputChange}
              required
            >
              <option value="">Выберите студента</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>{s.fullName} ({s.studentNumber})</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="subjectId">Предмет *</label>
            <select
              id="subjectId"
              name="subjectId"
              className="form-select"
              value={formData.subjectId}
              onChange={handleInputChange}
              required
            >
              <option value="">Выберите предмет</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="grade">Оценка (0-100) *</label>
            <input
              type="number"
              id="grade"
              name="grade"
              className="form-input"
              value={formData.grade}
              onChange={handleInputChange}
              min="0"
              max="100"
              step="0.1"
              required
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
              Отмена
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Сохранение...' : editingGrade ? 'Сохранить' : 'Создать'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
