import React from "react";

type Props = {
  name: string;
  value: string;
  selectList: string[];
  suffix?: string;
  onEventCallBack: Function;
};

export function Select(props: Props): React.ReactElement {
  return (
    <>
      <select
        name={props.name}
        value={props.value}
        className="w-[150px] h-full border-2 rounded-lg border-slate-900 text-2xl text-center"
        onChange={(e) => props.onEventCallBack(e.target.value)}
      >
        {props.selectList?.map((el) => {
          return (
            <option key={el} value={el}>
              {Number(el)}
            </option>
          );
        })}
      </select>
      {props.suffix && <span className="mx-2">{props.suffix}</span>}
    </>
  );
}
