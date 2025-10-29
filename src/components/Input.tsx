'use client';
import React from 'react';

type Props = {
	id?: string;
	name: string;
	text?: string;
	placeholder?: string;
	onChangeText: (_: string) => void;
	onBlur?: () => void;
	className?: string;
};

export function Input(props: Props): React.ReactElement {
	const { id, name, text, placeholder, onChangeText, onBlur, className } =
		props;

	return (
		<input
			id={id}
			name={name}
			value={text}
			className={`resize-none border-2 rounded-lg border-slate-900 ${className ?? ''}`}
			placeholder={placeholder}
			onChange={(e) => {
				onChangeText(e.target.value);
			}}
			onBlur={() => onBlur?.()}
		/>
	);
}
