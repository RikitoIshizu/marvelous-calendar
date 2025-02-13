import { getScheduleDetail } from 'shared/supabase';
import { Schedule } from 'types/types';
import { useCallback, useState } from 'react';
import { Hour, Minute } from 'shared/time';

export const useSchedule = (date: string, initSchedules: Schedule[]) => {
	const [schedules, setSchedules] = useState<Schedule[]>(initSchedules);

	// 編集用パラメータ
	const [scheduleId, setScheduleId] = useState<Schedule['id'] | ''>('');
	const [scheduleTitle, setScheduleTitle] = useState<Schedule['title']>('');
	const [scheduleDescription, setScheduletDescription] =
		useState<Schedule['description']>('');
	const [scheduleType, setScheduleType] =
		useState<Schedule['scheduleTypes']>(1);

	const [startHour, setStartHour] = useState<Hour>('00');
	const [startMinute, setStartMinute] = useState<Minute>('00');
	const [endHour, setEndHour] = useState<Hour>('00');
	const [endMinute, setEndMinute] = useState<Minute>('00');

	const loadSchedules = useCallback(async () => {
		const schedules = await getScheduleDetail(date);
		setSchedules(schedules);
	}, [date]);

	return {
		schedules,
		setSchedules,
		scheduleId,
		setScheduleId,
		scheduleTitle,
		setScheduleTitle,
		scheduleDescription,
		setScheduletDescription,
		scheduleType,
		setScheduleType,
		loadSchedules,
		startHour,
		setStartHour,
		startMinute,
		setStartMinute,
		endHour,
		setEndHour,
		endMinute,
		setEndMinute,
	};
};
