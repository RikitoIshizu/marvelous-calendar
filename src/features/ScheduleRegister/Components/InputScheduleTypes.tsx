'use client';
import { Radio } from '@/components/Radio';
import { useRegisterSchedule } from '@/hooks/useRegisterSchedule';
import { ReactElement } from 'react';

type UseRegisterSchedule = ReturnType<typeof useRegisterSchedule>;

const scheduleTypes = [
	{ id: '1', name: '仕事' },
	{ id: '2', name: '休日' },
	{ id: '3', name: 'プライベート' },
	{ id: '4', name: '会議' },
	{ id: '5', name: '法事' },
	{ id: '6', name: 'その他' },
];

type Props = {
	scheduleType: UseRegisterSchedule['scheduleType'];
	onEventCallBack: (_value: string) => void;
};

export const ScheduleTypes = (props: Props): ReactElement => {
	return (
		<>
			<dt className="text-right text-xl">スケジュールの種類:</dt>
			<dd className="flex">
				{scheduleTypes.map((el, index) => {
					return (
						<span
							key={el.id}
							className={scheduleTypes.length !== index + 1 ? 'mr-2' : ''}
						>
							<Radio
								name={el.name}
								id={el.id}
								selectedId={`${props.scheduleType}`}
								inputName="scheduleType"
								onEventCallBack={props.onEventCallBack}
							/>
						</span>
					);
				})}
			</dd>
		</>
	);
};
