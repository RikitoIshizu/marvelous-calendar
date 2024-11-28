import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import { serialize } from 'cookie';
import { generateToken } from '@/lib/generateToken';
import { createSession } from '@/lib/sessionStore';
import { createClient } from '@supabase/supabase-js';

// Supabase クライアントのインポート
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

interface LoginRequestBody {
  id: string; // ユーザーID
  password: string;
}

interface LoginResponse {
  message: string;
}

const TOKEN_LENGTH = 16;

const login = async (
  req: NextApiRequest,
  res: NextApiResponse<LoginResponse>
): Promise<void> => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  try {
    const { id, password } = req.body as LoginRequestBody;

    // ユーザーの存在確認
    const { data, error } = await supabase
      .from('accounts')
      .select('userID, password')
      .eq('userID', id)
      .single(); // userID がユニークであることを仮定

    if (error || !data) {
      res.status(401).json({ message: 'IDかパスワードが間違っています' });
      return;
    }

    const hashedPassword = data.password;

    // パスワードの検証
    const isMatch = await bcrypt.compare(password, hashedPassword);
    if (!isMatch) {
      res.status(401).json({
        message: 'IDかパスワードが間違っていますよ。' + data,
      });
      return;
    }

    // 16桁のトークンを生成
    const token = generateToken(TOKEN_LENGTH);

    // セッションの作成（有効期限を1時間後に設定）
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1時間後
    createSession(token, {
      userId: data.userID,
      username: id, // または適切なユーザー名フィールド
      expiresAt,
    });

    // クッキーの設定
    const cookie = serialize('token', token, {
      httpOnly: true, // JavaScriptからアクセス不可
      secure: process.env.NODE_ENV === 'production', // HTTPSでのみ送信
      sameSite: 'strict', // CSRF対策
      maxAge: 60 * 60, // 1時間（秒単位）
      path: '/', // クッキーの有効パス
    });

    // Set-Cookieヘッダーを設定
    res.setHeader('Set-Cookie', cookie);

    // レスポンスを返す
    res.status(200).json({ message: 'ログイン成功' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: '内部サーバーエラー' });
  }
};

export default login;
