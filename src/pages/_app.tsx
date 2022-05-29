import Head from "next/head";
import "tailwindcss/tailwind.css";
import "/src/styles/globals.css";
import "/src/styles/styles_dev.css";

import { useBgColor } from "/src/hooks/useBgColor";

function MyApp({ Component, pageProps }) {
  useBgColor();
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />;
    </>
  );
}

export default MyApp;
