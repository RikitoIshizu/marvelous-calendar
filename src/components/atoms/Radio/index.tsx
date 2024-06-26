import React, { useCallback } from "react";

type RadioType = {
  name: string;
  id: string;
  inputName: string;
  onEventCallBack: Function;
  selectedId: string;
};

export function Radio(props: RadioType): React.ReactElement {
  const clickEvent = useCallback(
    (id: RadioType["id"]): void => {
      props.onEventCallBack(id);
    },
    [props]
  );

  return (
    <>
      <input
        type="radio"
        id={props.id}
        checked={props.selectedId === props.id}
        name={props.inputName}
        onChange={() => clickEvent(props.id)}
      />
      <label htmlFor={props.id}>{props.name}</label>
    </>
  );
}
