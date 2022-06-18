import { MetaData } from "./../../atoms/MetaData";
// import styles from "./index.module.css";
import { useCallback, useEffect, useState } from "react";

const dayjs = require("dayjs");

type Meta = {
  title: string;
  description: string;
};

type Calendar = {
  keyOfdayOfWeek: number;
  date: string;
};

type WeeklyDay = {
  days: Calendar[];
  week: number;
};

// const keyOfDayOfWeek: Record<number, string> = {
//   0: "日",
//   1: "月",
//   2: "火",
//   3: "水",
//   4: "木",
//   5: "金",
//   6: "土",
// };

export function Top(propData: Meta) {
  const { title, description } = propData;
  const [count, changeCount] = useState<number>(0);
  const [yearAndMonth, changeYearAndMonth] = useState<string>(
    dayjs().format("YYYY-MM")
  );
  const [days, setDays] = useState<WeeklyDay[]>([]);

  // 年と月を取得する
  const setNowYearAndMonth = (val?: number) => {
    const setYear: string =
      val === 0 || val === undefined
        ? dayjs().format("YYYY")
        : dayjs().add(val, "month").format("YYYY");
    const setMonth: string =
      val === 0 || val === undefined
        ? dayjs().format("MM")
        : dayjs().add(val, "month").format("MM");

    changeYearAndMonth(`${setYear}-${setMonth}`);
  };

  // カレンダーの日付を取得
  const setCalendar = useCallback((val?: number) => {
    const setYandM =
      val === 0 || val === undefined
        ? dayjs().format("YYYY-MM")
        : dayjs().add(val, "month").format("YYYY-MM");

    //   // カレンダーを取得する
    const startMonth: string = dayjs(setYandM)
      .startOf("month")
      .format("YYYY-MM-DD");
    const endMonth: string = dayjs(setYandM)
      .endOf("month")
      .format("YYYY-MM-DD");
    const amountOfDay: number = dayjs(endMonth).diff(startMonth, "day") + 1;

    // その月の全日付を取得
    let nowCalendar: Calendar[] = [];

    // まずは現在見ている月のカレンダーの日付を取得する
    for (var i = 1; i <= amountOfDay; i++) {
      const day: string = i.toString().padStart(2, "0");
      const yearAndMonth: string = dayjs(setYandM).format("YYYY-MM");
      const date: string = dayjs(`${yearAndMonth}-${day}`).format("YYYY-MM-DD");
      const keyOfdayOfWeek: number = dayjs(date).day();

      const setData: Calendar = { date, keyOfdayOfWeek };
      nowCalendar = [...nowCalendar, setData];
    }

    // 足りない前後の月の日付を取得する。
    let prevMonthDate: Calendar[] = [];
    let nextMonthDate: Calendar[] = [];

    nowCalendar.forEach((date: Calendar) => {
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
              },
            ];
          }
        }
      } else if (day === nowCalendar.length) {
        // 月末の場合、次月の足りない日数を追加する
        if (date.keyOfdayOfWeek !== 6) {
          for (var i = 1; i <= 6 - date.keyOfdayOfWeek; i++) {
            const addPrevMonthDate = d.add(i, "day");
            nextMonthDate = [
              ...nextMonthDate,
              {
                date: addPrevMonthDate.format("YYYY-MM-DD"),
                keyOfdayOfWeek: addPrevMonthDate.day(),
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
    displayCalendar.forEach((date: Calendar, index: number) => {
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

  useEffect(() => {
    setNowYearAndMonth();
    setCalendar();
  }, []);

  const changeMonth = useCallback(
    (val: number) => {
      changeCount(val);
    },
    [changeCount]
  );

  return (
    <div>
      <MetaData title={title} description={description} />
      <main>
        <h1 className="flex mb-2">
          {dayjs(yearAndMonth).format("YYYY年MM月")}
        </h1>
        <button
          onClick={() => {
            changeMonth(count - 1);
            setNowYearAndMonth(count - 1);
            setCalendar(count - 1);
          }}
        >
          前の月
        </button>
        <button
          onClick={() => {
            changeMonth(count + 1);
            setNowYearAndMonth(count + 1);
            setCalendar(count + 1);
          }}
        >
          次の月
        </button>
        <section>
          <table>
            <thead>
              <tr>
                <td>日</td>
                <td>月</td>
                <td>火</td>
                <td>水</td>
                <td>木</td>
                <td>金</td>
                <td>土</td>
              </tr>
            </thead>
            <tbody>
              {days.map((el) => {
                return (
                  <tr key={`${yearAndMonth}-${el.week}`}>
                    {el.days.map((el) => {
                      return <td key={el.date}>{el.date}</td>;
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}
