import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';
// import { useCookies } from 'react-cookie';

export function Login() {
  const router = useRouter();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');

  const [userIdErrorMessages, setUserIdErrorMessages] = useState('');
  const [passwordErrorMessages, setPasswordErrorMessages] = useState('');
  // const [errorMessage, setErrorMessage] = useState('');
  // const [cookies, setCookie] = useCookies();

  const onLogin = async (e: FormEvent<Element>) => {
    e.preventDefault();

    if (!userId || !password) {
      setUserIdErrorMessages(
        userIdErrorMessages
          ? ''
          : 'なんでユーザーIDを入力しないんだよ、アホかお前。'
      );
      setPasswordErrorMessages(
        passwordErrorMessages
          ? ''
          : '入力欄あるんだから空でボタン押すバカいないだろ、クソが。'
      );
    } else {
      setUserIdErrorMessages('');
      setPasswordErrorMessages('');

      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: userId, password }),
        });

        const data: { message: string } = await response.json();

        if (response.ok) {
          alert('ログイン成功！');
          router.push('/');
        } else {
          alert(data.message);
        }
      } catch (err) {
        console.error('Login error:', err);
        alert('パスワードとIDぐらい覚えとけよ、バカ。');
      }
    }
  };

  const toSignupPage = () => {};

  return (
    <>
      <main className="flex justify-center items-center">
        <section className="w-[450px] h-[300px] rounded-[2px] border border-solid px-4 my-auto">
          <h1 className="text-center text-xl mt-4">
            僕だけの
            <span className="text-4xl font-bold">
              <span className="text-green-600">想</span>
              <span className="text-yellow-600">い</span>
              <span className="text-red-600">出</span>
              <span className="text-pink-600">C</span>
              <span className="text-purple-600">G</span>
            </span>
            を作るカレンダー
          </h1>
          <form className="mt-6 w-[330px] mx-auto" onSubmit={(e) => onLogin(e)}>
            <div>
              <div className="flex justify-end w-full">
                <label htmlFor="userId" className="mr-2">
                  ID:
                </label>
                <Input
                  name="userId"
                  text={userId}
                  className="pl-2"
                  placeholder="IDを入力"
                  onChangeText={(text: string) => setUserId(text)}
                />
              </div>
              {userIdErrorMessages && (
                <p className="text-xs text-red-400 text-right">
                  {userIdErrorMessages}
                </p>
              )}
              <div className="mt-4">
                <div className="flex justify-end w-full">
                  <label htmlFor="password" className="mr-2">
                    パスワード:
                  </label>
                  <Input
                    name="password"
                    text={password}
                    className="pl-2"
                    placeholder="パスワードを入力"
                    onChangeText={(text: string) => setPassword(text)}
                  />
                </div>
                {passwordErrorMessages && (
                  <p className="text-xs text-red-400 text-right">
                    {passwordErrorMessages}
                  </p>
                )}
              </div>
            </div>
            <div className="flex ">
              <div className="mt-5 mr-2">
                <Button
                  type="submit"
                  text="ログイン"
                  buttonColor="#a7f3d0"
                  underBarColor="#059669"
                />
              </div>
              <div className="mt-5">
                <Button
                  text="サインイン"
                  buttonColor="#a7f3d0"
                  underBarColor="#059669"
                  onEventCallBack={() => toSignupPage()}
                />
              </div>
            </div>
          </form>
        </section>
      </main>
    </>
  );
}
