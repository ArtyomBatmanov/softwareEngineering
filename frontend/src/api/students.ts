import api from './axios';
import type { Student, StudentCreate, StudentUpdate, StudentAverage } from './types';

export const studentsApi = {
  getAll: (skip = 0, limit = 100) =>
    api.get<Student[]>(`/students?skip=${skip}&limit=${limit}`),

  getById: (id: string) =>
    api.get<Student>(`/students/${id}`),

  create: (data: StudentCreate) =>
    api.post<Student>('/students', data),

  update: (id: string, data: StudentUpdate) =>
    api.put<Student>(`/students/${id}`, data),

  delete: (id: string) =>
    api.delete(`/students/${id}`),

  getAverage: (id: string) =>
    api.get<StudentAverage>(`/students/${id}/average`),
};
