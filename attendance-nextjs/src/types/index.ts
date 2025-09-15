export interface User {
  username: string;
  password: string;
  role: 'teacher' | 'student';
}

export interface Student {
  student_id: string;
  name: string;
  department: string;
  year: string;
  face_encoding: number[];
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

export interface AttendanceDetails {
  date: string;
  department: string;
  year: string;
  semester: string;
  class_div: string;
  subject: string;
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

export interface FaceRecognitionResult {
  studentId: string;
  name: string;
  confidence: number;
}

export interface SessionData {
  username: string;
  role: 'teacher' | 'student';
  iat: number;
  exp: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export const SUBJECT_MAP: Record<string, Record<string, string[]>> = {
  "Computer science": {
    "1": ["C Programming", "Mathematics I", "Physics", "English", "Basic Electronics"],
    "2": ["C++", "Data Structures", "Mathematics II", "Digital Electronics", "Computer Organization"],
    "3": ["Java", "Database Systems", "Operating Systems", "Computer Networks", "Software Engineering"],
    "4": ["Machine Learning", "Web Development", "Artificial Intelligence", "Project", "Internship"]
  },
  "Information technology": {
    "1": ["C Programming", "Mathematics I", "Physics", "English", "IT Fundamentals"],
    "2": ["C++", "Data Structures", "Mathematics II", "Web Technologies", "Database Fundamentals"],
    "3": ["Java", "System Administration", "Network Security", "Mobile Development", "Cloud Computing"],
    "4": ["Cybersecurity", "DevOps", "IoT", "Project", "Internship"]
  },
  "AI and DS": {
    "1": ["Python", "Statistics", "Mathematics I", "English", "Data Science Intro"],
    "2": ["Machine Learning", "Data Structures", "Probability", "R Programming", "Data Visualization"],
    "3": ["Deep Learning", "Big Data", "Natural Language Processing", "Computer Vision", "Ethics in AI"],
    "4": ["Advanced AI", "Research Project", "Industry Project", "Thesis", "Internship"]
  }
};