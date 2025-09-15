import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Student from '@/models/Student';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const student = await Student.findOne({ student_id: params.id }).lean();
    
    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ student });
  } catch (error) {
    console.error('Get student error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { name, department, year, face_encoding } = await request.json();

    await connectDB();

    const updateData: any = {};
    if (name) updateData.name = name;
    if (department) updateData.department = department;
    if (year) updateData.year = year;
    if (face_encoding) updateData.face_encoding = face_encoding;

    const student = await Student.findOneAndUpdate(
      { student_id: params.id },
      updateData,
      { new: true }
    ).lean();

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Student updated successfully',
      student,
    });
  } catch (error) {
    console.error('Update student error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}