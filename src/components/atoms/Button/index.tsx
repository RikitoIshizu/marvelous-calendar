import styles from "./index.module.css";
import { Button as Btn } from "@/lib/types";

type ButtonStyles = {
  width: string;
  backgroundColor: string;
  borderBottom: string;
  color?: string;
};

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
  function clickEvent(): void {
    props.onEventCallBack();
  }

  return (
    <button
      style={buttonStyles(props)}
      className={styles.setCalendarBtn}
      onClick={() => clickEvent()}
    >
      {props.text}
    </button>
  );
};

export default Button;
