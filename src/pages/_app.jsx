import "./styles/globals.css";
import Head from "next/head";

import { useArray } from "/src/hooks/useArray";
import { useChangeBgColor } from "/src/hooks/useChangeBgColor";
import { useCounter } from "/src/hooks/useCounter";

function MyApp({ Component, pageProps }) {
  const counter = useCounter();
  const inputArray = useArray();
  useChangeBgColor();

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} foo={123} {...counter} {...inputArray} />;
    </>
  );
}

export default MyApp;
