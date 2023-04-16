import styles from "./index.module.css";
import { useCallback, useEffect, useState } from "react";
import dayjs from "dayjs";
import Modal from "react-modal";
import { Button } from "../../atoms/Button";
import { Select } from "../../atoms/Select";
import { Day } from "../../atoms/Day";
import { CalendarRegister } from "../../organisms/CalendarRegister";

import {
  dayTextCommmon,
  YearAndMonthAndDateList,
  amountOfDay,
} from "../../../lib/calendar";
import {
  SchduleRegisterInput,
} from "../../../lib/types";

type Calendar = {
  keyOfdayOfWeek: number;
  order: number;
  date: string;
};

type WeeklyDay = {
  days: Calendar[];
  week: number;
};

// type SchduleRegisterInput = {
//   selectYear: string;
//   selectMonth: string;
//   selectDay: string;
//   type: string;
//   memo: string;
// };

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "62.5rem",
  },
};

const isNowMonth = (yearAndMonth: string): boolean => {
  return yearAndMonth === dayjs().format("YYYY-MM");
};

export function Top() {
  const [count, changeCount] = useState<number>(0);
  const [days, setDays] = useState<WeeklyDay[]>([]);
  const [selectYear, changeYear] = useState<string>(dayTextCommmon("YYYY"));
  const [selectMonth, chnageMonth] = useState<string>(dayTextCommmon("MM"));
  const [modalIsOpen, setIsOpen] = useState(false);

  const openModal = (): void => {
    setIsOpen(true);
  };

  const closeModal = (): void => {
    setIsOpen(false);
  };

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

  const onRegisterSchedule = (registerData: SchduleRegisterInput) => {
    alert("I Can Re:do id!");
    console.log(registerData);
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
            <Select
              name="year"
              value={selectYear}
              selectList={
                YearAndMonthAndDateList(`${selectYear}-${selectMonth}`).yearList
              }
              onEventCallBack={(year: string) => {
                onChangeYearAndMonth(year, selectMonth);
              }}
            />
            <span className="mx-1">年</span>
            <Select
              name="month"
              value={selectMonth}
              selectList={
                YearAndMonthAndDateList(`${selectYear}-${selectMonth}`)
                  .monthList
              }
              onEventCallBack={(month: string) => {
                onChangeYearAndMonth(selectYear, month);
              }}
            />
            <span className="ml-1">月</span>
          </div>
          <div className={styles.btnArea}>
            <Button
              text="予定を登録"
              buttonColor="#a7f3d0"
              underBarColor="#059669"
              onEventCallBack={() => {
                openModal();
              }}
            />
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
                      <Day
                        key={el.date}
                        date={el.date}
                        order={el.order}
                        keyOfdayOfWeek={el.keyOfdayOfWeek}
                        selectMonth={selectMonth}
                        selectYear={selectYear}
                      />
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        <Modal
          isOpen={modalIsOpen}
          ariaHideApp={false}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <div className="">予定を登録</div>
          <CalendarRegister
            year={selectYear}
            month={selectMonth}
            onEventCallBack={(registerData: SchduleRegisterInput) =>
              onRegisterSchedule(registerData)
            }
          />
        </Modal>
      </main>
    </div>
  );
}
