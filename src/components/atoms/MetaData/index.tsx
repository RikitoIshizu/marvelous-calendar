import React from "react";
import Head from "next/head";

type Props = {
  title: string;
  description?: string;
};

export function MetaData(props: Props) {
  return (
    <Head>
      {props.description ? (
        <meta name="description" content={props.description} />
      ) : null}
    </Head>
  );
}
