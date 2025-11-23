'use client';

type TextareaProps = {
	id?: string;
	name?: string;
	value: string;
	placeholder?: string;
	className?: string;
	onChange: (_: string) => void;
	onBlur?: () => void;
};

export const Textarea = (props: TextareaProps) => {
	const { id, name, value, placeholder, className, onChange, onBlur } = props;

	return (
		<textarea
			id={id}
			name={name}
			value={value}
			className={`resize-none border-2 rounded-lg border-slate-900 py-1 px-2 text-xl ${className ?? ''}`}
			placeholder={placeholder}
			onChange={(e) => onChange(e.target.value)}
			onBlur={() => onBlur?.()}
		/>
	);
};
