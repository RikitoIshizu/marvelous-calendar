import Link from "next/link";
import dayjs from "dayjs";
import { useRouter } from "next/router";

import { MetaData } from "@/components/atoms/MetaData";
import { getScheduleDetail, updateScheduleDetail } from "@/lib/supabase";
import type { Schedule } from "@/lib/types";
import { useEffect, useState } from "react";
import { specialDays } from "@/lib/calendar";

function titleText(date: string): string {
  const today = dayjs();
  const selectDay = dayjs(date);
  const selectDayFormat = selectDay.format("YYYYMMDD");

  if (today.format("YYYYMMDD") === selectDayFormat) {
    return "今日の予定";
  } else if (today.add(1, "day").format("YYYYMMDD") === selectDayFormat) {
    return "明日の予定";
  } else if (today.add(-1, "day").format("YYYYMMDD") === selectDayFormat) {
    return "昨日の予定";
  } else if (selectDay.isBefore(today)) {
    return `${selectDay.format("YYYY年M月D日")}に追加された予定`;
  } else {
    return `${selectDay.format("YYYY年M月D日")}の予定`;
  }
}

export default function Date() {
  const [isLoad, setIsLoad] = useState<boolean>(false);
  const [schedules, setSchedules] = useState<Schedule[] | null>(null);

  const router = useRouter();
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

  const onSetSchedules = async () => {
    const date = router.query.id as string;
    const s = await getScheduleDetail(date);
    setSchedules(s);
  };

  const specialDay = (): string => {
    const date = router.query.id as string;
    const md = dayjs(date).format("MMDD");

    return specialDays[md] ? specialDays[md] : "";
  };

  // const updateSchedule = (id: Schedule["id"]): Promise<void> => {
  //   console.log(id);
  // };

  const deleteSchedule = async (id: Schedule["id"]) => {
    setIsLoad(true);
    const response = await updateScheduleDetail(id);

    if (!response) {
      onSetSchedules();
      setIsLoad(false);
    }
  };

  useEffect(() => {
    router.isReady && onSetSchedules();
  }, [router]);

  return (
    <main>
      <MetaData title={pageTitle} description={pageDescription} />
      <section className="my-2 relative">
        {typeof dateParam === "string" && !!dateParam && (
          <h1 className="text-4xl font-bold text-center">
            {titleText(dateParam)}
          </h1>
        )}
        <div className="w-[1000px] mx-auto">
          {specialDay() && (
            <section>
              <h2 className="text-2xl font-bold">今日は何の日？</h2>
              <p className="mt-1">{specialDay()}</p>
            </section>
          )}
          {schedules?.length && (
            <section className="mt-4">
              <h2 className="text-2xl font-bold">登録されているスケジュール</h2>
              {schedules && (
                <ul>
                  {schedules.map((el) => {
                    return (
                      <li className="mt-1 flex items-center" key={el.id}>
                        <p>{el.description}</p>
                        <button className="ml-2 w-[80px] bg-[blue] text-[#fff] rounded-full">
                          編集
                        </button>
                        <button
                          className="ml-2 w-[80px] bg-[red] text-[#fff] rounded-full"
                          onClick={() => deleteSchedule(el.id)}
                        >
                          削除
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          )}
          <div className="mt-6">
            <Link href="/" className="w-[100px] h-[50px] bg-[red]s">
              戻る
            </Link>
          </div>
        </div>
      </section>
      {isLoad && (
        <div className="absolute bg-white w-full h-full">読み込み中</div>
      )}
    </main>
  );
}
