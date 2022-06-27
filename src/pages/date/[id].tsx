import Link from "next/link";
import dayjs from "dayjs";
import { useRouter } from "next/router";
// import { useCallback, useEffect, useState } from "react";
import { MetaData } from "../../components/atoms/MetaData";

function titleText(date: string): string {
  const today = dayjs();
  const selectDay = dayjs(date);

  if (today.format("YYYYMMDD") === selectDay.format("YYYYMMDD")) {
    return "今日の予定";
  } else if (
    today.add(1, "day").format("YYYYMMDD") === selectDay.format("YYYYMMDD")
  ) {
    return "明日の予定";
  } else if (
    today.add(-1, "day").format("YYYYMMDD") === selectDay.format("YYYYMMDD")
  ) {
    return "昨日の予定";
  } else if (selectDay.isBefore(today)) {
    return `${selectDay.format("YYYY年M月D日")}に追加された予定`;
  } else {
    return `${selectDay.format("YYYY年M月D日")}の予定`;
  }
}

export default function Date() {
  const dateParam: string | string[] | undefined = useRouter().query.id;
  const check: boolean = typeof dateParam === "string" && !!dateParam;

  const date: string =
    typeof dateParam === "string" && !!dateParam
      ? dayjs(dateParam).format("YYYY年M月D日")
      : "";
  const pageTitle: string = check ? `${date}の予定` : "";
  const pageDescription: string = check
    ? `${date}の予定を確認・変更・作成ができます。`
    : "";

  return (
    <>
      <MetaData title={pageTitle} description={pageDescription} />
      <section>
        <div className="my-2">
          {typeof dateParam === "string" && !!dateParam ? (
            <h1 className="text-4xl font-bold text-center">
              {titleText(dateParam)}
            </h1>
          ) : null}
        </div>
        <div className="mt-6">
          <Link href="/">
            <a>戻る</a>
          </Link>
        </div>
      </section>
    </>
  );
}
