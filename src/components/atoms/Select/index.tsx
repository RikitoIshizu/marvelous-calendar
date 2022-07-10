import styles from "./index.module.css";

type Props = {
  name: string;
  value: string;
  selectList: string[];
  onEventCallBack: Function;
};

export function Select(props: Props) {
  return (
    <select
      name={props.name}
      value={props.value}
      className={styles.selectBox}
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
  );
}
