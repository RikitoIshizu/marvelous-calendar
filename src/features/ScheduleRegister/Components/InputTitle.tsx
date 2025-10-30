'use client';
import { Input } from 'components/Input';
import { useRegisterSchedule } from 'hooks/useRegisterSchedule';
import { ReactElement, useId } from 'react';

type UseRegisterSchedule = ReturnType<typeof useRegisterSchedule>;

type Props = {
	title: UseRegisterSchedule['title'];
	titleError: UseRegisterSchedule['titleError'];
	onChangeTitle: UseRegisterSchedule['setTitle'];
	onBlur: () => void;
};

export function InputTitle(props: Props): ReactElement {
	const { title, titleError, onChangeTitle, onBlur } = props;
	const id = useId();

	return (
		<>
			<dt className="text-right">
				<label htmlFor={id}>タイトル:</label>
			</dt>
			<dd>
				<Input
					id={id}
					name="title"
					text={title}
					placeholder="スケジュールのタイトルを入力"
					onChangeText={onChangeTitle}
					onBlur={onBlur}
					className="w-[300px]"
				/>
				{titleError && <p className="text-xs text-[red]">{titleError}</p>}
			</dd>
		</>
	);
}
