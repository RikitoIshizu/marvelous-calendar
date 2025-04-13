'use client';
import { Select } from 'components/Select';
import dayjs from 'dayjs';
import { ComponentProps, useCallback, useMemo, useState } from 'react';
import { amountOfDay, dayTextCommmon } from 'shared/calendar';
import { getSchedule } from 'shared/supabase';
import { DayString, MonthString, Schedule } from 'types/types';

type Calendar = {
	keyOfdayOfWeek: number;
	order: number;
	date: string;
};

type WeeklyDay = {
	days: Calendar[];
	week: number;
};

const getCalendarDays = (val: number) => {
	const setYandM = dayjs().add(val, 'month').format('YYYY-MM');

	// カレンダーを取得する
	// その月の全日付を取得
	let nowCalendar: Calendar[] = [];

	// まずは現在見ている月のカレンダーの日付を取得する
	for (var i = 1; i <= amountOfDay(setYandM); i++) {
		const day = i.toString().padStart(2, '0');
		const yearAndMonth = dayTextCommmon('YYYY-MM', setYandM);
		const date = dayTextCommmon('YYYY-MM-DD', `${yearAndMonth}-${day}`);
		const keyOfdayOfWeek = dayjs(date).day();
		const order =
			nowCalendar.filter((el: Calendar) => el.keyOfdayOfWeek === keyOfdayOfWeek)
				.length + 1;

		const setData: Calendar = { date, keyOfdayOfWeek, order };
		nowCalendar = [...nowCalendar, setData];
	}

	// 足りない前後の月の日付を取得する。
	let prevMonthDate: Calendar[] = [];
	let nextMonthDate: Calendar[] = [];

	nowCalendar.forEach((date) => {
		const d = dayjs(date.date);
		const day: number = d.date();

		if (day === 1) {
			// 月初の場合、前月の足りない日数を追加する
			if (date.keyOfdayOfWeek) {
				for (var i = date.keyOfdayOfWeek; i > 0; i--) {
					const addPrevMonthDate = d.add(-i, 'day');
					prevMonthDate = [
						...prevMonthDate,
						{
							date: addPrevMonthDate.format('YYYY-MM-DD'),
							keyOfdayOfWeek: addPrevMonthDate.day(),
							order: 1,
						},
					];
				}
			}
		} else if (day === nowCalendar.length) {
			// 月末の場合、次月の足りない日数を追加する
			if (date.keyOfdayOfWeek !== 6) {
				for (var n = 1; n <= 6 - date.keyOfdayOfWeek; n++) {
					const addPrevMonthDate = d.add(n, 'day');
					nextMonthDate = [
						...nextMonthDate,
						{
							date: addPrevMonthDate.format('YYYY-MM-DD'),
							keyOfdayOfWeek: addPrevMonthDate.day(),
							order: 6,
						},
					];
				}
			}
		}
	});

	const displayCalendar = [...prevMonthDate, ...nowCalendar, ...nextMonthDate];

	let datePerWeek: WeeklyDay[] = [];
	let oneWeek: Calendar[] = [];
	let week = 1;

	// 週ごとに分ける
	displayCalendar.forEach((date: Calendar) => {
		oneWeek = [...oneWeek, date];

		if (date.keyOfdayOfWeek === 6) {
			const addData: WeeklyDay[] = [{ week, days: oneWeek }];

			datePerWeek = [...datePerWeek, ...addData];
			oneWeek = [];
			week++;
		}
	});

	return datePerWeek;
};

export const useCalandar = (initSchedules: Schedule[]) => {
	const [count, setCount] = useState<number>(0);
	const [days, setDays] = useState<WeeklyDay[]>(getCalendarDays(0)); //初期値を設定する
	const [year, setYear] = useState<string>(dayTextCommmon('YYYY'));
	const [month, setMonth] = useState<MonthString>(
		dayTextCommmon('MM') as MonthString,
	);
	const [day, setDay] = useState<DayString>(dayTextCommmon('DD') as DayString);
	const [schedules, setSchedules] = useState<Schedule[]>(initSchedules);

	const onGetSchedules = useCallback(async (y: number, m: number) => {
		const schedule = await getSchedule(y, m);
		setSchedules(schedule);
	}, []);

	const setNowYearAndMonth = useCallback(
		async (val: number) => {
			const y = dayjs().add(val, 'month').format('YYYY');
			const m = dayjs().add(val, 'month').format('MM') as MonthString;

			setYear(y);
			setMonth(m);

			onGetSchedules(Number(y), Number(m));
		},
		[onGetSchedules],
	);

	// 月を変える
	const changeMonth = useCallback(
		(c: number) => {
			setCount(c);
			setNowYearAndMonth(c);
			setDays(getCalendarDays(c));
		},
		[setCount, setNowYearAndMonth],
	);

	// 年と月を変える
	const onChangeYearAndMonth = useCallback<
		ComponentProps<typeof Select>['onEventCallBack']
	>(
		(year: string, month: string) => {
			const now = dayTextCommmon('YYYY-MM');
			const nowYandM = dayjs(now);
			const sltYandM = dayjs(`${year}-${month}`);
			const c = sltYandM.diff(nowYandM, 'month');

			changeMonth(c);
		},
		[changeMonth],
	);

	// 今見ているカレンダーが実際の現在の年月かどうか
	const isNowMonth = useMemo(() => count === 0, [count]);

	const getScheduleOnTheDate = useCallback(
		(day: string): Pick<Schedule, 'id' | 'title' | 'scheduleTypes'>[] => {
			const y = dayjs(day).format('YYYY');
			const m = dayjs(day).format('M');
			const d = dayjs(day).format('D');

			return schedules
				.filter((el) => {
					const { year, month, day } = el;

					return (
						Number(year) === Number(y) &&
						Number(month) === Number(m) &&
						Number(day) === Number(d)
					);
				})
				.map((el) => {
					const { id, title, scheduleTypes } = el;
					return { id, title, scheduleTypes };
				});
		},
		[schedules],
	);

	return {
		count,
		days,
		year,
		month,
		day,
		schedules,
		isNowMonth,
		changeMonth,
		onChangeYearAndMonth,
		getScheduleOnTheDate,
		onGetSchedules,
		setDay,
	};
};
