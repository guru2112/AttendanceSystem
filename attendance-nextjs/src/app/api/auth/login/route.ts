import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase, Database } from '@/lib/database';
import { signToken, createAuthResponse } from '@/utils/auth';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        createAuthResponse(false, 'Username and password are required'),
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const database = new Database(db);

    // Get user from database
    const user = await database.getUser(username);
    if (!user) {
      return NextResponse.json(
        createAuthResponse(false, 'Invalid credentials'),
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await database.verifyPassword(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        createAuthResponse(false, 'Invalid credentials'),
        { status: 401 }
      );
    }

    // Create JWT token
    const token = signToken({
      username: user.username,
      role: user.role
    });

    return NextResponse.json(
      createAuthResponse(true, 'Login successful', {
        token,
        user: {
          username: user.username,
          role: user.role
        }
      })
    );

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      createAuthResponse(false, 'Internal server error'),
      { status: 500 }
    );
  }
}