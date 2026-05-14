import { NextRequest, NextResponse } from 'next/server';
import { createToken, verifyPassword } from '@/lib/auth/jwt';

export async function POST(request: NextRequest) {
  try {
    const { password, user } = await request.json();

    if (!password || !user) {
      return NextResponse.json(
        { error: 'Missing password or user' },
        { status: 400 }
      );
    }

    if (!['andy', 'aileen'].includes(user)) {
      return NextResponse.json(
        { error: 'Invalid user' },
        { status: 400 }
      );
    }

    if (!verifyPassword(password)) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    let token: string;
    try {
      token = await createToken(user as 'andy' | 'aileen');
    } catch (tokenError) {
      console.error('Token creation failed:', tokenError);
      return NextResponse.json(
        { error: 'Failed to create session' },
        { status: 500 }
      );
    }

    const response = NextResponse.json(
      { token, user },
      { status: 200 }
    );

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
