import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcrypt';

// 環境変数をロード
dotenv.config();

// 環境変数からSupabaseのURLとAPIキーを取得
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Supabase URL または Service Role Key が未設定');
  process.exit(1);
}

// Supabaseクライアントの作成
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

/**
 * パスワードをハッシュ化して更新する関数
 */
const hashPasswords = async () => {
  try {
    console.log('すべてのアカウントを取得中...');
    // すべてのアカウントを取得
    const { data, error } = await supabase.from('accounts').select('*');

    if (error) {
      throw error;
    }

    console.log(`取得したアカウント数: ${data.length}`);

    for (const account of data) {
      const { userID, password } = account;

      console.log(`処理中のユーザーID: ${userID}`);

      // パスワードがすでにハッシュ化されているか確認
      if (
        password.startsWith('$2b$') ||
        password.startsWith('$2a$') ||
        password.startsWith('$2y$')
      ) {
        console.log(
          `ユーザーID: ${userID} のパスワードは既にハッシュ化されています。スキップします。`
        );
        continue;
      }

      // パスワードのハッシュ化
      const saltRounds = 10;
      console.log(`ユーザーID: ${userID} のパスワードをハッシュ化中...`);
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // データベースを更新
      console.log(
        `ユーザーID: ${userID} のパスワードをデータベースに更新中...`
      );
      const { error: updateError } = await supabase
        .from('accounts')
        .update({ password: hashedPassword })
        .eq('userID', userID);

      if (updateError) {
        console.error(
          `ユーザーID: ${userID} のパスワード更新中にエラーが発生しました:`,
          updateError
        );
      } else {
        console.log(
          `ユーザーID: ${userID} のパスワードをハッシュ化して更新しました。`
        );
      }
    }

    console.log('すべてのパスワードのハッシュ化と更新が完了しました。');
  } catch (err) {
    console.error('エラーが発生しました:', err);
  } finally {
    // Supabaseクライアントを終了
    await supabase.removeAllSubscriptions();
    process.exit();
  }
};

// スクリプトの実行
hashPasswords();
