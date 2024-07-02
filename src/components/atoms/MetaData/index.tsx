import React, { NamedExoticComponent, memo } from "react";
import Head from "next/head";

type Props = {
  title: string;
  description?: string;
};

export const MetaData: NamedExoticComponent<Props> = memo(function MetaData(
  props: Props
) {
  return (
    <Head>
      {props.description ? (
        <meta name="description" content={props.description} />
      ) : null}
    </Head>
  );
});
