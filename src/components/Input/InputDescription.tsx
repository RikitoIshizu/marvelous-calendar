'use client';
import { Textarea } from 'components/Textarea';
import React, { useId } from 'react';

type Props = {
	description: string;
	descriptionError: string;
	onchangeDescription: (_: string) => void;
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
				<Textarea
					id={id}
					name="description"
					value={description}
					placeholder="何かメモがあれば入力してください。"
					onChange={onchangeDescription}
					onBlur={onBlur}
				/>
			</div>
			{descriptionError && (
				<p className="text-xs text-[red]">{descriptionError}</p>
			)}
		</div>
	);
}
