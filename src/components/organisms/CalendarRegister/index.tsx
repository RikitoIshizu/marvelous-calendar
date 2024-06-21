import dayjs from "dayjs";
import isLeapYear from "dayjs/plugin/isLeapYear";
import { FormEvent, useCallback, useEffect, useState } from "react";
import Select from "@/components/atoms/Select";
import Radio from "@/components/atoms/Radio";
import Button from "@/components/atoms/Button";
import { amountOfDay, dayTextCommmon } from "@/lib/calendar";
import { registerScheduleDetail } from "@/lib/supabase";

dayjs.extend(isLeapYear);

const scheduleTypes = [
  { id: "1", name: "仕事" },
  { id: "2", name: "休日" },
  { id: "3", name: "プライベート" },
  { id: "4", name: "会議" },
  { id: "5", name: "法事" },
  { id: "6", name: "その他" },
];

type Prop = {
  year: string;
  month: string;
  onEventCallBack: Function;
};

export function CalendarRegister(props: Prop) {
  // 入力項目
  const [year, changeYear] = useState<string>(
    props.year ? props.year : dayTextCommmon("YYYY")
  );
  const [month, changeMonth] = useState<string>(
    props.month ? props.month : dayTextCommmon("MM")
  );
  const [day, changeDay] = useState<string>("");
  const [title, changeTitle] = useState<string>("");
  const [description, changeDescription] = useState<string>("");
  const [type, changeType] = useState<number>(1);

  // カレンダーの年月日のリスト
  const [nowYearList, setYearList] = useState<string[]>([]);
  const [nowMonthList, setMonthList] = useState<string[]>([]);
  const [nowDayList, setDayList] = useState<string[]>([]);

  // バリデーション
  const [titleError, setTitleError] = useState<string>("");
  const [descriptionError, setDescriptionError] = useState<string>("");

  // カレンダーを読み込んだ時に選択できる年月日を設定する
  const firstSetCalendar = useCallback(() => {
    const nowYearAndMonth = `${props.year}-${props.month}`;

    let yearList: string[] = [props.year];
    let monthList: string[] = [];
    let dayList: string[] = [];

    // 年(今月から10年後までの年を選択できるようにする)
    for (var i = 1; i <= 9; i++) {
      const setYear = dayjs(`${props.year}-01`).add(i, "year").format("YYYY");
      yearList = [...yearList, setYear];
    }

    // 月(今年の今月以降の月を選択できるようにする)
    for (var n = 1; n <= 12; n++) {
      if (n >= Number(props.month)) {
        monthList = [...monthList, n.toString()];
      }
    }

    // 日(当日より後の日だけ選択できるようにする)
    for (var m = 1; m <= amountOfDay(nowYearAndMonth); m++) {
      const day = m.toString().padStart(2, "0");

      const checkData = dayjs(`${nowYearAndMonth}-${day}`);
      const dateCheck = checkData.isAfter(dayjs());

      dateCheck && (dayList = [...dayList, day]);
    }

    // 日リストの最初の値を選択している日にセットする
    changeDay(dayList[0]);

    setYearList(yearList);
    setMonthList(monthList);
    setDayList(dayList);
  }, []);

  const onChangeYear = (
    selectedYear: string,
    selectedMonth: string,
    selectedDay: string
  ) => {
    // まずは年を選択した年にセットする
    changeYear(selectedYear);

    const selectedDate = `${selectedYear}-${selectedMonth
      .toString()
      .padStart(2, "0")}-${selectedDay.toString().padStart(2, "0")}`;

    const today = dayjs().format("YYYY-MM-DD");

    let monthList: string[] = [];
    let dayList: string[] = [];

    const thisMonthAmount = amountOfDay(dayjs().format("YYYY-MM"));
    const thisYear = dayjs().year();

    // 選択した年が過去の日になっちゃった時
    if (
      dayjs(selectedDate).isBefore(today) ||
      thisYear === Number(selectedYear)
    ) {
      const todayMonth = dayjs().month() + 1;
      const todayDay = dayjs().date();

      for (var m = todayMonth; m <= 12; m++) {
        monthList = [...monthList, m.toString().padStart(2, "0")];
      }

      for (var d = todayDay + 1; d <= thisMonthAmount; d++) {
        dayList = [...dayList, d.toString().padStart(2, "0")];
      }

      // さらに選択している月と日が過去の日になっちゃっている時
      if (Number(selectedMonth) < todayMonth) {
        changeMonth(todayMonth.toString().padStart(2, "0"));
      }

      if (Number(selectedDay) < todayDay) {
        changeDay((todayDay + 1).toString().padStart(2, "0"));
      }
    } else {
      // 違う時は月と日のリストを作り直す
      for (var mo = 1; mo <= 12; mo++) {
        monthList = [...monthList, mo.toString().padStart(2, "0")];
      }

      for (var da = 1; da <= thisMonthAmount; da++) {
        dayList = [...dayList, da.toString().padStart(2, "0")];
      }
    }

    setMonthList(monthList);
    setDayList(dayList);
  };

  const onChangeMonth = (
    selectedYear: string,
    selectedMonth: string,
    selectedDay: string
  ) => {
    // まずは月を選択した月にセットする
    changeMonth(selectedMonth);

    // 今月なら当日以前の日付が選択されていないかを確認しないといけない
    const selectedYearAndMonth = `${selectedYear}-${selectedMonth
      .toString()
      .padStart(2, "0")}`;
    const nowMonth = dayjs().format("YYYY-MM");

    const amountOfMonth = amountOfDay(selectedYearAndMonth);

    let dayList: string[] = [];

    if (selectedYearAndMonth === nowMonth) {
      const today = dayjs();
      for (var i = 1; i <= amountOfMonth; i++) {
        const day = i.toString().padStart(2, "0");
        const date = `${selectedYearAndMonth}-${day}`;
        const checkDay = dayjs(date);

        if (checkDay.isAfter(today)) {
          dayList = [...dayList, day];
        }
      }

      const nowSelectedDay = Number(selectedDay).toString().padStart(2, "0");

      !dayList.includes(nowSelectedDay) && changeDay(nowSelectedDay);
    } else {
      for (var n = 1; n <= amountOfMonth; n++) {
        dayList = [...dayList, n.toString().padStart(2, "0")];
      }

      Number(selectedDay) > amountOfMonth &&
        changeDay(amountOfMonth.toString());
    }

    setDayList(dayList);
  };

  const registerSchedule = async (e: FormEvent<Element>) => {
    e.preventDefault();

    setTitleError(
      !title ? "タイトルを入力しろ、ボケ、普通入力するだろ、アホかお前。" : ""
    );
    setDescriptionError(
      !description
        ? "スケジュールの詳細書かないバカはいないだろ、書け馬鹿野郎"
        : ""
    );

    if (title && description) {
      const response = await registerScheduleDetail({
        year: Number(year),
        month: Number(month),
        day: Number(day),
        title,
        description,
        scheduleTypes: type,
      });

      if (!response) {
        alert("スケジュール登録完了！");
        setTitleError("");
        setDescriptionError("");
        return props.onEventCallBack();
      }
    }
  };

  useEffect(() => {
    return () => {
      firstSetCalendar();
    };
  }, []);

  return (
    <form onSubmit={(e: FormEvent<Element>) => registerSchedule(e)}>
      <div className="mt-3 flex items-center">
        <label htmlFor="date" className="mr-2">
          日付:
        </label>
        <Select
          name="year"
          value={year}
          selectList={nowYearList}
          onEventCallBack={(year: string) => {
            onChangeYear(year, month, day);
          }}
        />
        <span className="mx-2">年</span>
        <Select
          name="month"
          value={month}
          selectList={nowMonthList}
          onEventCallBack={(month: string) => {
            onChangeMonth(year, month, day);
          }}
        />
        <span className="mx-2">月</span>
        <Select
          name="day"
          value={day}
          selectList={nowDayList}
          onEventCallBack={(day: string) => {
            changeDay(day);
          }}
        />
        <span className="ml-2">日</span>
      </div>
      <div className="mt-3 flex">
        <label htmlFor="description" className="mr-2">
          スケジュールの種類:
        </label>
        {scheduleTypes.map((el) => {
          return (
            <span key={el.id} className="ml-3">
              <Radio
                name={el.name}
                id={el.id}
                selectedId={`${type}`}
                inputName="scheduleType"
                onEventCallBack={(e: number) => changeType(e)}
              />
            </span>
          );
        })}
      </div>
      <div className="mt-3">
        <div className="flex">
          <label htmlFor="title" className="mr-2">
            タイトル:
          </label>
          <input
            name="title"
            value={title}
            className="resize-none border-2 rounded-lg border-slate-900 w-[300px]"
            placeholder="スケジュールのタイトルを入力"
            onChange={(e) => {
              changeTitle(e.target.value);
            }}
          />
        </div>
        {titleError && <p className="text-xs text-[red]">{titleError}</p>}
      </div>
      <div className="mt-3">
        <div className="flex">
          <label htmlFor="description" className="mr-2">
            メモ:
          </label>
          <textarea
            name="description"
            value={description}
            className="resize-none border-2 rounded-lg border-slate-900 w-2/3"
            placeholder="何かメモがあれば入力してください。"
            onChange={(e) => {
              changeDescription(e.target.value);
            }}
          />
        </div>
        {descriptionError && (
          <p className="text-xs text-[red]">{descriptionError}</p>
        )}
      </div>
      <div className="text-center mt-5">
        <Button
          type="submit"
          text="登録"
          buttonColor="#a7f3d0"
          underBarColor="#059669"
        />
      </div>
    </form>
  );
}
