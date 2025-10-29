'use client';
import React from 'react';

type TextareaProps = {
	id?: string;
	name?: string;
	value: string;
	placeholder?: string;
	className?: string;
	onChange: (_: string) => void;
	onBlur?: () => void;
};

export function Textarea(props: TextareaProps): React.ReactElement {
	const {
		id,
		name,
		value,
		placeholder,
		className = 'resize-none border-2 rounded-lg border-slate-900 w-2/3',
		onChange,
		onBlur,
	} = props;

	return (
		<textarea
			id={id}
			name={name}
			value={value}
			className={className}
			placeholder={placeholder}
			onChange={(e) => onChange(e.target.value)}
			onBlur={() => onBlur?.()}
		/>
	);
}
