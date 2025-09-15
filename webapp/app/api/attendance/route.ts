import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Student from '@/models/Student';
import { getCurrentDate } from '@/lib/utils';
import type { AttendanceFilters } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { student_id, details } = await request.json();

    if (!student_id || !details) {
      return NextResponse.json(
        { error: 'Student ID and attendance details are required' },
        { status: 400 }
      );
    }

    const { subject, department, year, semester, class_div } = details;
    const today = getCurrentDate();

    await connectDB();

    // Check if attendance already marked for today and subject
    const existingAttendance = await Student.findOne({
      student_id,
      'attendance.date': today,
      'attendance.subject': subject,
    });

    if (existingAttendance) {
      return NextResponse.json(
        { error: `Attendance already marked for ${student_id} in ${subject} today` },
        { status: 400 }
      );
    }

    // Mark attendance
    const attendanceRecord = {
      date: today,
      timestamp: new Date(),
      status: 'Present' as const,
      subject,
      department,
      year,
      semester,
      class_div,
    };

    const result = await Student.updateOne(
      { student_id },
      { $push: { attendance: attendanceRecord } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: 'Failed to mark attendance or student not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: `Attendance marked for ${student_id} in ${subject}`,
      record: attendanceRecord,
    });
  } catch (error) {
    console.error('Mark attendance error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const filters: AttendanceFilters = {};
    if (searchParams.get('student_id')) filters.student_id = searchParams.get('student_id')!;
    if (searchParams.get('department')) filters.department = searchParams.get('department')!;
    if (searchParams.get('year')) filters.year = searchParams.get('year')!;
    if (searchParams.get('date')) filters.date = searchParams.get('date')!;
    if (searchParams.get('subject')) filters.subject = searchParams.get('subject')!;
    if (searchParams.get('semester')) filters.semester = searchParams.get('semester')!;
    if (searchParams.get('class_div')) filters.class_div = searchParams.get('class_div')!;

    await connectDB();

    const pipeline: any[] = [];
    
    // Match students based on filters
    const studentMatch: any = {};
    if (filters.student_id) studentMatch.student_id = filters.student_id;
    if (filters.department) studentMatch.department = filters.department;
    if (filters.year) studentMatch.year = filters.year;
    
    if (Object.keys(studentMatch).length > 0) {
      pipeline.push({ $match: studentMatch });
    }

    // Unwind attendance array
    pipeline.push({ $unwind: '$attendance' });

    // Match attendance records based on filters
    const attendanceMatch: any = {};
    if (filters.date) attendanceMatch['attendance.date'] = filters.date;
    if (filters.subject) attendanceMatch['attendance.subject'] = filters.subject;
    if (filters.semester) attendanceMatch['attendance.semester'] = filters.semester;
    if (filters.class_div) attendanceMatch['attendance.class_div'] = filters.class_div;

    if (Object.keys(attendanceMatch).length > 0) {
      pipeline.push({ $match: attendanceMatch });
    }

    // Project the result
    pipeline.push({
      $project: {
        student_id: 1,
        name: 1,
        department: 1,
        year: 1,
        date: '$attendance.date',
        subject: '$attendance.subject',
        semester: '$attendance.semester',
        class_div: '$attendance.class_div',
        status: '$attendance.status',
        timestamp: '$attendance.timestamp',
      },
    });

    // Sort by date and timestamp
    pipeline.push({ $sort: { date: -1, timestamp: -1 } });

    const records = await Student.aggregate(pipeline);

    return NextResponse.json({ records });
  } catch (error) {
    console.error('Get attendance error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}