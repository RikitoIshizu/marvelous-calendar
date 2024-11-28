import type { NextApiRequest, NextApiResponse } from 'next';
import { parse, serialize } from 'cookie';
import { deleteSession } from '@/lib/sessionStore';

interface LogoutResponse {
  message: string;
}

const logoutHandler = (
  req: NextApiRequest,
  res: NextApiResponse<LogoutResponse>
): void => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  try {
    // クッキーからトークンを取得
    const cookies = parse(req.headers.cookie || '');
    const token = cookies.token;

    if (token) {
      // サーバー側のセッションを削除
      deleteSession(token);
    }

    // クッキーを無効化
    const cookie = serialize('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: new Date(0), // クッキーを無効化
      path: '/',
    });

    res.setHeader('Set-Cookie', cookie);
    res.status(200).json({ message: 'ログアウト成功' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: '内部サーバーエラー' });
  }
};

export default logoutHandler;
