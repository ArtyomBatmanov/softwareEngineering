import api from './axios';
import type { Subject, SubjectCreate, SubjectUpdate, SubjectAverage } from './types';

export const subjectsApi = {
  getAll: (skip = 0, limit = 100) =>
    api.get<Subject[]>(`/subjects?skip=${skip}&limit=${limit}`),

  getById: (id: string) =>
    api.get<Subject>(`/subjects/${id}`),

  create: (data: SubjectCreate) =>
    api.post<Subject>('/subjects', data),

  update: (id: string, data: SubjectUpdate) =>
    api.put<Subject>(`/subjects/${id}`, data),

  delete: (id: string) =>
    api.delete(`/subjects/${id}`),

  getAverage: (id: string) =>
    api.get<SubjectAverage>(`/subjects/${id}/average`),
};
