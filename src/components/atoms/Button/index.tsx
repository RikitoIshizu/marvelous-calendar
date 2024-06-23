import { Button as Btn } from "@/lib/types";
import React from "react";

type ButtonStyles = {
  width: string;
  backgroundColor: string;
  borderBottom: string;
  color?: string;
};

// TODO: tailwindで書く
export function buttonStyles(props: Btn): ButtonStyles {
  const params: ButtonStyles = {
    width: props.width ? `${props.width}px` : "150px",
    backgroundColor: props.buttonColor ? props.buttonColor : "rgb(3 105 161);",
    borderBottom: props.underBarColor
      ? `5px solid ${props.underBarColor}`
      : "5px solid rgb(3 105 161)",
  };

  if (props.textColor) {
    params.color = props.textColor;
  }

  return params;
}

export function Button(props: Btn): React.ReactElement {
  return (
    <button
      type={props.type ? "submit" : "button"}
      style={buttonStyles(props)}
      className="rounded-md hover:mt-1 !hover:border-b-0"
      onClick={() => props.onEventCallBack && props.onEventCallBack()}
    >
      {props.text}
    </button>
  );
}
