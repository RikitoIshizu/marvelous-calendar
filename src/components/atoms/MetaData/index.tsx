import React from "react";
import Head from "next/head";

export function MetaData(props: {
  title: string;
  description?: string;
}): React.ReactElement {
  return (
    <Head>
      {props.description ? (
        <meta name="description" content={props.description} />
      ) : null}
    </Head>
  );
}
