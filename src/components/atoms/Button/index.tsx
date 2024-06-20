import { Button as Btn } from "@/lib/types";

type ButtonStyles = {
  width: string;
  backgroundColor: string;
  borderBottom: string;
  color?: string;
};

// TODO: tailwindで書く
export function buttonStyles(props: Btn) {
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

const Button = (props: Btn) => {
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
};

export default Button;
