import React, { memo, NamedExoticComponent, useCallback } from 'react';
import type { ChangeEvent } from 'react';

type Props = {
	name: string;
	value: string;
	selectList: string[];
	suffix?: string;
	onEventCallBack: Function;
};

export const Select: NamedExoticComponent<Props> = memo(function Select(
	props: Props,
) {
	const clickEvent = useCallback(
		(text: Props['value']): void => {
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
			>
				{props.selectList?.map((el) => {
					return (
						<option key={el} value={el}>
							{Number(el)}
						</option>
					);
				})}
			</select>
			{props.suffix && <span className="mx-2">{props.suffix}</span>}
		</>
	);
});
