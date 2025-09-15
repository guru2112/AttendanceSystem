import fs from 'fs';
import path from 'path';
import { hashPassword, verifyPassword } from './utils';

interface User {
  id: string;
  username: string;
  password: string;
  role: 'teacher' | 'student';
  createdAt: Date;
}

interface Student {
  student_id: string;
  name: string;
  department: string;
  year: string;
  face_encoding: number[];
  attendance: AttendanceRecord[];
  createdAt: Date;
}

interface AttendanceRecord {
  date: string;
  timestamp: Date;
  status: 'Present' | 'Absent';
  subject: string;
  department: string;
  year: string;
  semester: string;
  class_div: string;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const STUDENTS_FILE = path.join(DATA_DIR, 'students.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize files if they don't exist
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify([]));
}

if (!fs.existsSync(STUDENTS_FILE)) {
  fs.writeFileSync(STUDENTS_FILE, JSON.stringify([]));
}

export class MockDatabase {
  private readUsers(): User[] {
    try {
      const data = fs.readFileSync(USERS_FILE, 'utf8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  private writeUsers(users: User[]): void {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  }

  private readStudents(): Student[] {
    try {
      const data = fs.readFileSync(STUDENTS_FILE, 'utf8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  private writeStudents(students: Student[]): void {
    fs.writeFileSync(STUDENTS_FILE, JSON.stringify(students, null, 2));
  }

  async createInitialTeacher(): Promise<void> {
    const users = this.readUsers();
    const existingTeacher = users.find(user => user.role === 'teacher');
    
    if (!existingTeacher) {
      const hashedPassword = await hashPassword('teacher123');
      const teacher: User = {
        id: 'teacher-1',
        username: 'teacher',
        password: hashedPassword,
        role: 'teacher',
        createdAt: new Date(),
      };
      users.push(teacher);
      this.writeUsers(users);
    }
  }

  async getUserByUsername(username: string): Promise<User | null> {
    const users = this.readUsers();
    return users.find(user => user.username === username) || null;
  }

  async createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const users = this.readUsers();
    const user: User = {
      id: `user-${Date.now()}`,
      ...userData,
      createdAt: new Date(),
    };
    users.push(user);
    this.writeUsers(users);
    return user;
  }

  async createStudent(studentData: Omit<Student, 'createdAt'>): Promise<Student> {
    const students = this.readStudents();
    const student: Student = {
      ...studentData,
      createdAt: new Date(),
    };
    students.push(student);
    this.writeStudents(students);
    return student;
  }

  async getStudentById(student_id: string): Promise<Student | null> {
    const students = this.readStudents();
    return students.find(student => student.student_id === student_id) || null;
  }

  async updateStudent(student_id: string, updateData: Partial<Student>): Promise<Student | null> {
    const students = this.readStudents();
    const index = students.findIndex(student => student.student_id === student_id);
    
    if (index === -1) return null;
    
    students[index] = { ...students[index], ...updateData };
    this.writeStudents(students);
    return students[index];
  }

  async getAllStudents(): Promise<Student[]> {
    return this.readStudents();
  }

  async markAttendance(student_id: string, attendanceRecord: AttendanceRecord): Promise<boolean> {
    const students = this.readStudents();
    const index = students.findIndex(student => student.student_id === student_id);
    
    if (index === -1) return false;
    
    // Check if already marked for today and subject
    const alreadyMarked = students[index].attendance.some(
      record => record.date === attendanceRecord.date && record.subject === attendanceRecord.subject
    );
    
    if (alreadyMarked) return false;
    
    students[index].attendance.push(attendanceRecord);
    this.writeStudents(students);
    return true;
  }

  async getFilteredAttendance(filters: any): Promise<any[]> {
    const students = this.readStudents();
    const results: any[] = [];

    for (const student of students) {
      // Filter students
      if (filters.student_id && student.student_id !== filters.student_id) continue;
      if (filters.department && student.department !== filters.department) continue;
      if (filters.year && student.year !== filters.year) continue;

      // Filter attendance records
      for (const record of student.attendance) {
        if (filters.date && record.date !== filters.date) continue;
        if (filters.subject && record.subject !== filters.subject) continue;
        if (filters.semester && record.semester !== filters.semester) continue;
        if (filters.class_div && record.class_div !== filters.class_div) continue;

        results.push({
          student_id: student.student_id,
          name: student.name,
          department: student.department,
          year: student.year,
          date: record.date,
          subject: record.subject,
          semester: record.semester,
          class_div: record.class_div,
          status: record.status,
          timestamp: record.timestamp,
        });
      }
    }

    return results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
}