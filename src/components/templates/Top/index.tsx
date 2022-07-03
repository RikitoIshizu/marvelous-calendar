import styles from "./index.module.css";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import dayjs from "dayjs";
import { Button } from "../../atoms/Button";

import {
  holiday,
  holidayAndSpecialDayException,
  specialDays,
} from "../../../lib/common";
import { HolidayAndSpecialDayException } from "../../../lib/types";

type Calendar = {
  keyOfdayOfWeek: number;
  order: number;
  date: string;
};

type WeeklyDay = {
  days: Calendar[];
  week: number;
};

const dayTextCommmon = (format: string, date?: string | undefined): string => {
  return date ? dayjs(date).format(format) : dayjs().format(format);
};

const holidayAndSpecialDayTextClass = (
  dayOfWeek: number,
  date: string,
  order: number
): string => {
  const checkDate = dayTextCommmon("MMDD", date);

  if (specialDays[`${checkDate}`]) return "text-cyan-500";
  if (holiday[`${checkDate}`]) return "text-green-600";

  const month = dayjs(date).month() + 1;

  const isHolidayAndSpecialDayException = holidayAndSpecialDayException.filter(
    (el: HolidayAndSpecialDayException) => {
      return (
        el.week === order && dayOfWeek === el.dayOfWeek && el.month === month
      );
    }
  );

  if (isHolidayAndSpecialDayException.length) return "text-green-600";

  const yesterday: string = dayjs(date).add(-1, "day").format("YYYYMMDD");
  const yesterdayOnlyYearAndMonth: string = dayjs(date)
    .add(-1, "day")
    .format("MMDD");
  const dOfW = dayjs(yesterday).day();

  if (holiday[`${yesterdayOnlyYearAndMonth}`] && dOfW === 0)
    return "text-green-600";

  return "";
};

const holidayAndSpecialDayText = (
  dayOfWeek: number,
  date: string,
  order: number
): string => {
  const checkDate = dayTextCommmon("MMDD", date);

  if (checkDate === "0229") return "閏年";

  if (holiday[`${checkDate}`]) return holiday[`${checkDate}`];

  if (specialDays[`${checkDate}`]) return specialDays[`${checkDate}`];

  const month = dayjs(date).month() + 1;

  const isHolidayAndSpecialDayException = holidayAndSpecialDayException.filter(
    (el: HolidayAndSpecialDayException) => {
      return (
        el.week === order && dayOfWeek === el.dayOfWeek && el.month === month
      );
    }
  );

  if (isHolidayAndSpecialDayException.length)
    return isHolidayAndSpecialDayException[0].name;

  const yesterday: string = dayjs(date).add(-1, "day").format("YYYYMMDD");
  const yesterdayOnlyYearAndMonth: string = dayjs(date)
    .add(-1, "day")
    .format("MMDD");
  const dOfW = dayjs(yesterday).day();

  if (holiday[`${yesterdayOnlyYearAndMonth}`] && dOfW === 0) {
    return "国民の休日";
  }

  return "";
};

const isNowMonth = (yearAndMonth: string): boolean => {
  return yearAndMonth === dayjs().format("YYYY-MM");
};

const YearAndMonthList = (
  yearAndMonth: string
): { yearList: string[]; monthList: string[] } => {
  let yearList: string[] = [];
  let monthList: string[] = [];

  for (let i = -5; i < 6; i++) {
    const addYear: string = dayjs(yearAndMonth).add(i, "year").format("YYYY");
    yearList = [...yearList, addYear];
  }

  for (let i = 1; i <= 12; i++) {
    const addMonth = i.toString().padStart(2, "0");
    monthList = [...monthList, addMonth];
  }

  return { yearList, monthList };
};

