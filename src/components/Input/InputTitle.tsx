'use client';
import { Input } from 'components/Input';
import React, { useId } from 'react';

type Props = {
	title: string;
	titleError: string;
	onChangeTitle: (_: string) => void;
	onBlur?: () => void;
};

export function InputTitle(props: Props): React.ReactElement {
	const { title, titleError, onChangeTitle, onBlur } = props;
	const id = useId();

	return (
		<div className="mt-3">
			<div className="flex">
				<label htmlFor={id} className="mr-2">
					タイトル:
				</label>
				<Input
					id={id}
					name="title"
					text={title}
					placeholder="スケジュールのタイトルを入力"
					onChangeText={onChangeTitle}
					onBlur={onBlur}
					className="w-[300px]"
				/>
			</div>
			{titleError && <p className="text-xs text-[red]">{titleError}</p>}
		</div>
	);
}
