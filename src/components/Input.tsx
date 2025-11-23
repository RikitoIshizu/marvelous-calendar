'use client';

type Props = {
	id?: string;
	name: string;
	text?: string;
	placeholder?: string;
	onChangeText: (_: string) => void;
	onBlur?: () => void;
	className?: string;
};

export const Input = (props: Props) => {
	const { id, name, text, placeholder, onChangeText, onBlur, className } =
		props;

	return (
		<input
			id={id}
			name={name}
			value={text}
			className={`resize-none border-2 rounded-lg border-slate-900 py-1 px-2 text-xl ${className ?? ''}`}
			placeholder={placeholder}
			onChange={(e) => {
				onChangeText(e.target.value);
			}}
			onBlur={() => onBlur?.()}
		/>
	);
};
