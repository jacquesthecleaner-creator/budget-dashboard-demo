import * as jose from 'jose';

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-insecure-key-change-in-production'
);

export interface AuthPayload {
  user: 'andy' | 'aileen';
  iat?: number;
  exp?: number;
}

export async function createToken(user: 'andy' | 'aileen'): Promise<string> {
  return new jose.SignJWT({ user })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(secret);
}

export async function verifyToken(token: string): Promise<AuthPayload> {
  try {
    const verified = await jose.jwtVerify(token, secret);
    return verified.payload as unknown as AuthPayload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

export function verifyPassword(inputPassword: string): boolean {
  const correctPassword = process.env.DASHBOARD_PASSWORD || 'demo123';
  console.log('Verifying password:', {
    input: inputPassword,
    expected: correctPassword,
    envVar: process.env.DASHBOARD_PASSWORD,
    match: inputPassword === correctPassword
  });
  return inputPassword === correctPassword;
}
