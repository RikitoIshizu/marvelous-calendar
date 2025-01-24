'use client';
import { Button as Btn } from '@/lib/types';
import { memo, NamedExoticComponent, useMemo } from 'react';

export const Button: NamedExoticComponent<Btn> = memo(function Btn(props: Btn) {
	const classes = useMemo((): string => {
		let classes = 'rounded-md hover:opacity-[0.8]';
		classes += props.width ? ` ${props.width}` : ' w-[150px]';
		classes += props.buttonColor
			? ` ${props.buttonColor}`
			: ' bg-[rgb(3_105_161)]';
		props.textColor && (classes += ` ${props.textColor}`);
		props.otherClasses && (classes += ` ${props.otherClasses}`);

		return classes;
	}, [props.buttonColor, props.textColor, props.width, props.otherClasses]);

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
