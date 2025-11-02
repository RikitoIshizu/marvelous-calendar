'use client';
import { memo, useMemo } from 'react';

export type ButtonProps = {
	text: string;
	buttonColor?: string;
	width?: string;
	textColor?: string;
	onEventCallBack?: () => void;
	disabled?: boolean;
	type?: 'submit' | 'reset' | 'button';
	otherClasses?: string;
};

export const Button = memo(function Button(props: ButtonProps) {
	const classes = useMemo((): string => {
		let classes = 'rounded-md hover:opacity-[0.8]';
		classes += props.width ? ` ${props.width}` : ' w-[150px]';
		classes += props.buttonColor
			? ` ${props.buttonColor}`
			: ' bg-[rgb(3_105_161)]';
		props.textColor && (classes += ` ${props.textColor}`);
		props.otherClasses && (classes += ` ${props.otherClasses}`);
		props.disabled && (classes += ` bg-gray-300 text-[#fff]`);

		return classes;
	}, [
		props.buttonColor,
		props.textColor,
		props.width,
		props.otherClasses,
		props.disabled,
	]);

	return (
		<button
			type={props.type ?? 'button'}
			className={classes}
			onClick={props.onEventCallBack || undefined}
			disabled={props.disabled}
		>
			{props.text}
		</button>
	);
});
