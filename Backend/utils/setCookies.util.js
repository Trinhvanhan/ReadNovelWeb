import { serialize } from 'cookie';

// Dùng cho Express hoặc Next.js API routes
export function setSessionCookies(res, { token, refreshToken, user }) {
  const tokenCookie = serialize('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60, // 1 hour
    path: '/',
  });

  const refreshCookie = serialize('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
  });

  const sessionCookie = serialize('session', JSON.stringify({
    user,
    expiresAt: Date.now() + 60 * 60 * 1000 // nên để đơn vị là ms
  }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60, // 1 hour (giây)
    path: '/',
  });


  res.setHeader('Set-Cookie', [tokenCookie, refreshCookie, sessionCookie]);
}
