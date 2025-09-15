import { NextRequest, NextResponse } from 'next/server';
import { MockDatabase } from '@/lib/mockdb';

const db = new MockDatabase();

export async function POST(request: NextRequest) {
  try {
    await db.createInitialTeacher();
    return NextResponse.json({ message: 'Initial setup completed successfully' });
  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}