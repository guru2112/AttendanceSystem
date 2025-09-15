// types/index.ts

export interface User {
  username: string;
  role: 'teacher' | 'student';
}

export interface Student {
  student_id: string;
  name: string;
  department: string;
  year: string;
  attendance?: AttendanceRecord[];
}

export interface AttendanceRecord {
  student_id: string;
  name: string;
  date: string;
  subject: string;
  semester: string;
  status: 'Present' | 'Absent';
}

export interface AttendanceDetails {
  student_id: string;
  date: string;
  subject: string;
  department: string;
  year: string;
  semester: string;
  class_div?: string;
}

export interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  error?: string;
  data?: T;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface StudentRegistration {
  student_id: string;
  name: string;
  department: string;
  year: string;
}

export interface AttendanceFilters {
  student_id?: string;
  department?: string;
  year?: string;
  date?: string;
  subject?: string;
  semester?: string;
  class_div?: string;
}