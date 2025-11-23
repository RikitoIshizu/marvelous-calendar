'use client';

export type Props = {
	name: string;
	id: string;
	inputName: string;
	onEventCallBack: Function;
	selectedId: string;
};

export const Radio = (props: Props) => {
	const clickEvent = (id: Props['id']) => {
		props.onEventCallBack(id);
	};

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
};
