import jwt from 'jsonwebtoken';
import { SessionData } from '@/types';

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error('Please define the JWT_SECRET environment variable inside .env.local');
}

export function signToken(payload: Omit<SessionData, 'iat' | 'exp'>) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): SessionData | null {
  try {
    return jwt.verify(token, JWT_SECRET) as SessionData;
  } catch (error) {
    return null;
  }
}

export function getTokenFromRequest(request: Request): string | null {
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
}

export function createAuthResponse(success: boolean, message: string, data?: any) {
  return {
    success,
    message,
    data
  };
}