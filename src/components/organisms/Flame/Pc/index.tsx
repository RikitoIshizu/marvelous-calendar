// import { useState } from "react";
// import Modal from "react-modal";

import Button from "@/components/atoms/Button";
// import { CalendarRegister } from "../../CalendarRegister";
import { Day } from "@/components/atoms/Day";
import Select from "@/components/atoms/Select";
import { YearAndMonthAndDateList } from "@/lib/calendar";
// import { SchduleRegisterInput } from "../../../../lib/types";

type Calendar = {
  keyOfdayOfWeek: number;
  order: number;
  date: string;
};

type WeeklyDay = {
  days: Calendar[];
  week: number;
};

// const customStyles = {
//   content: {
//     top: "50%",
//     left: "50%",
//     right: "auto",
//     bottom: "auto",
//     marginRight: "-50%",
//     transform: "translate(-50%, -50%)",
//     width: "62.5rem",
//   },
// };

type Props = {
  count: number;
  days: WeeklyDay[];
  selectYear: string;
  selectMonth: string;
  isNowMonth: boolean;
  onEventCallBack: Function;
  onChangeYearAndMonth: Function;
};

export function FlamePc(props: Props) {
  // const [modalIsOpen, setIsOpen] = useState(false);

  // const openModal = (): void => {
  //   setIsOpen(true);
  // };

  // const closeModal = (): void => {
  //   setIsOpen(false);
  // };

  // const onRegisterSchedule = (registerData: SchduleRegisterInput) => {
  //   alert("I Can Re:do id!");
  //   console.log(registerData);
  // };

  const onClickBtn = (c: number) => {
    return props.onEventCallBack(c);
  };

  const onChangeYearAndMonth = (y: string, m: string) => {
    return props.onChangeYearAndMonth(y, m);
  };

  return (
    <main className="w-full relative">
      <div
        id="calender-head"
        className="p-3 flex justify-between items-content w-full bg-white z-10"
      >
        <button
          onClick={() => {
            onClickBtn(props.count - 1);
          }}
        >
          <img src="./arrowLeft.svg" alt="前の月" className="h-[40px]" />
        </button>
        <div className="w-[300px] flex items-center">
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
        <div className="w-[450px] flex">
          {/* <Button
            text="予定を登録"
            buttonColor="#a7f3d0"
            underBarColor="#059669"
            onEventCallBack={() => {
              openModal();
            }}
          /> */}
          {props.isNowMonth ? (
            ""
          ) : (
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
        <button
          onClick={() => {
            onClickBtn(props.count + 1);
          }}
        >
          <img src="./arrowRight.svg" alt="次の月" className="h-[40px]" />
        </button>
      </div>
      <table
        id="calender-main-area"
        className="h-[calc(100vh-64px)] top-[64px] w-full border-solid border-4 border-black table-fixed"
      >
        <thead className="border-b-2 border-black">
          <tr>
            <td className="text-center p-2 font-bold text-xl border-r-2 border-black text-sky-600">
              日<br />
              Sunday
            </td>
            <td className="text-center p-2 font-bold text-xl border-r-2 border-black">
              月<br />
              Monday
            </td>
            <td className="text-center p-2 font-bold text-xl border-r-2 border-black">
              火<br />
              Tuesday
            </td>
            <td className="text-center p-2 font-bold text-xl border-r-2 border-black">
              水<br />
              Wednesday
            </td>
            <td className="text-center p-2 font-bold text-xl border-r-2 border-black">
              木<br />
              Thursday
            </td>
            <td className="text-center p-2 font-bold text-xl border-r-2 border-black">
              金<br />
              Friday
            </td>
            <td className="text-center p-2 font-bold text-xl text-amber-600">
              土<br />
              Saturday
            </td>
          </tr>
        </thead>
        <tbody>
          {props.days.map((el) => {
            return (
              <tr
                key={`${`${props.selectYear}-${props.selectMonth}`}-${el.week}`}
                className="border-b-2 border-black"
              >
                {el.days.map((el) => {
                  return (
                    <Day
                      key={el.date}
                      date={el.date}
                      order={el.order}
                      keyOfdayOfWeek={el.keyOfdayOfWeek}
                      selectMonth={props.selectMonth}
                      selectYear={props.selectYear}
                    />
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      {/* <Modal
        isOpen={modalIsOpen}
        ariaHideApp={false}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div className="">予定を登録</div>
        <CalendarRegister
          year={props.selectYear}
          month={props.selectMonth}
          onEventCallBack={(registerData: SchduleRegisterInput) =>
            onRegisterSchedule(registerData)
          }
        />
      </Modal> */}
    </main>
  );
}
