'use client';
import { useCallback, memo, NamedExoticComponent } from 'react';

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
				onChange={() => clickEvent(props.id)}
			/>
			<label htmlFor={props.id}>{props.name}</label>
		</>
	);
});
