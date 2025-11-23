'use client';
import { type ChangeEvent } from 'react';

type Props = {
	id?: string;
	name: string;
	value: string | number;
	selectList: string[] | number[];
	suffix?: string;
	suffixAs?: 'span' | 'label';
	onEventCallBack: Function;
	onBlur?: () => void;
};

export const Select = (props: Props) => {
	const clickEvent = (text: Props['value']) => {
		props.onEventCallBack(text);
	};

	const suffixAs = props.suffixAs ?? 'span';

	return (
		<>
			<select
				id={props.id}
				name={props.name}
				value={props.value}
				className="w-[150px] h-full border-2 rounded-lg border-slate-900 text-2xl text-center py-1 px-2"
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
			{props.suffix &&
				(suffixAs === 'label' ? (
					<label htmlFor={props.id} className="mx-2">
						{props.suffix}
					</label>
				) : (
					<span className="mx-2">{props.suffix}</span>
				))}
		</>
	);
};
