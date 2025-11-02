'use client';
import { memo, NamedExoticComponent, useCallback } from 'react';

export type Props = {
	name: string;
	id: string;
	inputName: string;
	onEventCallBack: Function;
	selectedId: string;
};

export const Radio: NamedExoticComponent<Props> = memo(function Radio(
	props: Props,
) {
	const clickEvent = useCallback(
		(id: Props['id']) => {
			props.onEventCallBack(id);
		},
		[props],
	);

	return (
		<>
			<input
				type="radio"
				id={props.id}
				checked={props.selectedId === props.id}
				name={props.inputName}
				className="mr-1"
				onChange={() => clickEvent(props.id)}
			/>
			<label htmlFor={props.id} className="text-xl cursor-pointer">
				{props.name}
			</label>
		</>
	);
});
