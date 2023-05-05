import styles from "./index.module.css";
import Link from "next/link";
import dayjs from "dayjs";

import {
  holiday,
  holidayAndSpecialDayException,
  specialDays,
  dayTextCommmon,
} from "../../../lib/calendar";
import { HolidayAndSpecialDayException } from "../../../lib/types";

type Props = {
  date: string;
  order: number;
  keyOfdayOfWeek: number;
  selectYear: string;
  selectMonth: string;
};

export function Day(props: Props) {
  const dayClass = (
    keyOfdayOfWeek: number,
    date: string,
    order: number
  ): string => {
    let commonClass: string = "align-text-top text-2xl ml-1";
    const nowMonth = dayjs(`${props.selectYear}-${props.selectMonth}`).month();
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

    const isHolidayAndSpecialDayException =
      holidayAndSpecialDayException.filter(
        (el: HolidayAndSpecialDayException) => {
          return (
            el.week === order &&
            dayOfWeek === el.dayOfWeek &&
            el.month === month
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

  const dayText = (date: string) => {
    const nowMonth = dayjs(`${props.selectYear}-${props.selectMonth}`).month();
    const checkMonth = dayjs(date).month();

    return nowMonth !== checkMonth
      ? dayTextCommmon("M/D", date)
      : dayjs(date).date().toString();
  };

  const holidayAndSpecialDayTextClass = (
    dayOfWeek: number,
    date: string,
    order: number
  ): string => {
    const checkDate = dayTextCommmon("MMDD", date);

    if (specialDays[`${checkDate}`]) return `${styles.cellInner} text-cyan-500`;

    const isHolidayAndSpecialDayException =
      holidayAndSpecialDayException.filter(
        (el: HolidayAndSpecialDayException) => {
          return (
            el.week === order &&
            dayOfWeek === el.dayOfWeek &&
            el.month === dayjs(date).month() + 1
          );
        }
      );

    const yesterday: string = dayjs(date).add(-1, "day").format("YYYYMMDD");
    const yesterdayOnlyYearAndMonth: string = dayjs(date)
      .add(-1, "day")
      .format("MMDD");
    const dOfW = dayjs(yesterday).day();

    if (
      holiday[`${checkDate}`] ||
      isHolidayAndSpecialDayException.length ||
      (holiday[`${yesterdayOnlyYearAndMonth}`] && dOfW === 0)
    ) {
      return `${styles.cellInner} text-green-600`;
    }

    return "";
  };

  return (
    <td
      className={`${styles.cell} ${
        props.keyOfdayOfWeek !== 6 ? "border-r-2 border-black" : ""
      }`}
    >
      <div className="items-center">
        <Link href={`/date/${dayjs(props.date).format("YYYYMMDD")}`}>
          <a>
            <div
              className={dayClass(
                props.keyOfdayOfWeek,
                props.date,
                props.order
              )}
            >
              {dayText(props.date)}
            </div>
            {holidayAndSpecialDayText(
              props.keyOfdayOfWeek,
              props.date,
              props.order
            ) ? (
              <div
                className={holidayAndSpecialDayTextClass(
                  props.keyOfdayOfWeek,
                  props.date,
                  props.order
                )}
              >
                {holidayAndSpecialDayText(
                  props.keyOfdayOfWeek,
                  props.date,
                  props.order
                )}
              </div>
            ) : (
              ""
            )}
          </a>
        </Link>
      </div>
    </td>
  );
}
