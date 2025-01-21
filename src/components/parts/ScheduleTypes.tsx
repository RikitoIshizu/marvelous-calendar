'use client';
import { Radio } from '@/components/parts/Radio';
import React from 'react';

const scheduleTypes = [
	{ id: '1', name: '仕事' },
	{ id: '2', name: '休日' },
	{ id: '3', name: 'プライベート' },
	{ id: '4', name: '会議' },
	{ id: '5', name: '法事' },
	{ id: '6', name: 'その他' },
];

type Props = {
	type: number | null;
	onEventCallBack: Function;
};

export function ScheduleTypes(props: Props): React.ReactElement {
	const { onEventCallBack, type } = props;

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
							selectedId={`${type}`}
							inputName="scheduleType"
							onEventCallBack={(e: string) => onEventCallBack(e)}
						/>
					</span>
				);
			})}
		</div>
	);
}
