import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Student from '@/models/Student';
import User from '@/models/User';
import { hashPassword, validateStudentId, validateName } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const { student_id, name, department, year, face_encoding } = await request.json();

    // Validation
    if (!validateStudentId(student_id)) {
      return NextResponse.json(
        { error: 'Invalid student ID format' },
        { status: 400 }
      );
    }

    if (!validateName(name)) {
      return NextResponse.json(
        { error: 'Name must be at least 2 characters long' },
        { status: 400 }
      );
    }

    if (!department || !year || !face_encoding) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if student already exists
    const existingStudent = await Student.findOne({ student_id });
    if (existingStudent) {
      return NextResponse.json(
        { error: 'Student ID already exists' },
        { status: 400 }
      );
    }

    // Create student record
    const student = await Student.create({
      student_id,
      name,
      department,
      year,
      face_encoding,
      attendance: [],
    });

    // Create user account for student
    const hashedPassword = await hashPassword(student_id);
    await User.create({
      username: student_id,
      password: hashedPassword,
      role: 'student',
    });

    return NextResponse.json({
      message: 'Student registered successfully',
      student: {
        student_id: student.student_id,
        name: student.name,
        department: student.department,
        year: student.year,
      },
    });
  } catch (error) {
    console.error('Student registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const students = await Student.find({}, 'student_id name department year').lean();
    return NextResponse.json({ students });
  } catch (error) {
    console.error('Get students error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}