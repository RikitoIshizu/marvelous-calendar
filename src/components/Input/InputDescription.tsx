'use client';
import React, { useId } from 'react';

type Props = {
	description: string;
	descriptionError: string;
	onchangeDescription: Function;
	onBlur?: () => void;
};

export function InputDescription(props: Props): React.ReactElement {
	const { description, descriptionError, onchangeDescription, onBlur } = props;
	const id = useId();

	return (
		<div className="mt-3">
			<div className="flex">
				<label htmlFor={id} className="mr-2">
					メモ:
				</label>
				<textarea
					id={id}
					name="description"
					value={description}
					className="resize-none border-2 rounded-lg border-slate-900 w-2/3"
					placeholder="何かメモがあれば入力してください。"
					onChange={(e) => onchangeDescription(e.target.value)}
					onBlur={() => onBlur?.()}
				/>
			</div>
			{descriptionError && (
				<p className="text-xs text-[red]">{descriptionError}</p>
			)}
		</div>
	);
}
