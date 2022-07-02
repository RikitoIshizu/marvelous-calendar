import styles from "./index.module.css";
import { Button as Btn } from "../../../lib/types";

export function Button(props: Btn) {
  const style = {
    width: props.width ? `${props.width}px` : "150px",
    backgroundColor: props.buttonColor ? props.buttonColor : "rgb(3 105 161);",
    color: props.textColor ? props.textColor : "",
    borderBottom: props.underBarColor
      ? `5px solid ${props.underBarColor}`
      : "5px solid rgb(3 105 161)",
  };

  function clickEvent(): void {
    props.onEventCallBack();
  }

  return (
    <button
      style={style}
      className={styles.setCalendarBtn}
      onClick={() => clickEvent()}
    >
      {props.text}
    </button>
  );
}
