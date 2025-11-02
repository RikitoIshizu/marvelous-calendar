'use client';
import { Textarea } from 'components/Textarea';
import { useRegisterSchedule } from 'hooks/useRegisterSchedule';
import { ReactElement, useId } from 'react';

type UseRegisterSchedule = ReturnType<typeof useRegisterSchedule>;

type Props = {
	description: UseRegisterSchedule['description'];
	descriptionError: UseRegisterSchedule['descriptionError'];
	onchangeDescription: UseRegisterSchedule['setDescription'];
	onBlur?: () => void;
};

export function InputDescription(props: Props): ReactElement {
	const { description, descriptionError, onchangeDescription, onBlur } = props;
	const id = useId();

	return (
		<>
			<dt className="text-right pt-1">
				<label htmlFor={id} className="text-xl">
					メモ:
				</label>
			</dt>
			<dd>
				<Textarea
					id={id}
					name="description"
					value={description}
					placeholder="何かメモがあれば入力してください。"
					onChange={onchangeDescription}
					onBlur={onBlur}
				/>
				{descriptionError && (
					<p className="text-md text-[red]">{descriptionError}</p>
				)}
			</dd>
		</>
	);
}
