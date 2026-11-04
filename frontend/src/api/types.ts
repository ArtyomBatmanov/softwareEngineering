export interface Student {
  id: string;
  fullName: string;
  studentNumber: string;
  enrollmentDate: string;
}

export interface StudentCreate {
  fullName: string;
  studentNumber: string;
  enrollmentDate: string;
}

export interface StudentUpdate {
  fullName?: string;
  studentNumber?: string;
  enrollmentDate?: string;
}

export interface StudentAverage {
  studentId: string;
  studentFullName: string;
  averageGrade: number | null;
  message?: string;
}

export interface Subject {
  id: string;
  name: string;
}

export interface SubjectCreate {
  name: string;
}

export interface SubjectUpdate {
  name?: string;
}

export interface SubjectAverage {
  subjectId: string;
  subjectName: string;
  averageGrade: number | null;
  message?: string;
}

export interface Grade {
  id: string;
  studentId: string;
  subjectId: string;
  grade: number;
  createRowTime: string;
}

export interface GradeCreate {
  studentId: string;
  subjectId: string;
  grade: number;
}

export interface GradeUpdate {
  studentId?: string;
  subjectId?: string;
  grade?: number;
}

export interface GradeWithDetails {
  id: string;
  studentId: string;
  studentFullName: string;
  studentNumber: string;
  subjectId: string;
  subjectName: string;
  grade: number;
  createRowTime: string;
}
