'use client';
import { Select } from './Select';
import { HOURS, MINUTES } from 'shared/time';

type Hour = (typeof HOURS)[number];
type Minute = (typeof MINUTES)[number];

type Props = {
	startHour: Hour;
	startMinute: Minute;
	endHour: Hour;
	endMinute: Minute;
	onChangeStartHour: (_startHour: Hour) => void;
	onChangeStartMinute: (_startMinute: Minute) => void;
	onChangeEndHour: (_endHour: Hour) => void;
	onChangeEndMinute: (_endMinute: Minute) => void;
};

export const ScheduleTime = ({
	startHour,
	startMinute,
	endHour,
	endMinute,
	onChangeStartHour,
	onChangeStartMinute,
	onChangeEndHour,
	onChangeEndMinute,
}: Props) => {
	return (
		<div className="mt-3 flex items-center">
			<label htmlFor="description" className="mr-2">
				時間:
			</label>
			<Select
				name="start_hour"
				value={startHour}
				selectList={[...HOURS]}
				onEventCallBack={(startHour: Hour) => {
					onChangeStartHour(startHour);
				}}
			/>
			&nbsp;:&nbsp;
			<Select
				name="start_minute"
				value={startMinute}
				selectList={[...MINUTES]}
				onEventCallBack={(startMinute: Minute) => {
					onChangeStartMinute(startMinute);
				}}
			/>
			&nbsp;~&nbsp;
			<Select
				name="end_hour"
				value={endHour}
				selectList={[...HOURS]}
				onEventCallBack={(endHour: Hour) => {
					onChangeEndHour(endHour);
				}}
			/>
			&nbsp;:&nbsp;
			<Select
				name="end_minute"
				value={endMinute}
				selectList={[...MINUTES]}
				onEventCallBack={(endMinute: Minute) => {
					onChangeEndMinute(endMinute);
				}}
			/>
		</div>
	);
};
