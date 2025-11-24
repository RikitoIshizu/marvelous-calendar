'use client';
import { Input } from '@/components/Input';
import { useRegisterSchedule } from '@/hooks/useRegisterSchedule';
import { useId } from 'react';

type UseRegisterSchedule = ReturnType<typeof useRegisterSchedule>;

type Props = {
	title: UseRegisterSchedule['title'];
	titleError: UseRegisterSchedule['titleError'];
	onChangeTitle: UseRegisterSchedule['setTitle'];
	onBlur: () => void;
};

export const InputTitle = (props: Props) => {
	const { title, titleError, onChangeTitle, onBlur } = props;
	const id = useId();

	return (
		<>
			<dt className="text-right pt-1">
				<label htmlFor={id} className="text-xl">
					タイトル:
				</label>
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
				{titleError && <p className="text-md text-[red] mt-1">{titleError}</p>}
			</dd>
		</>
	);
};
