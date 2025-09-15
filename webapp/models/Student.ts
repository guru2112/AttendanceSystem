import mongoose, { Document, Schema } from 'mongoose';

export interface IAttendanceRecord {
  date: string;
  timestamp: Date;
  status: 'Present' | 'Absent';
  subject: string;
  department: string;
  year: string;
  semester: string;
  class_div: string;
}

export interface IStudent extends Document {
  student_id: string;
  name: string;
  department: string;
  year: string;
  face_encoding: number[];
  attendance: IAttendanceRecord[];
  createdAt: Date;
}

const attendanceRecordSchema = new Schema<IAttendanceRecord>({
  date: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  status: { type: String, enum: ['Present', 'Absent'], required: true },
  subject: { type: String, required: true },
  department: { type: String, required: true },
  year: { type: String, required: true },
  semester: { type: String, required: true },
  class_div: { type: String, required: true },
});

const studentSchema = new Schema<IStudent>({
  student_id: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  department: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  face_encoding: {
    type: [Number],
    required: true,
  },
  attendance: [attendanceRecordSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Student || mongoose.model<IStudent>('Student', studentSchema);