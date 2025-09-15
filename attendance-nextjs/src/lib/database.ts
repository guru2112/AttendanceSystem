import { MongoClient, Db, Collection } from 'mongodb';
import bcrypt from 'bcryptjs';
import { AttendanceFilters } from '@/types';

const uri = process.env.MONGODB_URI as string;

if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  var _mongoClientPromise: Promise<MongoClient>;
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export async function connectToDatabase() {
  const client = await clientPromise;
  const db = client.db('face_recognition_system');
  return { client, db };
}

interface AttendanceDetails {
  date: string;
  subject: string;
  department: string;
  year: string;
  semester: string;
  class_div: string;
}

export class Database {
  private db: Db;
  private usersCollection: Collection;
  private studentsCollection: Collection;

  constructor(db: Db) {
    this.db = db;
    this.usersCollection = db.collection('users');
    this.studentsCollection = db.collection('students');
  }

  async createInitialTeacher() {
    const existingTeacher = await this.usersCollection.findOne({ role: 'teacher' });
    if (!existingTeacher) {
      const hashedPassword = await bcrypt.hash('teacher123', 12);
      await this.usersCollection.insertOne({
        username: 'teacher',
        password: hashedPassword,
        role: 'teacher'
      });
      console.log('Default teacher created. Username: teacher, Password: teacher123');
    }
  }

  async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  async getUser(username: string) {
    return this.usersCollection.findOne({ username }, { projection: { _id: 0 } });
  }

  async registerStudent(studentId: string, name: string, department: string, year: string, faceEncoding: number[]) {
    const existingStudent = await this.studentsCollection.findOne({ student_id: studentId });
    if (existingStudent) {
      return { success: false, message: 'Student ID already exists.' };
    }

    await this.studentsCollection.insertOne({
      student_id: studentId,
      name,
      department,
      year,
      face_encoding: faceEncoding,
      attendance: []
    });

    const hashedPassword = await bcrypt.hash(studentId, 12);
    await this.usersCollection.insertOne({
      username: studentId,
      password: hashedPassword,
      role: 'student'
    });

    return { success: true, message: 'Student registered successfully.' };
  }

  async getAllStudentData() {
    const students = await this.studentsCollection.find(
      {},
      { projection: { _id: 0, student_id: 1, name: 1, face_encoding: 1 } }
    ).toArray();

    return {
      encodings: students.map(s => s.face_encoding),
      names: students.map(s => s.name),
      ids: students.map(s => s.student_id)
    };
  }

  async markAttendance(studentId: string, details: AttendanceDetails) {
    const { date, subject } = details;
    
    const existingRecord = await this.studentsCollection.findOne({
      student_id: studentId,
      'attendance.date': date,
      'attendance.subject': subject
    });

    if (existingRecord) {
      return `Attendance already marked for ${studentId} in ${subject} today.`;
    }

    const newRecord = {
      date,
      timestamp: new Date(),
      status: 'Present',
      subject,
      department: details.department,
      year: details.year,
      semester: details.semester,
      class_div: details.class_div
    };

    const result = await this.studentsCollection.updateOne(
      { student_id: studentId },
      { $push: { attendance: newRecord } } as any // Type assertion for MongoDB operations
    );

    return result.modifiedCount > 0 
      ? `Attendance marked for ${studentId} in ${subject}.`
      : `Failed to mark attendance for ${studentId}.`;
  }

  async getFilteredAttendance(filters: AttendanceFilters) {
    const pipeline: Record<string, unknown>[] = [];
    const studentMatch: Record<string, string> = {};
    const attendanceMatch: Record<string, string> = {};

    if (filters.student_id) studentMatch.student_id = filters.student_id;
    if (filters.department) studentMatch.department = filters.department;
    if (filters.year) studentMatch.year = filters.year;
    if (filters.date) attendanceMatch.date = filters.date;
    if (filters.subject) attendanceMatch.subject = filters.subject;
    if (filters.semester) attendanceMatch.semester = filters.semester;
    if (filters.class_div) attendanceMatch.class_div = filters.class_div;

    if (Object.keys(studentMatch).length > 0) {
      pipeline.push({ $match: studentMatch });
    }

    pipeline.push({ $unwind: '$attendance' });

    if (Object.keys(attendanceMatch).length > 0) {
      const attendanceMatchFormatted: Record<string, string> = {};
      Object.keys(attendanceMatch).forEach(key => {
        attendanceMatchFormatted[`attendance.${key}`] = attendanceMatch[key];
      });
      pipeline.push({ $match: attendanceMatchFormatted });
    }

    pipeline.push({
      $project: {
        _id: 0,
        student_id: '$student_id',
        name: '$name',
        date: '$attendance.date',
        subject: '$attendance.subject',
        semester: '$attendance.semester',
        status: '$attendance.status'
      }
    });

    return this.studentsCollection.aggregate(pipeline).toArray();
  }

  async getStudentById(studentId: string) {
    return this.studentsCollection.findOne(
      { student_id: studentId },
      { projection: { _id: 0, face_encoding: 0, attendance: 0 } }
    );
  }

  async updateStudentDetails(studentId: string, name: string, dept: string, year: string) {
    const result = await this.studentsCollection.updateOne(
      { student_id: studentId },
      { $set: { name, department: dept, year } }
    );
    return result.modifiedCount > 0;
  }

  async updateFaceEncoding(studentId: string, newFaceEncoding: number[]) {
    const result = await this.studentsCollection.updateOne(
      { student_id: studentId },
      { $set: { face_encoding: newFaceEncoding } }
    );
    return result.modifiedCount > 0;
  }

  async getStudentDetails(studentId: string) {
    return this.studentsCollection.findOne(
      { student_id: studentId },
      { projection: { _id: 0, name: 1, department: 1, year: 1, attendance: 1 } }
    );
  }
}

export default clientPromise;