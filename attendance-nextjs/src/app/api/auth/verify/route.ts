import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromRequest, verifyToken, createAuthResponse } from '@/utils/auth';

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    
    if (!token) {
      return NextResponse.json(
        createAuthResponse(false, 'No token provided'),
        { status: 401 }
      );
    }

    const session = verifyToken(token);
    if (!session) {
      return NextResponse.json(
        createAuthResponse(false, 'Invalid token'),
        { status: 401 }
      );
    }

    return NextResponse.json(
      createAuthResponse(true, 'Token is valid', {
        username: session.username,
        role: session.role
      })
    );

  } catch (error) {
    console.error('Verify token error:', error);
    return NextResponse.json(
      createAuthResponse(false, 'Internal server error'),
      { status: 500 }
    );
  }
}