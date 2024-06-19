import dayjs from "dayjs";
import { useEffect, useRef, useState, LegacyRef } from "react";

import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import {
  dayTextCommmon,
  YearAndMonthAndDateList,
  specialDayList,
  holiday as holidays,
} from "@/lib/calendar";

type Calendar = {
  keyOfdayOfWeek: number;
  order: number;
  date: string;
};

type WeeklyDay = {
  days: Calendar[];
  week: number;
};

type Props = {
  count: number;
  days: WeeklyDay[];
  selectYear: string;
  selectMonth: string;
  isNowMonth: boolean;
  onEventCallBack: Function;
  onChangeYearAndMonth: Function;
};

export function FlameSp(props: Props) {
  const [isShowDetail, openDetail] = useState<boolean>(false);
  const [displayDate, changeTitle] = useState<string>("");
  const [calendarDetailHeight, setCalendarHeight] = useState<number>(0);

  // useStateの関数群
  const onChangeDisplayDate = () => {
    if (!isShowDetail) {
      openDetail(true);
    }
  };

  const onChangeDetailTitle = (date: string) => {
    changeTitle(dayjs(date).format("YYYYMMDD"));
  };

  const displayText = () => {
    const weekDay: { [key: string]: string } = {
      Su: "日",
      Mo: "月",
      Tu: "火",
      We: "水",
      Th: "木",
      Fr: "金",
      Sa: "土",
    };
    const d = dayjs(displayDate);
    const wd = d.format("dd");

    return d.format(`YYYY年M月D日(${weekDay[`${wd}`]})`);
  };

  const dayClass = (date: string) => {
    let classes = "w-[calc(100%/7)] min-w-[calc(100%/7)] text-center p-3";
    const nowM = dayjs(`${props.selectYear}-${props.selectMonth}`).month();
    const d = dayjs(date).month();

    if (d !== nowM) {
      classes += " text-gray-400";
    }

    return classes;
  };

  // propsのFunction型の関数
  const onClickBtn = (c: number) => {
    return props.onEventCallBack(c);
  };

  const onChangeYearAndMonth = (y: string, m: string) => {
    return props.onChangeYearAndMonth(y, m);
  };

  const isToday = (date: string) => {
    const today = dayTextCommmon("YMD");
    const checkDay = dayTextCommmon("YMD", date);

    return today === checkDay;
  };

  const sdList = () => {
    return specialDayList
      .filter((el) => dayjs(displayDate).format("MMDD") == el.date)
      .map((el) => el.name);
  };

  const holiday = () => {
    return holidays[`${dayjs(displayDate).format("MMDD")}`];
  };

  const header = useRef<HTMLDivElement>(null);
  const btnArea = useRef<HTMLDivElement>(null);
  const calendarArea = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const windowHeight = window.innerHeight;
    const headerHeight = Number(
      header?.current?.getBoundingClientRect().height
    );
    const btnAreaHeight = Number(
      btnArea?.current?.getBoundingClientRect().height
    );
    const calendarAreaHeight = Number(
      calendarArea?.current?.getBoundingClientRect().height
    );
    const dateDetailTitle = 33;

    setCalendarHeight(
      windowHeight -
        headerHeight -
        btnAreaHeight -
        calendarAreaHeight -
        dateDetailTitle -
        20
    );
  }, []);

  return (
    <main className="w-full">
      <div
        ref={header}
        className="py-4 px-2 flex justify-between items-content"
      >
        <button
          onClick={() => {
            onClickBtn(props.count - 1);
          }}
        >
          <img src="./arrowLeft.svg" alt="前の月" className="h-[30px]" />
        </button>
        <div className="w-[150px] flex items-center">
          <Select
            name="year"
            value={props.selectYear}
            selectList={
              YearAndMonthAndDateList(
                `${props.selectYear}-${props.selectMonth}`
              ).yearList
            }
            onEventCallBack={(year: string) => {
              onChangeYearAndMonth(year, props.selectMonth);
            }}
          />
          <span className="mx-1">年</span>
          <Select
            name="month"
            value={props.selectMonth}
            selectList={
              YearAndMonthAndDateList(
                `${props.selectYear}-${props.selectMonth}`
              ).monthList
            }
            onEventCallBack={(month: string) => {
              onChangeYearAndMonth(props.selectYear, month);
            }}
          />
          <span className="ml-1">月</span>
        </div>
        <button
          onClick={() => {
            onClickBtn(props.count + 1);
          }}
        >
          <img src="./arrowRight.svg" alt="次の月" className="h-[30px]" />
        </button>
      </div>
      <div ref={btnArea} className="h-[30px] my-2 mr-2 flex justify-end">
        {!props.isNowMonth && (
          <Button
            text="月をリセット"
            buttonColor="rgb(253 164 175)"
            underBarColor="rgb(244 63 94)"
            textColor="#fff"
            onEventCallBack={() => {
              onClickBtn(0);
            }}
          />
        )}
      </div>
      <table
        ref={calendarArea as LegacyRef<HTMLTableElement>}
        className="table-fixed w-full"
      >
        <thead>
          <tr>
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((el) => (
              <td
                key={el}
                className="w-[calc(100%/7)] min-w-[calc(100%/7)] text-center p-2 font-bold text-xl"
              >
                {el}
              </td>
            ))}
          </tr>
        </thead>
        <tbody>
          {props.days.map((el) => {
            return (
              <tr
                key={`${`${props.selectYear}-${props.selectMonth}`}-${el.week}`}
              >
                {el.days.map((el) => {
                  return (
                    <td key={el.date} className={dayClass(el.date)}>
                      <button
                        onClick={() => {
                          if (!isShowDetail) {
                            onChangeDisplayDate();
                          }
                          onChangeDetailTitle(el.date);
                        }}
                        className={
                          isToday(el.date)
                            ? "w-[30px] h-[30px] rounded-full bg-[red] text-center text-white"
                            : ""
                        }
                      >
                        {dayjs(el.date).date()}
                      </button>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      {isShowDetail ? (
        <>
          <h1 className="mt-2 text-center text-xl">{displayText()}</h1>
          <div
            className="overflow-y-scroll p-2"
            style={{ height: calendarDetailHeight + "px" }}
          >
            {holiday() ? (
              <div className="font-bold text-center text-red-400 text-xl">
                {holiday()}
              </div>
            ) : null}
            {sdList().length ? (
              <section>
                <h2>今日はどんなことがあった日？</h2>
                <ul>
                  {sdList().map((el, index) => {
                    return (
                      <li key={`${el}-${index}`}>
                        {index + 1}.{el}
                      </li>
                    );
                  })}
                </ul>
              </section>
            ) : null}
          </div>
        </>
      ) : null}
    </main>
  );
}
