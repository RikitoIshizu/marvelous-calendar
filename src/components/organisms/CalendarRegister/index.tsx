import dayjs from "dayjs";
import isLeapYear from "dayjs/plugin/isLeapYear";
import { useCallback, useEffect, useState } from "react";
import { amountOfDay, dayTextCommmon } from "../../../lib/calendar";
import { Select } from "../../atoms/Select";

dayjs.extend(isLeapYear);

const monthList = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
];

const isLeepYear = (yearAndMonth: string): boolean => {
  return dayjs(yearAndMonth).isLeapYear();
};

const createDayList = (yearAndMonth: string): string[] => {
  console.log(yearAndMonth);
  let dayList: string[] = [];

  for (var n = 1; n <= amountOfDay(yearAndMonth); n++) {
    const day = n.toString().padStart(2, "0");
    dayList = [...dayList, day];
  }

  console.log(dayList);

  return dayList;
};

type Prop = {
  year: string;
  month: string;
};

export function CalendarRegister(props: Prop) {
  // まずは初期値をセットする
  const [selectYear, changeYear] = useState<string>(
    props.year ? props.year : dayTextCommmon("YYYY")
  );
  const [selectMonth, changeMonth] = useState<string>(
    props.month ? props.month : dayTextCommmon("MM")
  );
  const [selectDay, changeDay] = useState<string>("01");

  const [nowYearList, setYearList] = useState<string[]>([]);
  const [nowDayList, setDayList] = useState<string[]>([]);

  // 年月日それぞれのリストを生成する。
  const setCalendar = useCallback((year: string, month: string): void => {
    let yearList: string[] = [year];

    // 年
    for (var i = 1; i <= 9; i++) {
      const setYear = dayjs(`${year}-01`).add(i, "year").format("YYYY");
      // TODO: 今年より、前の年は選択できないようにする
      yearList = [...yearList, setYear];
    }

    setYearList(yearList);

    // 日
    setDayList(createDayList(`${year}-${month}`));
  }, []);

  useEffect(() => {
    setCalendar(selectYear, selectMonth);
  }, []);

  const onChangeYear = (
    selectedYear: string,
    selectedMonth: string,
    selectedDay: string
  ): void => {
    changeYear(selectedYear);
    const format = `${selectedYear}-${selectedMonth}`;
    setDayList(createDayList(format));

    // 2月の時は閏年があるのでいろいろ処理をする
    if (!isLeepYear(format) && Number(selectedDay) > amountOfDay(format)) {
      changeDay(`${amountOfDay(format)}`);
    }
  };

  const onChangeMonth = (
    selectedYear: string,
    selectedMonth: string,
    selectedDay: string
  ): void => {
    changeMonth(selectedMonth);
    const format = `${selectedYear}-${selectedMonth}`;
    setDayList(createDayList(format));

    if (Number(selectedDay) > amountOfDay(format)) {
      changeDay(`${amountOfDay(format)}`);
    }
  };

  const onChangeDay = (selectedDay: string): void => {
    changeDay(selectedDay);
  };

  return (
    <form>
      <div>
        <label htmlFor="date">日付:</label>
        <Select
          name="year"
          value={selectYear}
          selectList={nowYearList}
          onEventCallBack={(year: string) => {
            onChangeYear(year, selectMonth, selectDay);
          }}
        />
        年
        <Select
          name="month"
          value={selectMonth}
          selectList={monthList}
          onEventCallBack={(month: string) => {
            onChangeMonth(selectYear, month, selectDay);
          }}
        />
        月
        <Select
          name="day"
          value={selectDay}
          selectList={nowDayList}
          onEventCallBack={(day: string) => {
            onChangeDay(day);
          }}
        />
        日
      </div>
    </form>
  );
}
