import React, { useState, useEffect } from 'react';
import { studentsApi, type Student, type StudentCreate, type StudentUpdate } from '../api';
import { Modal } from '../components/Modal';

export const StudentsPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState<StudentCreate>({
    fullName: '',
    studentNumber: '',
    enrollmentDate: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await studentsApi.getAll();
      setStudents(response.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки студентов');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const filteredStudents = students.filter(
    (s) =>
      s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.studentNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openCreateModal = () => {
    setEditingStudent(null);
    setFormData({ fullName: '', studentNumber: '', enrollmentDate: '' });
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      fullName: student.fullName,
      studentNumber: student.studentNumber,
      enrollmentDate: student.enrollmentDate,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);

    try {
      if (editingStudent) {
        await studentsApi.update(editingStudent.id, formData);
      } else {
        await studentsApi.create(formData);
      }
      setIsModalOpen(false);
      fetchStudents();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Ошибка сохранения');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Удалить этого студента?')) return;
    try {
      await studentsApi.delete(id);
      fetchStudents();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка удаления');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 className="card-title">Студенты</h2>
          <button className="btn btn-primary" onClick={openCreateModal}>
            Добавить студента
          </button>
        </div>

        <div className="search-form">
          <input
            type="text"
            className="search-input"
            placeholder="Поиск по имени или номеру студенческого..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <div className="loading">Загрузка...</div>
        ) : filteredStudents.length === 0 ? (
          <div className="empty-state">Студенты не найдены</div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ФИО</th>
                  <th>Номер студенческого</th>
                  <th>Дата поступления</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id}>
                    <td>{student.fullName}</td>
                    <td>{student.studentNumber}</td>
                    <td>{student.enrollmentDate}</td>
                    <td>
                      <button className="btn btn-secondary btn-sm" onClick={() => openEditModal(student)}>
                        Редактировать
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(student.id)}>
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingStudent ? 'Редактировать студента' : 'Добавить студента'}>
        <form onSubmit={handleSubmit}>
          {formError && <div className="alert alert-error">{formError}</div>}
          <div className="form-group">
            <label className="form-label" htmlFor="fullName">ФИО *</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              className="form-input"
              value={formData.fullName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="studentNumber">Номер студенческого *</label>
            <input
              type="text"
              id="studentNumber"
              name="studentNumber"
              className="form-input"
              value={formData.studentNumber}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="enrollmentDate">Дата поступления *</label>
            <input
              type="date"
              id="enrollmentDate"
              name="enrollmentDate"
              className="form-input"
              value={formData.enrollmentDate}
              onChange={handleInputChange}
              required
              max={today}
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
              Отмена
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Сохранение...' : editingStudent ? 'Сохранить' : 'Создать'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
