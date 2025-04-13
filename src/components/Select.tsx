'use client';
import type { ChangeEvent } from 'react';
import { useCallback } from 'react';

type Props = {
	name: string;
	value: string | number;
	selectList: string[] | number[];
	suffix?: string;
	onEventCallBack: Function;
	onBlur?: () => void;
};

export const Select = (props: Props) => {
	const clickEvent = useCallback(
		(text: Props['value']) => {
			props.onEventCallBack(text);
		},
		[props],
	);

	return (
		<>
			<select
				name={props.name}
				value={props.value}
				className="w-[150px] h-full border-2 rounded-lg border-slate-900 text-2xl text-center"
				onChange={(e: ChangeEvent<HTMLSelectElement>) =>
					clickEvent(e.target.value)
				}
				onBlur={() => props.onBlur?.()}
			>
				{props.selectList?.map((el) => {
					return (
						<option key={el} value={el}>
							{el}
						</option>
					);
				})}
			</select>
			{props.suffix && <span className="mx-2">{props.suffix}</span>}
		</>
	);
};
