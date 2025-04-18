'use client';
import { Radio } from 'components/Radio';
import { ReactElement } from 'react';
import { SchduleRegisterInput } from 'types/types';

const scheduleTypes = [
	{ id: '1', name: '仕事' },
	{ id: '2', name: '休日' },
	{ id: '3', name: 'プライベート' },
	{ id: '4', name: '会議' },
	{ id: '5', name: '法事' },
	{ id: '6', name: 'その他' },
];

type Props = {
	scheduleType: SchduleRegisterInput['scheduleTypes'];
	onEventCallBack: Function;
};

export const ScheduleTypes = (props: Props): ReactElement => {
	const { onEventCallBack, scheduleType } = props;

	return (
		<div className="mt-3 flex">
			<label htmlFor="description" className="mr-2">
				スケジュールの種類:
			</label>
			{scheduleTypes.map((el) => {
				return (
					<span key={el.id} className="ml-3">
						<Radio
							name={el.name}
							id={el.id}
							selectedId={`${scheduleType}`}
							inputName="scheduleType"
							onEventCallBack={(e: string) => onEventCallBack(e)}
						/>
					</span>
				);
			})}
		</div>
	);
};
