import api from './axios';
import type { Grade, GradeCreate, GradeUpdate, GradeWithDetails } from './types';

export const gradesApi = {
  getAll: (skip = 0, limit = 100) =>
    api.get<GradeWithDetails[]>(`/grades?skip=${skip}&limit=${limit}`),

  getById: (id: string) =>
    api.get<GradeWithDetails>(`/grades/${id}`),

  create: (data: GradeCreate) =>
    api.post<Grade>('/grades', data),

  update: (id: string, data: GradeUpdate) =>
    api.put<Grade>(`/grades/${id}`, data),

  delete: (id: string) =>
    api.delete(`/grades/${id}`),
};
