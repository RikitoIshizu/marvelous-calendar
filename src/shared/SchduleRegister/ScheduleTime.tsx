'use client';
import { HOURS, MINUTES } from 'shared/time';
import { Select } from '../../components/Select';

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
	onBlur?: () => void;
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
	onBlur,
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
				onBlur={() => onBlur?.()}
			/>
			&nbsp;:&nbsp;
			<Select
				name="start_minute"
				value={startMinute}
				selectList={[...MINUTES]}
				onEventCallBack={(startMinute: Minute) => {
					onChangeStartMinute(startMinute);
				}}
				onBlur={() => onBlur?.()}
			/>
			&nbsp;~&nbsp;
			<Select
				name="end_hour"
				value={endHour}
				selectList={[...HOURS]}
				onEventCallBack={(endHour: Hour) => {
					onChangeEndHour(endHour);
				}}
				onBlur={() => onBlur?.()}
			/>
			&nbsp;:&nbsp;
			<Select
				name="end_minute"
				value={endMinute}
				selectList={[...MINUTES]}
				onEventCallBack={(endMinute: Minute) => {
					onChangeEndMinute(endMinute);
				}}
				onBlur={() => onBlur?.()}
			/>
		</div>
	);
};
