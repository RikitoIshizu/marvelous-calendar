import { getScheduleDetail } from '@/lib/supabase';
import { Schedule } from '@/lib/types';
import { useCallback, useState } from 'react';

export const useSchedule = (date: string) => {
	const [schedules, setSchedules] = useState<Schedule[]>([]);

	// 編集用パラメータ
	const [scheduleId, setScheduleId] = useState<Schedule['id'] | ''>('');
	const [scheduleTitle, setScheduleTitle] = useState<Schedule['title']>('');
	const [scheduleDescription, setScheduletDescription] =
		useState<Schedule['description']>('');
	const [scheduleType, setScheduleType] =
		useState<Schedule['scheduleTypes']>(1);

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
	};
};
