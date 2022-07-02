import "../styles/globals.css";
import "tailwindcss/tailwind.css";
import Head from "next/head";
import { AppProps } from "next/app";
import Script from "next/script";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <title>すごいかれんだあ</title>
        <meta
          name="description"
          content="ぼくがかんがえた すごい カレンダー だよ。"
        />
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/react-modal/3.14.3/react-modal.min.js"
          integrity="sha512-MY2jfK3DBnVzdS2V8MXo5lRtr0mNRroUI9hoLVv2/yL3vrJTam3VzASuKQ96fLEpyYIT4a8o7YgtUs5lPjiLVQ=="
          crossorigin="anonymous"
          referrerpolicy="no-referrer"
        />
      </Head>
      <Component />
    </>
  );
}

export default MyApp;
