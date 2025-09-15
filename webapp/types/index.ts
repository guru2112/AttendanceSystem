export interface User {
  id: string;
  username: string;
  role: 'teacher' | 'student';
}

export interface Student {
  student_id: string;
  name: string;
  department: string;
  year: string;
  face_encoding?: number[];
  attendance: AttendanceRecord[];
}

export interface AttendanceRecord {
  date: string;
  timestamp: Date;
  status: 'Present' | 'Absent';
  subject: string;
  department: string;
  year: string;
  semester: string;
  class_div: string;
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

export interface AttendanceSession {
  subject: string;
  department: string;
  year: string;
  semester: string;
  class_div: string;
  date: string;
}

export const DEPARTMENTS = ['Computer science', 'Information technology', 'AI and DS'] as const;
export const YEARS = ['1', '2', '3', '4'] as const;
export const SEMESTERS = ['1', '2', '3', '4', '5', '6', '7', '8'] as const;

export const SUBJECT_MAP: Record<string, Record<string, string[]>> = {
  'Computer science': {
    '1': ['Intro to Python', 'Discrete Mathematics'],
    '2': ['Data Structures', 'Algorithms'],
    '3': ['Database Systems', 'Computer Networks'],
    '4': ['Machine Learning', 'Compiler Design'],
  },
  'Information technology': {
    '1': ['Fundamentals of IT', 'Web Basics'],
    '2': ['Object Oriented Programming', 'Network Essentials'],
    '3': ['Information Security', 'Cloud Computing'],
    '4': ['E-Commerce', 'Big Data Analytics'],
  },
  'AI and DS': {
    '1': ['Linear Algebra', 'Calculus for DS'],
    '2': ['Probability & Statistics', 'Data Science Tools'],
    '3': ['Applied ML', 'Deep Learning'],
    '4': ['Reinforcement Learning', 'AI Ethics'],
  },
};