export function Top() {
  const [count, changeCount] = useState<number>(0);
  const [days, setDays] = useState<WeeklyDay[]>([]);
  const [selectYear, changeYear] = useState<string>(dayTextCommmon("YYYY"));
  const [selectMonth, chnageMonth] = useState<string>(dayTextCommmon("MM"));

  const onChangeYearAndMonth = (year: string, month: string): void => {
    const now = dayTextCommmon("YYYY-MM");
    const nowYandM = dayjs(now);
    const sltYandM = dayjs(`${year}-${month}`);
    const setCount = sltYandM.diff(nowYandM, "month");

    changeCount(setCount);
    setNowYearAndMonth(setCount);
    setCalendar(setCount);
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
      const yearAndMonth = dayTextCommmon("YYYY-MM", setYandM);
      const date = dayTextCommmon("YYYY-MM-DD", `${yearAndMonth}-${day}`);
      const keyOfdayOfWeek: number = dayjs(date).day();
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

  const dayClass = (
    keyOfdayOfWeek: number,
    date: string,
    order: number
  ): string => {
    let commonClass: string = "align-text-top text-2xl ml-1";
    const nowMonth = dayjs(`${selectYear}-${selectMonth}`).month();
    const checkMonth = dayjs(date).month();

    const today = dayTextCommmon("YYYYMMDD");
    const checkDay = dayTextCommmon("YYYYMMDD", date);

    if (checkDay === today) {
      commonClass += ` ${styles.today}`;
    } else if (nowMonth !== checkMonth) {
      if (checkDay === today) {
        commonClass += "text-lime-400";
      } else {
        commonClass += " text-gray-300";
      }
    } else if (keyOfdayOfWeek === 0) {
      commonClass += " text-sky-600";
    } else if (keyOfdayOfWeek === 6) {
      commonClass += " text-amber-600";
    }

    const checkDate = dayTextCommmon("MMDD", date);

    if (specialDays[`${checkDate}`]) commonClass += " text-cyan-500";
    if (holiday[`${checkDate}`]) commonClass += " text-green-600";

    const month = dayjs(date).month() + 1;

    const isHolidayAndSpecialDayException =
      holidayAndSpecialDayException.filter(
        (el: HolidayAndSpecialDayException) => {
          return (
            el.week === order &&
            keyOfdayOfWeek === el.dayOfWeek &&
            el.month === month
          );
        }
      );

    if (isHolidayAndSpecialDayException.length)
      commonClass += " text-green-600";

    const yesterday: string = dayjs(date).add(-1, "day").format("YYYYMMDD");
    const yesterdayOnlyYearAndMonth: string = dayjs(date)
      .add(-1, "day")
      .format("MMDD");
    const dOfW = dayjs(yesterday).day();

    if (holiday[`${yesterdayOnlyYearAndMonth}`] && dOfW === 0)
      commonClass += " text-green-600";

    return commonClass;
  };

  const dayText = (date: string): string => {
    const nowMonth = dayjs(`${selectYear}-${selectMonth}`).month();
    const checkMonth = dayjs(date).month();

    return nowMonth !== checkMonth
      ? dayTextCommmon("M/D", date)
      : dayjs(date).date().toString();
  };

  return (
    <div>
      <main className="p-5">
        <section className="mb-5 flex justify-between items-content w-full">
          <button
            onClick={() => {
              changeMonth(count - 1);
              setNowYearAndMonth(count - 1);
              setCalendar(count - 1);
            }}
            className=""
          >
            <img
              src="./arrowLeft.svg"
              alt="前の月"
              className={styles.arrowButon}
            />
          </button>
          <div className={styles.nowYearAndMonth}>
            <select
              name="year"
              value={selectYear}
              className={styles.selectBox}
              onChange={(e) =>
                onChangeYearAndMonth(e.target.value, selectMonth)
              }
            >
              {YearAndMonthList(`${selectYear}-${selectMonth}`).yearList.map(
                (el) => {
                  return (
                    <option key={el} value={el}>
                      {el}
                    </option>
                  );
                }
              )}
            </select>
            <span className="mx-1">年</span>
            <select
              name="month"
              value={selectMonth}
              className={styles.selectBox}
              onChange={(e) => onChangeYearAndMonth(selectYear, e.target.value)}
            >
              {YearAndMonthList(`${selectYear}-${selectMonth}`).monthList.map(
                (el) => {
                  return (
                    <option key={el} value={el}>
                      {Number(el)}
                    </option>
                  );
                }
              )}
            </select>
            <span className="ml-1">月</span>
          </div>
          <div className={styles.btnArea}>
            {isNowMonth(`${selectYear}-${selectMonth}`) ? (
              ""
            ) : (
              <Button
                text="月をリセット"
                buttonColor="rgb(253 164 175)"
                underBarColor="rgb(244 63 94)"
                textColor="#fff"
                onEventCallBack={() => {
                  changeMonth(0);
                  setNowYearAndMonth();
                  setCalendar();
                }}
              />
            )}
          </div>
          <button
            onClick={() => {
              changeMonth(count + 1);
              setNowYearAndMonth(count + 1);
              setCalendar(count + 1);
            }}
          >
            <img
              src="./arrowRight.svg"
              alt="次の月"
              className={styles.arrowButon}
            />
          </button>
        </section>
        <table className={styles.table}>
          <thead className="border-b-2 border-black">
            <tr>
              <td className="text-center p-2 font-bold text-xl border-r-2 border-black text-sky-600">
                日
              </td>
              <td className="text-center p-2 font-bold text-xl border-r-2 border-black">
                月
              </td>
              <td className="text-center p-2 font-bold text-xl border-r-2 border-black">
                火
              </td>
              <td className="text-center p-2 font-bold text-xl border-r-2 border-black">
                水
              </td>
              <td className="text-center p-2 font-bold text-xl border-r-2 border-black">
                木
              </td>
              <td className="text-center p-2 font-bold text-xl border-r-2 border-black">
                金
              </td>
              <td className="text-center p-2 font-bold text-xl text-amber-600">
                土
              </td>
            </tr>
          </thead>
          <tbody>
            {days.map((el) => {
              return (
                <tr
                  key={`${`${selectYear}-${selectMonth}`}-${el.week}`}
                  className="border-b-2 border-black"
                >
                  {el.days.map((el) => {
                    return (
                      <td
                        key={el.date}
                        className={`align-text-top cursor-pointer ${
                          el.keyOfdayOfWeek !== 6
                            ? "border-r-2 border-black"
                            : ""
                        }`}
                      >
                        <Link
                          href={`/date/${dayjs(el.date).format("YYYYMMDD")}`}
                        >
                          <a className="block h-full">
                            <div className="flex items-center">
                              <div
                                className={dayClass(
                                  el.keyOfdayOfWeek,
                                  el.date,
                                  el.order
                                )}
                              >
                                {dayText(el.date)}
                              </div>
                              {holidayAndSpecialDayText(
                                el.keyOfdayOfWeek,
                                el.date,
                                el.order
                              ) ? (
                                <div
                                  className={`ml-2 ${holidayAndSpecialDayTextClass(
                                    el.keyOfdayOfWeek,
                                    el.date,
                                    el.order
                                  )}`}
                                >
                                  {holidayAndSpecialDayText(
                                    el.keyOfdayOfWeek,
                                    el.date,
                                    el.order
                                  )}
                                </div>
                              ) : (
                                ""
                              )}
                            </div>
                          </a>
                        </Link>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </main>
    </div>
  );
}
