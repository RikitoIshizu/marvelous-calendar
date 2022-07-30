type RadioType = {
  name: string;
  id: string;
  inputName: string;
  onEventCallBack: Function;
  selectedId: string;
};

export function Radio(props: RadioType) {
  function clickEvent(id: string): void {
    props.onEventCallBack(id);
  }

  return (
    <>
      <input
        type="radio"
        id={props.id}
        checked={props.selectedId === props.id}
        name={props.inputName}
        onClick={() => clickEvent(props.id)}
      />
      <label htmlFor={props.id}>{props.name}</label>
    </>
  );
}
