import dayjs from "dayjs";
import { isMobile } from "react-device-detect";
import { useCallback, useEffect, useState } from "react";

import { dayTextCommmon } from "@/lib/calendar";
import { amountOfDay } from "@/lib/calendar";
import { FlamePc } from "@/components/organisms/Flame/Pc";
import { FlameSp } from "@/components/organisms/Flame/Sp";

type Calendar = {
  keyOfdayOfWeek: number;
  order: number;
  date: string;
};

type WeeklyDay = {
  days: Calendar[];
  week: number;
};

export function Top() {
  // 共通の処理はこのコンポーネントでまとめる
  const [isClient, setIsClient] = useState<boolean>(false);
  const [count, changeCount] = useState<number>(0);
  const [days, setDays] = useState<WeeklyDay[]>([]);
  const [selectYear, changeYear] = useState<string>(dayTextCommmon("YYYY"));
  const [selectMonth, chnageMonth] = useState<string>(dayTextCommmon("MM"));

  // countを変える
  const onChangeCount = (c: number) => {
    changeCount(c);
    setNowYearAndMonth(c);
    setCalendar(c);
  };

  // 年と月を取得する
  const setNowYearAndMonth = (val?: number) => {
    const setYear: string = val
      ? dayjs().add(val, "month").format("YYYY")
      : dayTextCommmon("YYYY");
    const setMonth: string = val
      ? dayjs().add(val, "month").format("MM")
      : dayTextCommmon("MM");

    changeYear(setYear);
    chnageMonth(setMonth);
  };

  // カレンダーの日付を取得
  const setCalendar = useCallback((val?: number) => {
    const setYandM =
      val === 0 || val === undefined
        ? dayTextCommmon("YYYY-MM")
        : dayjs().add(val, "month").format("YYYY-MM");

    // カレンダーを取得する
    // その月の全日付を取得
    let nowCalendar: Calendar[] = [];

    // まずは現在見ている月のカレンダーの日付を取得する
    for (var i = 1; i <= amountOfDay(setYandM); i++) {
      const day = i.toString().padStart(2, "0");
      const yearAndMonth = dayTextCommmon("YYYY-MM", setYandM);
      const date = dayTextCommmon("YYYY-MM-DD", `${yearAndMonth}-${day}`);
      const keyOfdayOfWeek = dayjs(date).day();
      const order =
        nowCalendar.filter(
          (el: Calendar) => el.keyOfdayOfWeek === keyOfdayOfWeek
        ).length + 1;

      const setData: Calendar = { date, keyOfdayOfWeek, order };
      nowCalendar = [...nowCalendar, setData];
    }

    // 足りない前後の月の日付を取得する。
    let prevMonthDate: Calendar[] = [];
    let nextMonthDate: Calendar[] = [];

    nowCalendar.forEach((date) => {
      const d = dayjs(date.date);
      const day: number = d.date();

      if (day === 1) {
        // 月初の場合、前月の足りない日数を追加する
        if (date.keyOfdayOfWeek) {
          for (var i = date.keyOfdayOfWeek; i > 0; i--) {
            const addPrevMonthDate = d.add(-i, "day");
            prevMonthDate = [
              ...prevMonthDate,
              {
                date: addPrevMonthDate.format("YYYY-MM-DD"),
                keyOfdayOfWeek: addPrevMonthDate.day(),
                order: 1,
              },
            ];
          }
        }
      } else if (day === nowCalendar.length) {
        // 月末の場合、次月の足りない日数を追加する
        if (date.keyOfdayOfWeek !== 6) {
          for (var n = 1; n <= 6 - date.keyOfdayOfWeek; n++) {
            const addPrevMonthDate = d.add(n, "day");
            nextMonthDate = [
              ...nextMonthDate,
              {
                date: addPrevMonthDate.format("YYYY-MM-DD"),
                keyOfdayOfWeek: addPrevMonthDate.day(),
                order: 6,
              },
            ];
          }
        }
      }
    });

    const displayCalendar = [
      ...prevMonthDate,
      ...nowCalendar,
      ...nextMonthDate,
    ];

    let datePerWeek: WeeklyDay[] = [];
    let oneWeek: Calendar[] = [];
    let week = 1;

    // 週ごとに分ける
    displayCalendar.forEach((date: Calendar) => {
      oneWeek = [...oneWeek, date];

      if (date.keyOfdayOfWeek === 6) {
        const addData: WeeklyDay[] = [{ week, days: oneWeek }];

        datePerWeek = [...datePerWeek, ...addData];
        oneWeek = [];
        week++;
      }
    });

    setDays(datePerWeek);
  }, []);

  // 年と月を変える
  const onChangeYearAndMonth = (year: string, month: string): void => {
    const now = dayTextCommmon("YYYY-MM");
    const nowYandM = dayjs(now);
    const sltYandM = dayjs(`${year}-${month}`);
    const setCount = sltYandM.diff(nowYandM, "month");

    changeCount(setCount);
    setNowYearAndMonth(setCount);
    setCalendar(setCount);
  };

  // 今見ているカレンダーが実際の現在の年月かどうか
  const isNowMonth = () => {
    const yearAndMonth = `${selectYear}-${selectMonth}`;
    return yearAndMonth === dayjs().format("YYYY-MM");
  };

  const calandarComponent = () => {
    if (!isClient) {
      return <>読み込み中...</>;
    }

    return isMobile ? (
      <FlameSp
        count={count}
        days={days}
        selectYear={selectYear}
        selectMonth={selectMonth}
        isNowMonth={isNowMonth()}
        onEventCallBack={(c: number) => {
          onChangeCount(c);
        }}
        onChangeYearAndMonth={(y: string, m: string) => {
          onChangeYearAndMonth(y, m);
        }}
      />
    ) : (
      <FlamePc
        count={count}
        days={days}
        selectYear={selectYear}
        selectMonth={selectMonth}
        isNowMonth={isNowMonth()}
        onEventCallBack={(c: number) => {
          onChangeCount(c);
        }}
        onChangeYearAndMonth={(y: string, m: string) => {
          onChangeYearAndMonth(y, m);
        }}
      />
    );
  };

  // 読み込み時に作動させたい処理を追加する
  useEffect(() => {
    setIsClient(true);
    setNowYearAndMonth();
    setCalendar();
  }, []);

  return <>{calandarComponent()}</>;
}
