'use client';
import { Select } from '@/components/Select';
import { useRegisterSchedule } from '@/hooks/useRegisterSchedule';
import { HOURS, MINUTES } from '@/utils/time';
import { ReactElement } from 'react';

type UseRegisterSchedule = ReturnType<typeof useRegisterSchedule>;

type Props = {
	startHour: UseRegisterSchedule['startHour'];
	startMinute: UseRegisterSchedule['startMinute'];
	endHour: UseRegisterSchedule['endHour'];
	endMinute: UseRegisterSchedule['endMinute'];
	timeError: UseRegisterSchedule['timeError'];
	onChangeStartHour: UseRegisterSchedule['setStartHour'];
	onChangeStartMinute: UseRegisterSchedule['setStartMinute'];
	onChangeEndHour: UseRegisterSchedule['setEndHour'];
	onChangeEndMinute: UseRegisterSchedule['setEndMinute'];
	onBlur: () => void;
};

export const ScheduleTime = (props: Props): ReactElement => (
	<>
		<dt className="text-right pt-1 text-xl">時間:</dt>
		<dd>
			<div className="flex items-center">
				<Select
					id="startHour"
					name="start_hour"
					value={props.startHour}
					selectList={[...HOURS]}
					onEventCallBack={props.onChangeStartHour}
					onBlur={() => props.onBlur()}
				/>
				<label htmlFor="startHour" className="mx-2">
					時
				</label>
				<Select
					id="startMinute"
					name="start_minute"
					value={props.startMinute}
					selectList={[...MINUTES]}
					onEventCallBack={props.onChangeStartMinute}
					onBlur={() => props.onBlur()}
				/>
				<label htmlFor="startMinute" className="mx-2">
					分
				</label>
				<span className="mr-2">~</span>
				<Select
					id="endHour"
					name="end_hour"
					value={props.endHour}
					selectList={[...HOURS]}
					onEventCallBack={props.onChangeEndHour}
					onBlur={() => props.onBlur()}
				/>
				<label htmlFor="endHour" className="mx-2">
					時
				</label>
				<Select
					id="endMinute"
					name="end_minute"
					value={props.endMinute}
					selectList={[...MINUTES]}
					onEventCallBack={props.onChangeEndMinute}
					onBlur={() => props.onBlur()}
				/>
				<label htmlFor="endMinute" className="ml-2">
					分
				</label>
			</div>
			{props.timeError && (
				<p className="text-md text-[red] mt-1">{props.timeError}</p>
			)}
		</dd>
	</>
);
