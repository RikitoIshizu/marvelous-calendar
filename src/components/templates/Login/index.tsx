import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { getLoginAccount } from '@/lib/supabase';
import { FormEvent, useState } from 'react';

export function Login() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessages, setErrorMessages] = useState('');

  const login = async (e: FormEvent<Element>) => {
    e.preventDefault();
    await getLoginAccount({ id, password });
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
          <form className="mt-6 w-[280px] mx-auto" onSubmit={(e) => login(e)}>
            <div className="w-[280px]">
              <div className="flex justify-end w-full">
                <label htmlFor="id" className="mr-2">
                  ID:
                </label>
                <Input
                  name="id"
                  text={id}
                  className="pl-2"
                  placeholder="IDを入力"
                  onChangeText={(text) => setId(text as string)}
                />
              </div>
              <div className="mt-4 flex justify-end w-full">
                <label htmlFor="password" className="mr-2">
                  パスワード:
                </label>
                <Input
                  name="password"
                  text={password}
                  className="pl-2"
                  placeholder="パスワードを入力"
                  onChangeText={(text) => setPassword(text as string)}
                />
              </div>
            </div>
            <div className="flex ">
              <div className="mt-5">
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
