import React, { memo, NamedExoticComponent } from 'react';

type Props = {
  name: string;
  text?: string;
  placeholder?: string;
  onChangeText: Function;
  className?: string;
};

export const Input: NamedExoticComponent<Props> = memo(function Input(
  props: Props
) {
  const { name, text, placeholder, onChangeText } = props;

  return (
    <input
      name={name}
      value={text}
      className={`resize-none border-2 rounded-lg border-slate-900 ${props.className}`}
      placeholder={placeholder}
      onChange={(e) => {
        onChangeText(e.target.value);
      }}
    />
  );
});
