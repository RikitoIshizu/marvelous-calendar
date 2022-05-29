import React from "react";
import Head from "next/head";

type Props = {
  title: string;
  description: string;
};

export function MetaData(props: Props) {
  return (
    <Head>
      <title>{props.title}</title>
      <meta name="description" content={props.description} />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
}
