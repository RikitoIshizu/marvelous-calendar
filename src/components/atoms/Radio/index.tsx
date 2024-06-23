import React from "react";

type RadioType = {
  name: string;
  id: string;
  inputName: string;
  onEventCallBack: Function;
  selectedId: string;
};

const Radio = (props: RadioType): React.ReactElement => {
  function clickEvent(id: RadioType["id"]): void {
    props.onEventCallBack(id);
  }

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
};

export default Radio;
