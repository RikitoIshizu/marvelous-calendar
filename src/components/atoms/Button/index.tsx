import { Button as Btn } from '@/lib/types';
import { memo, NamedExoticComponent, useMemo } from 'react';

export const Button: NamedExoticComponent<Btn> = memo(function Btn(props: Btn) {
  const classes = useMemo((): string => {
    let classes =
      'rounded-md hover:mt-1 !hover:border-b-0 border-4 border-solid ';
    classes += props.underBarColor
      ? ` border-[${props.underBarColor}]`
      : ' border-sky-700';
    classes += props.width ? ` w-[${props.width}px]` : ' w-[150px]';
    classes += props.buttonColor
      ? ` bg-[${props.buttonColor}]`
      : ' bg-[rgb(3_105_161)]';

    props.textColor && (classes += ` text-[${props.textColor}]`);

    return classes;
  }, []);

  return (
    <button
      type={props.type ? 'submit' : 'button'}
      className={classes}
      onClick={() => props.onEventCallBack && props.onEventCallBack()}
      disabled={props.disabled}
    >
      {props.text}
    </button>
  );
});
