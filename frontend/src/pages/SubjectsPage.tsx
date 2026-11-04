import React, { useState, useEffect } from 'react';
import { subjectsApi, type Subject, type SubjectCreate, type SubjectUpdate } from '../api';
import { Modal } from '../components/Modal';

export const SubjectsPage: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [formData, setFormData] = useState<SubjectCreate>({ name: '' });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const response = await subjectsApi.getAll();
      setSubjects(response.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки предметов');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const filteredSubjects = subjects.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openCreateModal = () => {
    setEditingSubject(null);
    setFormData({ name: '' });
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (subject: Subject) => {
    setEditingSubject(subject);
    setFormData({ name: subject.name });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);

    try {
      if (editingSubject) {
        await subjectsApi.update(editingSubject.id, formData);
      } else {
        await subjectsApi.create(formData);
      }
      setIsModalOpen(false);
      fetchSubjects();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Ошибка сохранения');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Удалить этот предмет?')) return;
    try {
      await subjectsApi.delete(id);
      fetchSubjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка удаления');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 className="card-title">Предметы</h2>
          <button className="btn btn-primary" onClick={openCreateModal}>
            Добавить предмет
          </button>
        </div>

        <div className="search-form">
          <input
            type="text"
            className="search-input"
            placeholder="Поиск по названию предмета..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <div className="loading">Загрузка...</div>
        ) : filteredSubjects.length === 0 ? (
          <div className="empty-state">Предметы не найдены</div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Название</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubjects.map((subject) => (
                  <tr key={subject.id}>
                    <td>{subject.name}</td>
                    <td>
                      <button className="btn btn-secondary btn-sm" onClick={() => openEditModal(subject)}>
                        Редактировать
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(subject.id)}>
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingSubject ? 'Редактировать предмет' : 'Добавить предмет'}>
        <form onSubmit={handleSubmit}>
          {formError && <div className="alert alert-error">{formError}</div>}
          <div className="form-group">
            <label className="form-label" htmlFor="name">Название предмета *</label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-input"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
              Отмена
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Сохранение...' : editingSubject ? 'Сохранить' : 'Создать'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
